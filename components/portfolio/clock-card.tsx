"use client";

import { useEffect, useState } from "react";

/**
 * ClockCard — live local time for Austin, TX (Central). Self-contained:
 * ticks every second. Renders a stable placeholder until mounted to keep
 * server and client markup in sync.
 */
export function ClockCard() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    // Populate asynchronously (after first paint) to avoid a hydration
    // mismatch and a cascading synchronous render inside the effect.
    const initial = setTimeout(tick, 0);
    const interval = setInterval(tick, 1000);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, []);

  const tz = "America/Chicago";
  let clockTime = "--:--:--";
  let meridiem = "";
  let dateStr = "—";

  if (now) {
    const raw = now.toLocaleTimeString("en-US", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    const [time, mer] = raw.split(" ");
    clockTime = time;
    meridiem = (mer ?? "").toLowerCase();
    dateStr = now.toLocaleDateString("en-US", {
      timeZone: tz,
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="bento flex flex-col p-[22px]">
      <div className="mono-label">
        <span className="opacity-55">{"// "}</span>local_time
      </div>
      <div className="mt-[18px] flex items-end justify-between gap-3">
        <div className="flex items-baseline gap-1.5">
          <span
            className="font-mono text-[28px] font-medium tracking-[-0.02em]"
            style={{ color: "var(--text-strong)" }}
            suppressHydrationWarning
          >
            {clockTime}
          </span>
          <span
            className="font-mono text-xs"
            style={{ color: "var(--text-muted)" }}
            suppressHydrationWarning
          >
            {meridiem}
          </span>
        </div>
        <div className="text-right">
          <div
            className="font-mono text-xs"
            style={{ color: "var(--text-body)" }}
            suppressHydrationWarning
          >
            {dateStr}
          </div>
          <div
            className="mt-1 font-mono text-[11px]"
            style={{ color: "var(--text-muted)" }}
          >
            Austin, TX · Central
          </div>
        </div>
      </div>
    </div>
  );
}
