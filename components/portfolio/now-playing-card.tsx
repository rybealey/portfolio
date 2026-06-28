"use client";

const BAR_HEIGHTS = [16, 26, 12, 30, 18, 24, 14];

/**
 * NowPlayingCard — a faux "now playing" widget with an animated mono
 * equalizer. Bars pulse via the `eq` keyframes defined in globals.css.
 */
export function NowPlayingCard({ playing = true }: { playing?: boolean }) {
  return (
    <div className="bento flex flex-col p-[22px]">
      <div className="flex items-center justify-between">
        <div className="mono-label">
          <span className="opacity-55">{"// "}</span>now_playing
        </div>
        <div
          className="font-mono text-[11px]"
          style={{ color: "var(--text-accent)" }}
        >
          {playing ? "▸ playing" : "❚❚ paused"}
        </div>
      </div>
      <div className="mt-[18px] flex items-center gap-4">
        <div className="flex h-[34px] w-[56px] flex-none items-end gap-[3px]">
          {BAR_HEIGHTS.map((h, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                width: "4px",
                height: `${h}px`,
                borderRadius: "2px",
                background: i % 2 ? "var(--xanadu-400)" : "var(--xanadu-500)",
                transformOrigin: "bottom",
                animation: `eq ${680 + i * 70}ms ease-in-out ${i * 90}ms infinite alternate`,
                animationPlayState: playing ? "running" : "paused",
              }}
            />
          ))}
        </div>
        <div className="min-w-0">
          <div
            className="overflow-hidden text-[19px] leading-[1.15] text-ellipsis whitespace-nowrap"
            style={{ fontFamily: "var(--font-serif)", color: "var(--text-strong)" }}
          >
            Something for your M.I.N.D.
          </div>
          <div
            className="mt-1 font-mono text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            Superorganism
          </div>
        </div>
      </div>
    </div>
  );
}
