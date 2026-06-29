"use client";

/**
 * KnightLaunchGuide — a faithful, self-contained recreation of the official
 * UCF / KnightLaunch Design System Guide, rendered in its own black-and-gold
 * language (isolated under `.kl-guide`, see ./guide.css). Reached from the
 * KnightLaunch project's "visit live" action. Typographic lockup only — UCF's
 * Pegasus mark is deliberately not reproduced.
 */

import Link from "next/link";
import { useState, type ReactNode } from "react";

/* ---------------- icons (curated Lucide set, inline SVG) ---------------- */

type IconName =
  | "compass"
  | "drafting-compass"
  | "rocket"
  | "swords"
  | "trophy"
  | "lightbulb"
  | "mic"
  | "handshake"
  | "users"
  | "mail"
  | "arrow-right"
  | "chevron-down"
  | "calendar";

const ICON_PATHS: Record<IconName, ReactNode> = {
  compass: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </>
  ),
  "drafting-compass": (
    <>
      <path d="m12.99 6.74 1.93 3.44" />
      <path d="M19.136 12a10 10 0 0 1-14.271 0" />
      <path d="m21 21-2.16-3.84" />
      <path d="m3 21 8.02-14.26" />
      <circle cx="12" cy="5" r="2" />
    </>
  ),
  rocket: (
    <>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M15 9h5s-.55 3.03-2 4c-1.62 1.08-5 0-5 0" />
    </>
  ),
  swords: (
    <>
      <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
      <line x1="13" x2="19" y1="19" y2="13" />
      <line x1="16" x2="20" y1="16" y2="20" />
      <line x1="19" x2="21" y1="21" y2="19" />
      <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
      <line x1="5" x2="9" y1="14" y2="18" />
      <line x1="7" x2="4" y1="17" y2="20" />
      <line x1="3" x2="5" y1="19" y2="21" />
    </>
  ),
  trophy: (
    <>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </>
  ),
  lightbulb: (
    <>
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </>
  ),
  mic: (
    <>
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </>
  ),
  handshake: (
    <>
      <path d="m11 17 2 2a1 1 0 1 0 3-3" />
      <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25H21" />
      <path d="m21 3 1 11h-2" />
      <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
      <path d="M3 4h8" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  mail: (
    <>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </>
  ),
  "arrow-right": (
    <>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </>
  ),
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  calendar: (
    <>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </>
  ),
};

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ display: "inline-block", flex: "none", verticalAlign: "middle" }}
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

/* ---------------- shared brand pieces ---------------- */

function Lockup({
  size = "sm",
  dark = false,
  parent,
  as = "span",
  href,
}: {
  size?: "sm" | "md" | "lg";
  dark?: boolean;
  parent: string;
  as?: "span" | "a";
  href?: string;
}) {
  const cls = `kl-lockup kl-lockup--${size}${dark ? " kl-lockup--dark" : ""}`;
  const inner = (
    <>
      <span className="kl-lockup__word">KNIGHTLAUNCH</span>
      <span className="kl-lockup__rule" />
      <span className="kl-lockup__parent">{parent}</span>
    </>
  );
  if (as === "a")
    return (
      <a className={cls} href={href} aria-label="KnightLaunch" style={{ textDecoration: "none" }}>
        {inner}
      </a>
    );
  return <span className={cls}>{inner}</span>;
}

/* ---------------- guide data ---------------- */

const NAV = [
  ["overview", "Overview"],
  ["colors", "Color"],
  ["type", "Type"],
  ["spacing", "Spacing"],
  ["effects", "Effects"],
  ["icons", "Icons"],
  ["components", "Components"],
  ["homepage", "Homepage"],
] as const;

type SwatchDef = { name: string; hex: string; desc?: string; note?: string; lightBorder?: boolean };

const GOLD_SWATCHES: SwatchDef[] = [
  { name: "--gold", hex: "#ffc904", desc: "PMS 7406 · brand gold" },
  { name: "--gold-hover", hex: "#e6b400", desc: "Hover / pressed on gold" },
  { name: "--gold-50", hex: "#fff4cd", desc: "Soft gold wash" },
  { name: "--gold-text", hex: "#6b5500", desc: "Legible gold TEXT on white" },
  { name: "--gold-metallic-print", hex: "#ba9b37", desc: "Metallic gold", note: "Print / foil only" },
];

