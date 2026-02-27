"use client";

import { useState } from "react";

// Static daily data for the last 30 days (Jan 28 – Feb 27)
const VISITORS = [180,210,190,250,280,220,195,310,340,290,320,380,350,300,410,390,430,460,420,480,450,500,470,490,460,510,480,520,500,490];
const PAGEVIEWS = [420,510,460,590,650,530,480,740,810,690,760,890,840,710,960,930,1010,1080,990,1130,1060,1190,1110,1160,1090,1220,1150,1240,1180,1160];
const SESSIONS  = [140,165,150,200,225,175,155,245,270,230,255,305,280,240,330,310,345,370,335,385,360,405,375,395,370,410,385,420,400,395];

const TABS = [
  { key: "visitors",  label: "Visitors",   data: VISITORS  },
  { key: "pageviews", label: "Page Views", data: PAGEVIEWS },
  { key: "sessions",  label: "Sessions",   data: SESSIONS  },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const X_LABELS = ["Jan 28", "Feb 3", "Feb 9", "Feb 15", "Feb 21", "Feb 27"];

function buildLinePath(data: number[], w: number, h: number) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const xStep = w / (data.length - 1);
  return data
    .map((v, i) => {
      const x = (i * xStep).toFixed(1);
      const y = (h - ((v - min) / range) * h * 0.82 - h * 0.06).toFixed(1);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

export function AnalyticsChart() {
  const [active, setActive] = useState<TabKey>("visitors");
  const tab = TABS.find((t) => t.key === active)!;

  const W = 1000;
  const H = 184;

  const max = Math.max(...tab.data);
  const yLabels = [max, Math.round(max * 0.75), Math.round(max * 0.5), Math.round(max * 0.25), 0];

  const linePath = buildLinePath(tab.data, W, H);
  const fillPath = `${linePath} L ${W} ${H} L 0 ${H} Z`;

  return (
    <div className="rounded-lg border border-border-light bg-bg-page">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-light px-6 py-5">
        <span className="text-[15px] font-semibold text-text-primary">Traffic Overview</span>
        <div className="flex items-center rounded-md bg-bg-card-alt p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`rounded px-3.5 py-1.5 text-xs font-medium transition-colors ${
                active === t.key
                  ? "bg-bg-card text-text-primary shadow-sm"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart body */}
      <div className="flex gap-4 px-6 pt-5">
        {/* Y-axis */}
        <div className="flex w-10 shrink-0 flex-col justify-between pb-4 text-right">
          {yLabels.map((v) => (
            <span key={v} className="font-mono text-[10px] text-text-muted">
              {v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
            </span>
          ))}
        </div>

        {/* SVG */}
        <div className="min-w-0 flex-1">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            style={{ height: 184 }}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
              <line
                key={pct}
                x1="0" y1={H * pct} x2={W} y2={H * pct}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
            ))}
            {/* Fill */}
            <path d={fillPath} fill="url(#analyticsGrad)" />
            {/* Line */}
            <path d={linePath} fill="none" stroke="#22D3EE" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* X-axis */}
      <div className="flex justify-between pb-4 pl-16 pr-6">
        {X_LABELS.map((label) => (
          <span key={label} className="font-mono text-[10px] text-text-muted">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
