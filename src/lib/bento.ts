// Drag-and-drop reordering for the home bento grid.
//
// Only cells marked [data-movable] move, and only among each other: fixed
// cells keep their DOM slots. The DOM order is the source of truth, so the
// visual order, the tab order and the screen-reader order always match.
// Mouse/pen and keyboard (the grip button) feed the same reorder + FLIP
// animation path. Touch devices get the fixed, designed layout: dragging
// there fights page scrolling, so it is switched off entirely.

const STORAGE_KEY = 'rb:bento';
const DRAG_THRESHOLD = 6;
/** Keep in sync with the CSS that shows the grips in BentoGrid.astro. */
export const CAN_REARRANGE = '(hover: hover) and (pointer: fine)';
const EDGE = 64;
const SPRING = 'cubic-bezier(0.3, 1.3, 0.6, 1)';

type Point = { x: number; y: number };
type Box = { left: number; top: number; width: number; height: number };

interface PointerDrag {
  cell: HTMLElement;
  pointerId: number;
  start: Point;
  last: Point;
  grab: Point;
  active: boolean;
  lock: HTMLElement | null;
  frame: number | undefined;
}

export function initBento(grid: HTMLElement) {
  if (!matchMedia(CAN_REARRANGE).matches) return;

  const live = document.querySelector<HTMLElement>('[data-bento-live]');
  const resetButton = document.querySelector<HTMLButtonElement>('[data-bento-reset]');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  const movables = () => [...grid.querySelectorAll<HTMLElement>(':scope > [data-movable]')];
  const idOf = (cell: HTMLElement) => cell.dataset.tileId!;
  const nameOf = (cell: HTMLElement) => cell.querySelector('[data-grip]')?.getAttribute('aria-label')?.replace(/^Move | tile$/g, '') ?? idOf(cell);
  const order = () => movables().map(idOf);

  // The inline restore script records the designed order before applying a
  // saved one, so reset always returns to the server-rendered layout.
  const defaultOrder: string[] = grid.dataset.defaultOrder ? JSON.parse(grid.dataset.defaultOrder) : order();

  const announce = (message: string) => {
    if (!live) return;
    live.textContent = '';
    requestAnimationFrame(() => (live.textContent = message));
  };

  const save = () => {
    const current = order();
    const isDefault = current.every((id, i) => id === defaultOrder[i]);
    try {
      if (isDefault) localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch {}
    if (resetButton) resetButton.hidden = isDefault;
  };

  const layoutBox = (el: HTMLElement): Box => ({
    left: el.offsetLeft,
    top: el.offsetTop,
    width: el.offsetWidth,
    height: el.offsetHeight,
  });

  // Where each cell is drawn right now, including any running animation.
  const visualOrigins = () => {
    const gridRect = grid.getBoundingClientRect();
    const map = new Map<HTMLElement, Point>();
    for (const el of grid.children) {
      if (!(el instanceof HTMLElement) || !el.classList.contains('cell')) continue;
      const r = el.getBoundingClientRect();
      map.set(el, { x: r.left - gridRect.left, y: r.top - gridRect.top });
    }
    return map;
  };

  // Set while cells are detached, so the focusout that a DOM move causes
  // isn't mistaken for the user leaving a picked-up tile.
  let reordering = false;

  /**
   * Put the movable cells in `ids` order. Only movable cells whose slot
   * changes are touched: fixed cells (and their running animations) stay put.
   * `pinned` is the cell being dragged or keyboard-moved; moving a node drops
   * its pointer capture and focus, so both are restored afterwards.
   */
  const applyOrder = (ids: string[], pinned?: HTMLElement, pointerId?: number) => {
    const cells = movables();
    const byId = new Map(cells.map((c) => [idOf(c), c]));
    const hadFocus = pinned?.contains(document.activeElement) ? (document.activeElement as HTMLElement) : null;
    const before = visualOrigins();

    reordering = true;
    const markers = cells.map((cell, i) => {
      if (idOf(cell) === ids[i]) return null;
      const marker = document.createComment('');
      cell.replaceWith(marker);
      return marker;
    });
    markers.forEach((marker, i) => marker?.replaceWith(byId.get(ids[i]!)!));
    hadFocus?.focus({ preventScroll: true });
    reordering = false;
    if (pinned && pointerId !== undefined) {
      try {
        pinned.setPointerCapture(pointerId);
      } catch {}
    }

    if (reducedMotion.matches) return;
    for (const [el, from] of before) {
      if (el === pinned && el.classList.contains('is-dragging')) continue;
      const dx = from.x - el.offsetLeft;
      const dy = from.y - el.offsetTop;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;
      el.getAnimations().forEach((a) => a.cancel());
      el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], {
        duration: 240,
        easing: SPRING,
      });
    }
  };

  const moveTo = (cell: HTMLElement, targetIndex: number, pointerId?: number) => {
    const ids = order();
    const from = ids.indexOf(idOf(cell));
    const to = Math.max(0, Math.min(ids.length - 1, targetIndex));
    if (from === to) return false;
    ids.splice(from, 1);
    ids.splice(to, 0, idOf(cell));
    applyOrder(ids, cell, pointerId);
    return true;
  };

  const position = (cell: HTMLElement) => `Position ${order().indexOf(idOf(cell)) + 1} of ${order().length}.`;

  // ---------------------------------------------------------------- pointer

  let drag: PointerDrag | null = null;
  let suppressClick = false;
  const slot = document.createElement('div');
  slot.className = 'drop-slot';
  slot.setAttribute('aria-hidden', 'true');

  const placeSlot = (cell: HTMLElement) => {
    const box = layoutBox(cell);
    Object.assign(slot.style, {
      left: `${box.left}px`,
      top: `${box.top}px`,
      width: `${box.width}px`,
      height: `${box.height}px`,
    });
  };

  const gridPoint = (p: Point): Point => {
    const r = grid.getBoundingClientRect();
    return { x: p.x - r.left, y: p.y - r.top };
  };

  const follow = () => {
    if (!drag?.active) return;
    const { cell } = drag;
    const p = gridPoint(drag.last);
    cell.style.transform = `translate(${p.x - drag.grab.x - cell.offsetLeft}px, ${p.y - drag.grab.y - cell.offsetTop}px)`;

    // Hit-test against layout boxes, not animated ones, so tiles in motion
    // don't trigger a second swap. `lock` stops two tiles of different
    // sizes from swapping back and forth while the pointer rests on them.
    const target = movables().find((c) => {
      if (c === cell) return false;
      const b = layoutBox(c);
      return p.x >= b.left && p.x <= b.left + b.width && p.y >= b.top && p.y <= b.top + b.height;
    });
    if (drag.lock && target !== drag.lock) drag.lock = null;
    if (target && target !== drag.lock) {
      if (moveTo(cell, order().indexOf(idOf(target)), drag.pointerId)) {
        drag.lock = target;
        placeSlot(cell);
        // The cell's layout slot moved; re-anchor it under the pointer.
        cell.style.transform = `translate(${p.x - drag.grab.x - cell.offsetLeft}px, ${p.y - drag.grab.y - cell.offsetTop}px)`;
      }
    }

    // Scroll the page when dragging near the top or bottom edge.
    const y = drag.last.y;
    const speed = y < EDGE ? -(EDGE - y) / 4 : y > innerHeight - EDGE ? (y - (innerHeight - EDGE)) / 4 : 0;
    if (speed) window.scrollBy(0, speed);
    drag.frame = speed ? requestAnimationFrame(follow) : undefined;
  };

  const requestFollow = () => {
    if (drag?.active && drag.frame === undefined) drag.frame = requestAnimationFrame(() => {
      if (drag) drag.frame = undefined;
      follow();
    });
  };

  const startDrag = () => {
    if (!drag) return;
    const { cell } = drag;
    drag.active = true;
    const p = gridPoint(drag.start);
    drag.grab = { x: p.x - cell.offsetLeft, y: p.y - cell.offsetTop };
    cell.getAnimations().forEach((a) => a.cancel());
    try {
      cell.setPointerCapture(drag.pointerId);
    } catch {}
    cell.classList.add('is-dragging');
    placeSlot(cell);
    grid.append(slot);
    announce(`Moving ${nameOf(cell)}. ${position(cell)}`);
    requestFollow();
  };

  const endDrag = (commit: boolean) => {
    if (!drag) return;
    const { cell, active, frame } = drag;
    if (frame !== undefined) cancelAnimationFrame(frame);
    drag = null;
    if (!active) return;

    suppressClick = true;
    setTimeout(() => (suppressClick = false), 0);
    const from = cell.style.transform;
    cell.style.transform = '';
    cell.classList.remove('is-dragging');
    slot.remove();
    if (!reducedMotion.matches && from) {
      cell.animate([{ transform: from }, { transform: 'none' }], { duration: 220, easing: SPRING });
    }
    if (commit) {
      save();
      announce(`Dropped ${nameOf(cell)}. ${position(cell)}`);
    }
  };

  grid.addEventListener('pointerdown', (event) => {
    if (drag || pickedCell || event.button !== 0 || event.pointerType === 'touch') return;
    const cell = (event.target as Element).closest<HTMLElement>('[data-movable]');
    if (!cell || cell.parentElement !== grid) return;
    const point = { x: event.clientX, y: event.clientY };
    drag = { cell, pointerId: event.pointerId, start: point, last: point, grab: { x: 0, y: 0 }, active: false, lock: null, frame: undefined };
  });

  grid.addEventListener('pointermove', (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    drag.last = { x: event.clientX, y: event.clientY };
    if (drag.active) return requestFollow();
    if (Math.hypot(drag.last.x - drag.start.x, drag.last.y - drag.start.y) > DRAG_THRESHOLD) startDrag();
  });

  grid.addEventListener('pointerup', (event) => {
    if (drag && event.pointerId === drag.pointerId) endDrag(true);
  });
  grid.addEventListener('pointercancel', (event) => {
    if (drag && event.pointerId === drag.pointerId) endDrag(true);
  });

  grid.addEventListener('dragstart', (event) => event.preventDefault());
  grid.addEventListener(
    'click',
    (event) => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopPropagation();
    },
    true,
  );

  // --------------------------------------------------------------- keyboard

  let pickedCell: HTMLElement | null = null;
  let pickedFrom: string[] = [];

  const setPicked = (cell: HTMLElement | null) => {
    if (pickedCell) {
      pickedCell.classList.remove('is-picked');
      pickedCell.querySelector('[data-grip]')?.setAttribute('aria-pressed', 'false');
    }
    pickedCell = cell;
    if (cell) {
      cell.classList.add('is-picked');
      cell.querySelector('[data-grip]')?.setAttribute('aria-pressed', 'true');
    }
  };

  const drop = () => {
    if (!pickedCell) return;
    const cell = pickedCell;
    setPicked(null);
    save();
    announce(`Dropped ${nameOf(cell)}. ${position(cell)}`);
  };

  grid.addEventListener('click', (event) => {
    const grip = (event.target as Element).closest<HTMLButtonElement>('[data-grip]');
    if (!grip) return;
    const cell = grip.closest<HTMLElement>('[data-movable]')!;
    if (pickedCell === cell) return drop();
    if (pickedCell) drop();
    pickedFrom = order();
    setPicked(cell);
    announce(`Picked up ${nameOf(cell)}. ${position(cell)} Use the arrow keys to move it, Space to drop, Escape to cancel.`);
  });

  grid.addEventListener('keydown', (event) => {
    if (!pickedCell || !(event.target as Element).closest('[data-grip]')) return;
    const cell = pickedCell;
    const index = order().indexOf(idOf(cell));
    const step = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 }[event.key];
    if (step !== undefined) {
      event.preventDefault();
      if (moveTo(cell, index + step)) announce(position(cell));
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      if (moveTo(cell, event.key === 'Home' ? 0 : order().length - 1)) announce(position(cell));
    } else if (event.key === 'Escape') {
      event.preventDefault();
      applyOrder(pickedFrom, cell);
      setPicked(null);
      announce(`Move cancelled. ${nameOf(cell)} is back at ${position(cell).toLowerCase()}`);
    }
  });

  grid.addEventListener('focusout', (event) => {
    if (reordering || !pickedCell || !(event.target as Element).closest('[data-grip]')) return;
    if (!pickedCell.contains(event.relatedTarget as Node)) drop();
  });

  // ------------------------------------------------------------------ reset

  const reset = () => {
    setPicked(null);
    applyOrder(defaultOrder);
    save();
    announce('Layout reset to the original order.');
  };
  resetButton?.addEventListener('click', reset);
  document.addEventListener('bento:reset', reset);

  if (resetButton) resetButton.hidden = order().every((id, i) => id === defaultOrder[i]);
}