const BLACK_SWATCHES: SwatchDef[] = [
  { name: "--black", hex: "#000000", desc: "100% — brand black" },
  { name: "--black-90", hex: "#1a1a1a", desc: "Near-black surfaces" },
  { name: "--black-75", hex: "#404040", desc: "75% — strong text" },
  { name: "--black-50", hex: "#808080", desc: "50% — muted text" },
  { name: "--black-25", hex: "#bfbfbf", desc: "25% — borders / disabled" },
  { name: "--black-10", hex: "#e6e6e6", desc: "Hairlines / dividers" },
  { name: "--black-05", hex: "#f4f4f4", desc: "Off-white section surface" },
  { name: "--white", hex: "#ffffff", desc: "Default page surface", lightBorder: true },
];

const STATUS_SWATCHES: SwatchDef[] = [
  { name: "--success", hex: "#2e7d46" },
  { name: "--warning", hex: "#b3590a" },
  { name: "--danger", hex: "#c2342a" },
];

const DISPLAY_SCALE = [
  { label: "Hero · 5xl · 84px", size: 84, weight: 700 },
  { label: "Display · 4xl · 64px", size: 64, weight: 700 },
  { label: "Title · 3xl · 48px", size: 48, weight: 700 },
  { label: "Heading · 2xl · 36px", size: 36, weight: 600 },
  { label: "Subhead · xl · 28px", size: 28, weight: 600 },
];

const BODY_SCALE = [
  { label: "Large · lg · 22px", size: 22, weight: 600 },
  { label: "Medium · md · 18px", size: 18, weight: 500 },
  { label: "Body · base · 16px", size: 16, weight: 400 },
  { label: "Small · sm · 14px", size: 14, weight: 500 },
  { label: "Caption · xs · 12px", size: 12, weight: 600 },
];

const SPACING = [
  ["--space-1", 4],
  ["--space-2", 8],
  ["--space-3", 12],
  ["--space-4", 16],
  ["--space-5", 20],
  ["--space-6", 24],
  ["--space-8", 32],
  ["--space-10", 40],
  ["--space-12", 48],
  ["--space-16", 64],
  ["--space-20", 80],
  ["--space-24", 96],
] as const;

const CONTAINERS: [string, string][] = [
  ["--container-max", "1100px"],
  ["--container-pad", "24px"],
  ["--control-height-sm", "36px"],
  ["--control-height-md", "44px · min touch target"],
  ["--control-height-lg", "52px"],
];

const RADII: [string, number][] = [
  ["xs", 2],
  ["sm", 4],
  ["md", 8],
  ["lg", 12],
  ["pill", 999],
];

const PHASE_MAP: { name: string; icon: IconName; glyph: string }[] = [
  { name: "Explore", icon: "compass", glyph: "compass" },
  { name: "Design", icon: "drafting-compass", glyph: "drafting-compass" },
  { name: "Launch", icon: "rocket", glyph: "rocket" },
  { name: "KnightLaunch mark", icon: "swords", glyph: "swords" },
];

const ICON_VOCAB: IconName[] = [
  "compass",
  "drafting-compass",
  "rocket",
  "swords",
  "trophy",
  "lightbulb",
  "mic",
  "handshake",
  "users",
  "mail",
  "arrow-right",
  "chevron-down",
  "calendar",
];

const PHASES = [
  { num: "01", name: "Explore", icon: "compass" as IconName, blurb: "Curious? Discover entrepreneurship and find your big idea.", active: true },
  { num: "02", name: "Design", icon: "drafting-compass" as IconName, blurb: "Shape your idea into a feasible, impactful venture.", active: false },
  { num: "03", name: "Launch", icon: "rocket" as IconName, blurb: "Build, fund, and grow a real startup.", active: false },
];

const MATRIX: { row: string; cells: { label: string; note?: string }[] }[] = [
  { row: "Classes", cells: [{ label: "Creativity & Entrepreneurship" }, { label: "New Venture Design" }, { label: "New Venture Implementation" }] },
  { row: "Speaker Series", cells: [{ label: "Creating Careers" }, { label: "Emerging Opportunities" }, { label: "Startup Skills" }] },
  { row: "Mentors", cells: [{ label: "LaunchPad Peer Mentors" }, { label: "LaunchPad Mentors" }, { label: "UpStarts Incubator" }] },
  {
    row: "Competitions",
    cells: [
      { label: "Ideas Tournament", note: "$5K · Early Fall" },
      { label: "Innovation Tournament", note: "$15K · Late Fall" },
      { label: "Joust Championship", note: "$50K+ · Spring" },
    ],
  },
  { row: "Other", cells: [{ label: "Startup Expo" }, { label: "Innovation Sprints" }, { label: "Accelerator · Internships" }] },
];

const QUEST = [
  { badge: "Early Fall · Explore", title: "Ideas Tournament", prize: "$5,000", desc: "Two-minute video pitch · all majors · fully virtual" },
  { badge: "Late Fall · Design", title: "Innovation Tournament", prize: "$15,000", desc: "Feasible, impactful solutions · in-person pitch" },
  { badge: "Spring · Launch", title: "Joust Championship", prize: "$50,000+", desc: "Written proposal + live finals · funding & services" },
];

