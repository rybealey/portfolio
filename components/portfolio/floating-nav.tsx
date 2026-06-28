"use client";

import { User, Briefcase } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavKey = "about" | "work";

const ITEMS: { key: NavKey; label: string; icon: LucideIcon }[] = [
  { key: "about", label: "about", icon: User },
  { key: "work", label: "work", icon: Briefcase },
];

/**
 * FloatingNav — the fixed, frosted-glass pill nav at the bottom of the page.
 * The active item (driven by scroll position) lifts onto a white chip.
 */
export function FloatingNav({
  active,
  onNavigate,
  hidden = false,
}: {
  active: NavKey;
  onNavigate: (key: NavKey) => void;
  hidden?: boolean;
}) {
  return (
    <div
      aria-hidden={hidden}
      className="fixed bottom-[22px] left-1/2 z-[60]"
      style={{
        transform: hidden
          ? "translateX(-50%) translateY(160%)"
          : "translateX(-50%) translateY(0)",
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? "none" : "auto",
        transition: "transform 0.4s var(--ease-out), opacity 0.3s ease",
      }}
    >
      <div
        className="relative flex w-[min(300px,calc(100vw-20px))] rounded-full p-[5px]"
        style={{
          background: "rgba(252,251,247,0.55)",
          backdropFilter: "blur(22px) saturate(180%)",
          WebkitBackdropFilter: "blur(22px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.55)",
          boxShadow:
            "0 10px 34px rgba(27,32,28,0.20), 0 2px 8px rgba(27,32,28,0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
        }}
      >
        {ITEMS.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onNavigate(key)}
              aria-current={isActive ? "page" : undefined}
              className="relative z-[1] flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-[clamp(5px,1.4vw,7px)] rounded-full border border-transparent px-[clamp(7px,1.6vw,12px)] py-[9px]"
              style={{
                background: isActive ? "rgba(255,255,255,0.92)" : "transparent",
                boxShadow: isActive
                  ? "0 2px 8px rgba(27,32,28,0.13), inset 0 1px 0 rgba(255,255,255,0.85)"
                  : "none",
                color: isActive ? "var(--accent-hover)" : "var(--text-muted)",
                transition:
                  "background-color 0.3s ease, box-shadow 0.3s ease, color 0.3s ease",
              }}
            >
              <Icon size={16} strokeWidth={1.8} className="flex-none" />
              <span className="font-mono text-[clamp(10px,2.5vw,11px)] tracking-[0.04em] whitespace-nowrap">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