const STATS = [
  { value: "1,710", label: "students at events last year" },
  { value: "736", label: "mentoring meetings" },
  { value: "394", label: "competition participants" },
  { value: "150+", label: "community contributors" },
];

/* ---------------- small presentational helpers ---------------- */

function Swatch({ s }: { s: SwatchDef }) {
  return (
    <div className="g-swatch">
      <div
        className="g-swatch__chip"
        style={{ background: s.hex, borderBottom: s.lightBorder ? "1px solid var(--black-10)" : undefined }}
      />
      <div className="g-swatch__meta">
        <div className="g-swatch__name">{s.name}</div>
        <div className="g-swatch__hex">{s.hex}</div>
        {s.desc && (
          <div
            className="g-swatch__hex"
            style={{ textTransform: "none", letterSpacing: 0, fontFamily: "var(--font-sans)", color: "var(--black-50)" }}
          >
            {s.desc}
          </div>
        )}
        {s.note && <div className="g-swatch__note">{s.note}</div>}
      </div>
    </div>
  );
}

function SectionHead({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div className="g-head">
      <span className="g-eyebrow" style={{ color: "var(--gold-text)" }}>
        {eyebrow}
      </span>
      <h2 style={{ color: "var(--black)" }}>{title}</h2>
      <span className="g-rule" />
      {children && <p style={{ color: "var(--black-75)" }}>{children}</p>}
    </div>
  );
}

function PhaseCard({ phase }: { phase: (typeof PHASES)[number] }) {
  return (
    <button type="button" className={`kl-phase${phase.active ? " kl-phase--active" : ""}`}>
      <span className="kl-phase__top">
        <span className="kl-phase__num">{phase.num}</span>
        <span className="kl-phase__icon">
          <Icon name={phase.icon} />
        </span>
      </span>
      <span className="kl-phase__name">{phase.name}</span>
      <span className="kl-phase__blurb">{phase.blurb}</span>
    </button>
  );
}

/* ---------------- the guide ---------------- */

export function KnightLaunchGuide() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="kl-guide">
      <a className="skip-link" href="#overview">
        Skip to content
      </a>

      {/* Utility bar */}
      <div className="g-utility">
        <div className="kl-container">
          <span className="label">
            University of Central Florida · College of Business · Center for Entrepreneurial Leadership
          </span>
          <span className="right">
            <span className="label">Design System v2.0</span>
          </span>
        </div>
      </div>

      {/* Sticky header / menu bar */}
      <header className="g-header">
        <div className="kl-container">
          <Lockup as="a" href="#overview" size="sm" parent="Design System Guide" />
          <button
            type="button"
            className="g-burger"
            aria-label="Toggle menu"
            aria-expanded={navOpen}
            aria-controls="primary-nav"
            onClick={() => setNavOpen((o) => !o)}
          >
            <Icon name="chevron-down" />
          </button>
          <nav className={`g-nav${navOpen ? " open" : ""}`} id="primary-nav" onClick={() => setNavOpen(false)}>
            {NAV.map(([id, label]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Overview / hero */}
      <section className="g-hero" id="overview">
        <span className="g-hero__tag">Student / campus photography</span>
        <div className="g-hero__scrim" />
        <div className="kl-container">
          <div className="g-hero__eyebrow">KnightLaunch · Center for Entrepreneurial Leadership</div>
          <h1>
            Explore. Design.
            <br />
            Launch.
          </h1>
          <div className="g-hero__rule" />
          <p className="lead">
            The KnightLaunch design system is built on the official UCF brand — black &amp; gold, condensed Knockout
            display, photography-forward layouts — with a light student-entrepreneurship twist. This guide is the single
            source of truth for color, type, spacing, effects, iconography, components, and the live homepage.
          </p>
          <div className="g-hero__cta">
            <a href="#components" className="kl-btn kl-btn--gold">
              Browse components <Icon name="arrow-right" size={16} />
            </a>
            <a href="#homepage" className="g-underlink">
              See the homepage
            </a>
          </div>
        </div>
      </section>

      {/* Colors */}
      <section className="g-section g-section--off" id="colors">
        <div className="kl-container">
          <SectionHead eyebrow="Foundations" title="Color">
            Our colors are <strong>black</strong> and <strong>bright gold</strong> — full stop. The neutral system is
            built from official percentage tints of black; the section surface is off-white <strong>#F4F4F4</strong>, not
            cream. There is no teal and no novelty hue. Metallic gold is print/foil only — never digital.
          </SectionHead>

          <div className="g-subhead">Brand · Bright Gold</div>
          <div className="g-swatch-grid">
            {GOLD_SWATCHES.map((s) => (
              <Swatch key={s.name} s={s} />
            ))}
          </div>

          <div className="g-subhead">Black &amp; official percentage tints</div>
          <div className="g-swatch-grid">
            {BLACK_SWATCHES.map((s) => (
              <Swatch key={s.name} s={s} />
            ))}
          </div>

          <div className="g-subhead">Status (used sparingly)</div>
          <div className="g-swatch-grid">
            {STATUS_SWATCHES.map((s) => (
              <Swatch key={s.name} s={s} />
            ))}
          </div>

          <div className="g-subhead">Gold usage</div>
          <div className="g-demo">
            <div className="g-row" style={{ gap: 24, alignItems: "stretch" }}>
              <div
                style={{ flex: 1, minWidth: 180, background: "var(--gold)", color: "var(--black)", padding: "18px 20px", borderRadius: "var(--radius-sm)", fontWeight: 700, fontFamily: "var(--font-sans)" }}
              >
                Gold fill · black text
              </div>
              <div
                style={{ flex: 1, minWidth: 180, background: "var(--black)", color: "var(--gold)", padding: "18px 20px", borderRadius: "var(--radius-sm)", fontWeight: 700, fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "0.04em" }}
              >
                Gold on black
              </div>
              <div
                style={{ flex: 1, minWidth: 180, background: "#fff", border: "1px solid var(--black-10)", borderTop: "4px solid var(--gold)", padding: "18px 20px", borderRadius: "var(--radius-sm)", fontWeight: 700, color: "var(--black)", fontFamily: "var(--font-sans)" }}
              >
                Gold accent rule
              </div>
            </div>
            <p style={{ margin: "16px 0 0", color: "var(--black-75)", fontSize: 13.5, fontFamily: "var(--font-sans)" }}>
              Never set gold text on white. For the rare legible case, use <strong>--gold-text&nbsp;#6B5500</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Type */}
      <section className="g-section" id="type">
        <div className="kl-container">
          <SectionHead eyebrow="Foundations" title="Typography">
            <strong>Oswald</strong> (Knockout substitute) — condensed and usually UPPERCASE — carries the big display:
            hero, section titles, stats, eyebrows, and phase names. This condensed-caps look is the signature UCF voice.{" "}
            <strong>Montserrat</strong> — the Gotham substitute — handles body, subheads, UI, and technical copy at 16px /
            1.6.
          </SectionHead>

          <div className="g-subhead">Display scale — Oswald, uppercase</div>
          <div className="g-demo">
            {DISPLAY_SCALE.map((t) => (
              <div className="g-type-row" key={t.label}>
                <span className="label">{t.label}</span>
                <span className="sample disp" style={{ fontSize: t.size, fontWeight: t.weight }}>
                  Every venture is a quest
                </span>
              </div>
            ))}
          </div>

          <div className="g-subhead">Body &amp; UI — Montserrat</div>
          <div className="g-demo">
            {BODY_SCALE.map((t) => (
              <div className="g-type-row" key={t.label}>
                <span className="label">{t.label}</span>
                <span className="sample body" style={{ fontSize: t.size, fontWeight: t.weight }}>
                  Wherever you are on your quest, KnightLaunch meets you there.
                </span>
              </div>
            ))}
          </div>

          <div className="g-subhead">Signature roles</div>
          <div className="g-demo">
            <div className="g-type-row">
              <span className="label">Eyebrow</span>
              <span
                className="sample"
                style={{ fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 600, fontSize: 14, color: "var(--gold-text)" }}
              >
                KnightLaunch · Joust Challenge
              </span>
            </div>
            <div className="g-type-row">
              <span className="label">Impact stat</span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 56, color: "var(--gold)", lineHeight: 1 }}>
                1,710
              </span>
            </div>
          </div>

          <div className="g-subhead">Weights</div>
          <div className="g-demo">
            <div className="g-row" style={{ gap: 24, alignItems: "flex-end" }}>
              {[
                ["Oswald 400", 400, "var(--font-display)"],
                ["Oswald 600", 600, "var(--font-display)"],
                ["Oswald 700", 700, "var(--font-display)"],
                ["Mont 400", 400, "var(--font-sans)"],
                ["Mont 600", 600, "var(--font-sans)"],
                ["Mont 700", 700, "var(--font-sans)"],
              ].map(([label, weight, family]) => (
                <div style={{ textAlign: "center" }} key={label as string}>
                  <div style={{ fontSize: 30, fontWeight: weight as number, fontFamily: family as string, textTransform: "uppercase" }}>Aa</div>
                  <div className="g-swatch__hex" style={{ marginTop: 4 }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Spacing */}
      <section className="g-section g-section--off" id="spacing">
        <div className="kl-container">
          <SectionHead eyebrow="Foundations" title="Spacing & Layout">
            An 8px base grid. Centered 1100px max container with 24px gutters and 48–64px vertical section rhythm,
            alternating white → off-white → black bands.
          </SectionHead>
          <div className="g-specs">
            {SPACING.map(([name, px]) => (
              <div className="g-spec" key={name}>
                <span className="g-spec__name">{name}</span>
                <span className="g-bar" style={{ width: px }} />
                <span className="g-spec__val">{px}px</span>
              </div>
            ))}
          </div>
          <div className="g-subhead">Containers &amp; control heights</div>
          <div className="g-specs">
            {CONTAINERS.map(([name, val]) => (
              <div className="g-spec" key={name} style={{ gridTemplateColumns: "220px 1fr" }}>
                <span className="g-spec__name">{name}</span>
                <span className="g-spec__val" style={{ textAlign: "left" }}>
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Effects */}
      <section className="g-section" id="effects">
        <div className="kl-container">
          <SectionHead eyebrow="Foundations" title="Effects">
            Structured and confident: modest, slightly squared rounding, crisp hairlines, restrained elevation, and the
            signature <strong>gold accent rule</strong> under headlines and on card edges. Heroes are photography-forward
            with a bottom protection scrim. The old pentagon shield is retired.
          </SectionHead>

          <div className="g-subhead">Corner radii</div>
          <div className="g-demo">
            <div className="g-radii">
              {RADII.map(([label, px]) => (
                <div className="g-radius" key={label} style={{ borderRadius: px }}>
                  {label}
                  <br />
                  {px}px
                </div>
              ))}
            </div>
          </div>

          <div className="g-subhead">The gold accent rule &amp; borders</div>
          <div className="g-demo">
            <div className="g-row" style={{ gap: 24 }}>
              <div style={{ padding: "16px 22px", border: "1px solid var(--black-10)", borderRadius: "var(--radius-md)", fontFamily: "var(--font-sans)" }}>
                Hairline · 1px #E6E6E6
              </div>
              <div style={{ padding: "16px 22px", border: "1px solid var(--black)", borderRadius: "var(--radius-md)", fontWeight: 700, fontFamily: "var(--font-sans)" }}>
                Strong · 1px black
              </div>
              <div style={{ padding: "16px 22px", border: "1px solid var(--black-10)", borderLeft: "6px solid var(--gold)", borderRadius: "var(--radius-md)", fontFamily: "var(--font-sans)" }}>
                Gold rule · 4–6px
              </div>
            </div>
          </div>

          <div className="g-subhead">Shadows</div>
          <div className="g-demo g-demo--off">
            <div className="g-grid">
              <div className="g-shadow" style={{ boxShadow: "var(--shadow-sm)" }}>
                shadow-sm
              </div>
              <div className="g-shadow" style={{ boxShadow: "var(--shadow-md)" }}>
                shadow-md
              </div>
              <div className="g-shadow" style={{ boxShadow: "var(--shadow-lg)" }}>
                shadow-lg
              </div>
            </div>
          </div>

          <div className="g-subhead">Photography treatment &amp; motion</div>
          <div className="g-demo">
            <div className="g-row" style={{ gap: 28, alignItems: "flex-start" }}>
              <div style={{ position: "relative", flex: 1, minWidth: 260, height: 180, borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--photo-placeholder)" }}>
                <div style={{ position: "absolute", inset: 0, background: "var(--scrim-bottom)" }} />
                <div style={{ position: "absolute", left: 18, bottom: 16, right: 18 }}>
                  <div style={{ fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "0.16em", fontSize: 11, color: "var(--gold)", fontWeight: 600 }}>
                    KnightLaunch · Joust Challenge
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", textTransform: "uppercase", fontWeight: 700, fontSize: 30, lineHeight: 0.98, color: "#fff", marginTop: 4 }}>
                    Every venture is a quest
                  </div>
                  <div style={{ width: 56, height: 5, background: "var(--gold)", marginTop: 10 }} />
                </div>
              </div>
              <div style={{ maxWidth: 340, color: "var(--black-75)", fontSize: 14, lineHeight: 1.6, fontFamily: "var(--font-sans)" }}>
                <strong style={{ color: "var(--black)" }}>Full-bleed image + bottom scrim + white Knockout headline + gold rule.</strong>{" "}
                Motion is quick and confident — 0.15s ease-out for hover/press, 0.25s for the −4px card lift. No bounces;
                respects <code>prefers-reduced-motion</code>.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Iconography */}
      <section className="g-section g-section--off" id="icons">
        <div className="kl-container">
          <SectionHead eyebrow="Brand" title="Iconography">
            A curated <strong>Lucide</strong> set (ISC-licensed), embedded as inline SVG — no CDN runtime. Geometric 2px
            strokes match the Montserrat geometry. Programs and phases use icons, never emoji.
          </SectionHead>

          <div className="g-subhead">Phase &amp; mark mapping</div>
          <div className="g-grid">
            {PHASE_MAP.map((p) => (
              <div className="kl-card kl-card--gold-rule" key={p.name} style={{ display: "flex", alignItems: "center", gap: 14, padding: 16 }}>
                <span style={{ color: "var(--black)" }}>
                  <Icon name={p.icon} size={26} />
                </span>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600, fontSize: 16 }}>{p.name}</div>
                  <div className="g-swatch__hex">{p.glyph}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="g-subhead">Full icon vocabulary</div>
          <div className="g-icon-grid">
            {ICON_VOCAB.map((name) => (
              <div className="g-icon" key={name}>
                <Icon name={name} size={26} />
                <span>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Components */}
      <section className="g-section" id="components">
        <div className="kl-container">
          <SectionHead eyebrow="Library" title="Components">
            The building blocks — core, forms, and brand components, in the UCF black &amp; gold language. Hover and focus
            to see the live interaction states.
          </SectionHead>

          {/* Buttons */}
          <div className="g-subhead">Buttons</div>
          <div className="g-demo">
            <p className="g-label">Variants</p>
            <div className="g-row">
              <button type="button" className="kl-btn kl-btn--primary">
                Start your venture
              </button>
              <button type="button" className="kl-btn kl-btn--gold">
                Apply on StartupTree <Icon name="arrow-right" size={16} />
              </button>
              <button type="button" className="kl-btn kl-btn--outline">
                Book a Mentor
              </button>
              <button type="button" className="kl-btn kl-btn--ghost">
                Learn more
              </button>
              <button type="button" className="kl-btn kl-btn--primary" disabled>
                Disabled
              </button>
            </div>
            <p className="g-label" style={{ marginTop: 22 }}>
              Sizes
            </p>
            <div className="g-row">
              <button type="button" className="kl-btn kl-btn--primary kl-btn--sm">
                Small
              </button>
              <button type="button" className="kl-btn kl-btn--primary">
                Medium
              </button>
              <button type="button" className="kl-btn kl-btn--primary kl-btn--lg">
                Large
              </button>
            </div>
          </div>

          {/* Badges */}
          <div className="g-subhead">Badges</div>
          <div className="g-demo">
            <p className="g-label">Variants</p>
            <div className="g-row">
              <span className="kl-badge kl-badge--gold">Gold</span>
              <span className="kl-badge kl-badge--black">Black</span>
              <span className="kl-badge kl-badge--outline">Outline</span>
              <span className="kl-badge kl-badge--soft">Soft</span>
            </div>
            <p className="g-label" style={{ marginTop: 22 }}>
              Condensed (Oswald uppercase) — eyebrow / phase voice
            </p>
            <div className="g-row">
              <span className="kl-badge kl-badge--soft kl-badge--condensed">
                <Icon name="calendar" size={13} /> Early Fall · Explore
              </span>
              <span className="kl-badge kl-badge--gold kl-badge--condensed">Late Fall · Design</span>
              <span className="kl-badge kl-badge--black kl-badge--condensed">Spring · Launch</span>
            </div>
          </div>

          {/* Cards */}
          <div className="g-subhead">Cards</div>
          <div className="g-demo g-demo--off">
            <div className="g-grid">
              <div className="kl-card kl-card--default kl-card--interactive">
                <h3 style={{ fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "0.03em", fontSize: 18, margin: "0 0 6px" }}>Default</h3>
                <small style={{ color: "var(--black-50)", fontSize: 13, fontFamily: "var(--font-sans)" }}>White surface, 1px hairline border.</small>
              </div>
              <div className="kl-card kl-card--gold-rule kl-card--interactive">
                <span className="kl-badge kl-badge--soft kl-badge--condensed" style={{ marginBottom: 10 }}>
                  Late Fall · Design
                </span>
                <h3 style={{ fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "0.03em", fontSize: 18, margin: "8px 0 4px" }}>Gold rule</h3>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 26, color: "var(--gold-text)", lineHeight: 1 }}>$15,000</div>
                <small style={{ color: "var(--black-50)", fontSize: 12, fontFamily: "var(--font-sans)" }}>Signature left gold bar.</small>
              </div>
              <div className="kl-card kl-card--elevated kl-card--interactive">
                <h3 style={{ fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "0.03em", fontSize: 18, margin: "0 0 6px" }}>Elevated</h3>
                <small style={{ color: "var(--black-50)", fontSize: 13, fontFamily: "var(--font-sans)" }}>Hairline + soft shadow.</small>
              </div>
              <div className="kl-card kl-card--inverse kl-card--interactive">
                <h3 style={{ fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "0.03em", fontSize: 18, margin: "0 0 6px", color: "var(--gold)" }}>Inverse</h3>
                <small style={{ color: "rgba(255,255,255,.8)", fontSize: 13, fontFamily: "var(--font-sans)" }}>Black surface for bands &amp; footers.</small>
              </div>
            </div>
          </div>

          {/* Inputs */}
          <div className="g-subhead">Form input</div>
          <div className="g-demo">
            <div className="g-grid">
              <div className="kl-input-wrap">
                <label className="kl-input-label" htmlFor="d-email">
                  Email address
                </label>
                <div className="kl-input">
                  <Icon name="mail" size={16} />
                  <input id="d-email" type="email" placeholder="knight@ucf.edu" />
                </div>
                <span className="kl-input-hint">Black focus border + gold focus glow.</span>
              </div>
              <div className="kl-input-wrap">
                <label className="kl-input-label" htmlFor="d-name">
                  Your name
                </label>
                <div className="kl-input">
                  <input id="d-name" type="text" placeholder="Click to focus" />
                </div>
                <span className="kl-input-hint">Click in to see the focus state.</span>
              </div>
            </div>
          </div>

          {/* PhaseCards */}
          <div className="g-subhead">Phase cards — Explore / Design / Launch</div>
          <div className="g-demo g-demo--off">
            <div className="g-grid--3">
              {PHASES.map((p) => (
                <PhaseCard key={p.num} phase={p} />
              ))}
            </div>
            <p style={{ margin: "14px 0 0", color: "var(--black-50)", fontSize: 12.5, fontFamily: "var(--font-sans)" }}>
              The first card shows the <strong>active</strong> state (black fill). These replace the retired pentagon
              shield.
            </p>
          </div>

          {/* Lockup + StatBlock */}
          <div className="g-pair" style={{ marginTop: 14 }}>
            <div className="g-demo">
              <p className="g-label">Unit lockup</p>
              <Lockup size="lg" parent="University of Central Florida · College of Business" />
            </div>
            <div className="g-demo g-demo--dark">
              <p className="g-label" style={{ color: "rgba(255,255,255,.55)" }}>
                StatBlock
              </p>
              <div className="g-row" style={{ gap: 36 }}>
                <div className="kl-stat">
                  <div className="kl-stat__value">1,710</div>
                  <div className="kl-stat__label">students at events</div>
                </div>
                <div className="kl-stat">
                  <div className="kl-stat__value">736</div>
                  <div className="kl-stat__label">mentoring meetings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Homepage recreation */}
      <section className="g-section g-section--off" id="homepage">
        <div className="kl-container">
          <SectionHead eyebrow="UI Kit" title="The KnightLaunch Homepage">
            The system in full — a faithful recreation of the overhauled homepage, assembled entirely from the tokens and
            components above: a photography-forward hero, phase cards, the programs matrix, and a gold newsletter band.
          </SectionHead>
        </div>

        <div className="kl-container">
          <div className="kl-site">
            {/* utility */}
            <div className="site-util">
              <div className="inner">
                <span className="label">University of Central Florida · College of Business</span>
                <span className="socials">
                  <span>LinkedIn</span>
                  <span>Instagram</span>
                  <span>X</span>
                </span>
              </div>
            </div>
            {/* header */}
            <div className="site-head">
              <div className="inner">
                <Lockup size="sm" parent="University of Central Florida · College of Business" />
                <div className="navwrap">
                  <nav className="site-nav">
                    <a href="#homepage">About</a>
                    <a href="#homepage">Academics</a>
                    <a href="#homepage">Mentors</a>
                    <a href="#homepage">Competitions</a>
                    <a href="#homepage">Events</a>
                    <a href="#homepage">Resources</a>
                  </nav>
                  <div style={{ marginLeft: 10 }}>
                    <button type="button" className="kl-btn kl-btn--gold kl-btn--sm">
                      Give to CEL
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* hero */}
            <div className="site-hero">
              <span className="site-hero__tag">Student / campus photography</span>
              <div className="site-hero__scrim" />
              <div className="inner">
                <div className="eyebrow">KnightLaunch · Center for Entrepreneurial Leadership</div>
                <h1>
                  Explore. Design.
                  <br />
                  Launch.
                </h1>
                <div className="rule" />
                <p className="lead">
                  Every venture is a quest. Wherever you are on yours, KnightLaunch offers academics, mentors, events,
                  competitions, and resources to help you learn and achieve at every phase.
                </p>
                <div className="cta">
                  <button type="button" className="kl-btn kl-btn--gold">
                    Start your venture <Icon name="arrow-right" size={16} />
                  </button>
                  <a href="#homepage" className="g-underlink">
                    Explore programs
                  </a>
                </div>
              </div>
            </div>
            {/* phase selector */}
            <div className="site-band site-band--off">
              <div className="site-title">
                <h2>The KnightLaunch Journey</h2>
                <div className="rule" />
              </div>
              <p className="intro">Pick the phase that sounds most like you — we&apos;ll highlight your programs below.</p>
              <div className="phase-grid">
                {PHASES.map((p) => (
                  <PhaseCard key={p.num} phase={p} />
                ))}
              </div>
            </div>
            {/* programs matrix */}
            <div className="site-band">
              <div className="site-title">
                <h2>Your Programs</h2>
                <div className="rule" />
              </div>
              <p className="intro">Five ways to learn and achieve, at every phase of your quest. Every cell is a link.</p>
              <div className="matrix-scroll">
                <table className="matrix">
                  <thead>
                    <tr>
                      <th className="corner" />
                      <th className="col">Explore</th>
                      <th className="col">Design</th>
                      <th className="col">Launch</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MATRIX.map((r) => (
                      <tr key={r.row}>
                        <th className="rowh">{r.row}</th>
                        {r.cells.map((c) => (
                          <td key={c.label}>
                            <a href="#homepage">{c.label}</a>
                            {c.note && <small>{c.note}</small>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* quest line */}
            <div className="site-band">
              <div className="site-title">
                <h2>The Joust Challenge</h2>
                <div className="rule" />
              </div>
              <p className="intro">One quest line, three tournaments. Start with an idea in fall — launch a funded venture by spring.</p>
              <div className="quest-grid">
                {QUEST.map((q) => (
                  <div className="kl-card kl-card--gold-rule kl-card--interactive quest-card" key={q.title} style={{ padding: "20px 22px" }}>
                    <span className="kl-badge kl-badge--soft kl-badge--condensed" style={{ marginBottom: 12 }}>
                      {q.badge}
                    </span>
                    <h3>{q.title}</h3>
                    <div className="prize">{q.prize}</div>
                    <p>{q.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* stats */}
            <div className="stats-band">
              <div className="inner">
                {STATS.map((s) => (
                  <div className="kl-stat" key={s.label}>
                    <div className="kl-stat__value">{s.value}</div>
                    <div className="kl-stat__label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* newsletter */}
            <div className="news-band">
              <div className="inner">
                <div>
                  <h2>Open windows of opportunity</h2>
                  <p>Get the KnightLaunch newsletter — events, deadlines, and funding.</p>
                </div>
                <div className="form">
                  <div style={{ width: 240 }}>
                    <div className="kl-input">
                      <input type="email" placeholder="knight@ucf.edu" />
                    </div>
                  </div>
                  <button type="button" className="kl-btn kl-btn--primary">
                    Stay Informed
                  </button>
                </div>
              </div>
            </div>
            {/* footer */}
            <footer className="site-foot">
              <div className="grid">
                <div>
                  <Lockup size="sm" dark parent="University of Central Florida · College of Business" />
                  <p style={{ marginTop: 16, maxWidth: 340 }}>
                    KnightLaunch is powered by the Center for Entrepreneurial Leadership, helping UCF students, alumni,
                    faculty and staff become successful entrepreneurial leaders.
                  </p>
                </div>
                <div className="col">
                  <h4>Find Us</h4>
                  <p style={{ margin: 0 }}>
                    CEL · BA1, Room 135
                    <br />
                    (407) 823-3683
                    <br />
                    cel@ucf.edu
                  </p>
                </div>
                <div className="col">
                  <h4>Explore</h4>
                  <a href="#homepage">About</a>
                  <a href="#homepage">Academics</a>
                  <a href="#homepage">Competitions</a>
                  <a href="#homepage">Give to CEL</a>
                </div>
              </div>
              <div className="bar">
                <div className="inner">
                  <span>University of Central Florida © 2026</span>
                  <span>UCF College of Business</span>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </section>

      {/* Guide footer */}
      <footer className="g-footer">
        <div className="kl-container">
          <div>
            <Lockup size="sm" dark parent="Design System Guide" />
            <div style={{ opacity: 0.7, marginTop: 10, fontFamily: "var(--font-sans)" }}>
              UCF College of Business · Center for Entrepreneurial Leadership
            </div>
          </div>
          <div style={{ opacity: 0.7, fontFamily: "var(--font-sans)" }}>
            <Link href="/">← Back to portfolio</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
