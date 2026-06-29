/**
 * ProjectBrandKit — a self-contained, project-themed design-system showcase
 * shown inside the detail view for the two design-system projects. Each variant
 * is rendered in that brand's OWN palette and type pairing (not the portfolio's
 * tokens), so the card reads as a faithful mini "brand sheet". Mirrors the
 * Bento Portfolio `// brand_kit` section.
 */

type Swatch = { name: string; hex: string };

const SERVERIZZ_PALETTE: Swatch[] = [
  { name: "Midnight", hex: "#0B0E18" },
  { name: "Navy", hex: "#111827" },
  { name: "Raised", hex: "#0D1117" },
  { name: "Steel", hex: "#1E3A5F" },
  { name: "Electric", hex: "#60A5FA" },
  { name: "Action", hex: "#2563EB" },
  { name: "Terminal", hex: "#22C55E" },
  { name: "Warning", hex: "#F59E0B" },
  { name: "Error", hex: "#EF4444" },
];

const IMPECCABYTE_PALETTE: Swatch[] = [
  { name: "Clay", hex: "#C0623E" },
  { name: "Amber", hex: "#E0A04D" },
  { name: "Clove", hex: "#7A5C42" },
  { name: "Paper", hex: "#FAF6EF" },
  { name: "Ink", hex: "#2A211A" },
  { name: "Sage", hex: "#5E7A4F" },
  { name: "Brick", hex: "#B23A2E" },
];

const KNIGHTLAUNCH_PALETTE: Swatch[] = [
  { name: "UCF Black", hex: "#000000" },
  { name: "Bright Gold", hex: "#FFC904" },
  { name: "Gold Hover", hex: "#E6B400" },
  { name: "Black 75", hex: "#404040" },
  { name: "Black 50", hex: "#808080" },
  { name: "Black 25", hex: "#BFBFBF" },
  { name: "Off-white", hex: "#F4F4F4" },
  { name: "White", hex: "#FFFFFF" },
];

const SWATCH_GRID = "grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(108px,1fr))]";

function Swatches({
  palette,
  radius,
  swatchBorder,
  nameColor,
  hexColor,
  fontFamily,
}: {
  palette: Swatch[];
  radius: number;
  swatchBorder: string;
  nameColor: string;
  hexColor: string;
  fontFamily: string;
}) {
  return (
    <div className={SWATCH_GRID}>
      {palette.map((c) => (
        <div key={c.name}>
          <div
            className="h-[56px]"
            style={{ borderRadius: radius, background: c.hex, border: `1px solid ${swatchBorder}` }}
          />
          <div className="mt-2 text-[11px]" style={{ fontFamily, color: nameColor }}>
            {c.name}
          </div>
          <div className="mt-[2px] text-[11px]" style={{ fontFamily, color: hexColor }}>
            {c.hex}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- SERVERIZZ (dark, terminal-fluent) ---------- */

function ServerizzKit() {
  const mono = "var(--font-mono)";
  const sora = "var(--font-sora)";
  const inter = "var(--font-inter)";
  return (
    <div
      className="overflow-hidden"
      style={{
        borderRadius: "var(--radius-lg)",
        border: "1px solid #1E3A5F",
        background: "#0B0E18",
        boxShadow: "var(--shadow-md)",
      }}
    >
      {/* header strip */}
      <div
        className="flex items-center gap-3 px-6 py-[18px]"
        style={{ borderBottom: "1px solid #1E3A5F", background: "#111827" }}
      >
        <span className="h-[11px] w-[11px] flex-none rounded-full" style={{ background: "#EF4444" }} />
        <span className="h-[11px] w-[11px] flex-none rounded-full" style={{ background: "#F59E0B" }} />
        <span className="h-[11px] w-[11px] flex-none rounded-full" style={{ background: "#22C55E" }} />
        <span
          className="ml-2 text-[15px]"
          style={{ fontFamily: sora, fontWeight: 800, letterSpacing: "1px", color: "#FFFFFF" }}
        >
          SERVERIZZ
        </span>
        <span
          className="ml-auto text-[11px]"
          style={{ fontFamily: mono, letterSpacing: "2px", color: "#60A5FA" }}
        >
          {"// BRAND_KIT"}
        </span>
      </div>

      <div className="flex flex-col gap-[30px] px-6 pt-7 pb-[30px]">
        {/* COLOR */}
        <div>
          <div
            className="mb-[14px] text-[11px]"
            style={{ fontFamily: mono, letterSpacing: "1.5px", color: "#64748B" }}
          >
            COLOR
          </div>
          <Swatches
            palette={SERVERIZZ_PALETTE}
            radius={8}
            swatchBorder="rgba(255,255,255,0.08)"
            nameColor="#CBD5E1"
            hexColor="#64748B"
            fontFamily={mono}
          />
        </div>

        {/* TYPE */}
        <div className="pt-[26px]" style={{ borderTop: "1px solid #1E3A5F" }}>
          <div
            className="mb-4 text-[11px]"
            style={{ fontFamily: mono, letterSpacing: "1.5px", color: "#64748B" }}
          >
            TYPE
          </div>
          <div className="flex flex-col gap-[18px]">
            <div className="flex flex-wrap items-baseline gap-4">
              <span className="w-24 flex-none text-[11px]" style={{ fontFamily: mono, color: "#475569" }}>
                SORA · display
              </span>
              <span
                className="text-[30px]"
                style={{ fontFamily: sora, fontWeight: 800, letterSpacing: "-1px", color: "#FFFFFF" }}
              >
                Ship Infrastructure.
              </span>
            </div>
            <div className="flex flex-wrap items-baseline gap-4">
              <span className="w-24 flex-none text-[11px]" style={{ fontFamily: mono, color: "#475569" }}>
                INTER · body
              </span>
              <span className="text-[16px] leading-[1.6]" style={{ fontFamily: inter, color: "#CBD5E1" }}>
                Plain, functional UI copy and paragraphs set in Inter.
              </span>
            </div>
            <div className="flex flex-wrap items-baseline gap-4">
              <span className="w-24 flex-none text-[11px]" style={{ fontFamily: mono, color: "#475569" }}>
                MONO · code
              </span>
              <span className="text-[16px]" style={{ fontFamily: mono, color: "#94A3B8" }}>
                <span style={{ color: "#22C55E" }}>$</span>{" "}
                <span style={{ color: "#60A5FA" }}>serverizz deploy</span> --scale auto
              </span>
            </div>
          </div>
        </div>

        {/* COMPONENTS + SIGNALS */}
        <div
          className="flex flex-wrap gap-x-11 gap-y-[30px] pt-[26px]"
          style={{ borderTop: "1px solid #1E3A5F" }}
        >
          <div>
            <div
              className="mb-[14px] text-[11px]"
              style={{ fontFamily: mono, letterSpacing: "1.5px", color: "#64748B" }}
            >
              COMPONENTS
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="rounded-[6px] px-[18px] py-[10px] text-[14px]"
                style={{ fontFamily: inter, fontWeight: 600, color: "#FFFFFF", background: "#2563EB" }}
              >
                Deploy now
              </span>
              <span
                className="rounded-[6px] px-[17px] py-[9px] text-[14px]"
                style={{ fontFamily: inter, fontWeight: 500, color: "#CBD5E1", border: "1px solid #1E3A5F" }}
              >
                Docs
              </span>
              <span
                className="inline-flex items-center gap-[6px] rounded-full px-[11px] py-[5px] text-[11px]"
                style={{
                  fontFamily: mono,
                  color: "#22C55E",
                  background: "rgba(34,197,94,0.10)",
                  border: "1px solid rgba(34,197,94,0.3)",
                }}
              >
                <span className="h-[6px] w-[6px] rounded-full" style={{ background: "#22C55E" }} />
                operational
              </span>
            </div>
          </div>
          <Signals
            fontFamily={mono}
            labelColor="#64748B"
            textColor="#94A3B8"
            items={[
              { label: "success", color: "#22C55E" },
              { label: "warning", color: "#F59E0B" },
              { label: "error", color: "#EF4444" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- IMPECCABYTE (warm, editorial) ---------- */

function ImpeccabyteKit() {
  const mono = "var(--font-mono)";
  const serif = "var(--font-serif)";
  const sans = "var(--font-sans)";
  return (
    <div
      className="overflow-hidden"
      style={{
        borderRadius: "var(--radius-lg)",
        border: "1px solid #E7DCCB",
        background: "#FAF6EF",
        boxShadow: "var(--shadow-md)",
      }}
    >
      {/* header strip */}
      <div
        className="flex items-center gap-3 px-6 py-[18px]"
        style={{ borderBottom: "1px solid #E7DCCB", background: "#FFFFFF" }}
      >
        <span className="inline-flex h-[22px] items-end gap-[3px]">
          <span className="w-[5px] rounded-[2px]" style={{ height: 11, background: "#C0623E" }} />
          <span className="w-[5px] rounded-[2px]" style={{ height: 16, background: "#CF7B45" }} />
          <span className="w-[5px] rounded-[2px]" style={{ height: 22, background: "#E0A04D" }} />
        </span>
        <span
          className="text-[19px]"
          style={{ fontFamily: serif, fontWeight: 600, letterSpacing: "-0.01em", color: "#2A211A" }}
        >
          Impecca<span style={{ color: "#C0623E" }}>byte</span>
        </span>
        <span
          className="ml-auto text-[11px]"
          style={{ fontFamily: mono, letterSpacing: "0.12em", color: "#9A6A3F" }}
        >
          {"// BRAND_KIT"}
        </span>
      </div>

      <div className="flex flex-col gap-[30px] px-6 pt-7 pb-[30px]">
        {/* COLOR */}
        <div>
          <div
            className="mb-[14px] text-[11px]"
            style={{ fontFamily: mono, letterSpacing: "0.12em", color: "#B79B7C" }}
          >
            COLOR
          </div>
          <Swatches
            palette={IMPECCABYTE_PALETTE}
            radius={12}
            swatchBorder="rgba(42,33,26,0.10)"
            nameColor="#5C4E40"
            hexColor="#A88E72"
            fontFamily={mono}
          />
        </div>

        {/* TYPE */}
        <div className="pt-[26px]" style={{ borderTop: "1px solid #E7DCCB" }}>
          <div
            className="mb-4 text-[11px]"
            style={{ fontFamily: mono, letterSpacing: "0.12em", color: "#B79B7C" }}
          >
            TYPE
          </div>
          <div className="flex flex-col gap-[18px]">
            <div className="flex flex-wrap items-baseline gap-4">
              <span className="w-[120px] flex-none text-[11px]" style={{ fontFamily: mono, color: "#B79B7C" }}>
                NEWSREADER · display
              </span>
              <span
                className="text-[30px]"
                style={{ fontFamily: serif, fontWeight: 600, letterSpacing: "-0.02em", color: "#2A211A" }}
              >
                Impeccably <em className="italic" style={{ color: "#C0623E" }}>convenient.</em>
              </span>
            </div>
            <div className="flex flex-wrap items-baseline gap-4">
              <span className="w-[120px] flex-none text-[11px]" style={{ fontFamily: mono, color: "#B79B7C" }}>
                HANKEN · body
              </span>
              <span className="text-[16px] leading-[1.6]" style={{ fontFamily: sans, color: "#5C4E40" }}>
                Get paid in minutes, not days. No monthly fee.
              </span>
            </div>
            <div className="flex flex-wrap items-baseline gap-4">
              <span className="w-[120px] flex-none text-[11px]" style={{ fontFamily: mono, color: "#B79B7C" }}>
                MONO · figures
              </span>
              <span className="text-[16px]" style={{ fontFamily: mono, color: "#2A211A" }}>
                2.6% + 10¢ <span style={{ color: "#A88E72" }}>· flat, no surprises</span>
              </span>
            </div>
          </div>
        </div>

        {/* COMPONENTS + SIGNALS */}
        <div
          className="flex flex-wrap gap-x-11 gap-y-[30px] pt-[26px]"
          style={{ borderTop: "1px solid #E7DCCB" }}
        >
          <div>
            <div
              className="mb-[14px] text-[11px]"
              style={{ fontFamily: mono, letterSpacing: "0.12em", color: "#B79B7C" }}
            >
              COMPONENTS
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="rounded-full px-5 py-[10px] text-[14px]"
                style={{
                  fontFamily: sans,
                  fontWeight: 600,
                  color: "#FFFFFF",
                  background: "#C0623E",
                  boxShadow: "0 4px 14px rgba(192,98,62,0.28)",
                }}
              >
                Get started
              </span>
              <span
                className="rounded-full px-5 py-[10px] text-[14px]"
                style={{ fontFamily: sans, fontWeight: 600, color: "#2A211A", background: "#E0A04D" }}
              >
                See pricing
              </span>
              <span
                className="rounded-full px-[19px] py-[9px] text-[14px]"
                style={{ fontFamily: sans, fontWeight: 500, color: "#5C4E40", border: "1px solid #D9CBB6" }}
              >
                Talk to us
              </span>
            </div>
          </div>
          <Signals
            fontFamily={mono}
            labelColor="#B79B7C"
            textColor="#5C4E40"
            items={[
              { label: "success", color: "#5E7A4F" },
              { label: "warning", color: "#E0A04D" },
              { label: "danger", color: "#B23A2E" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- KNIGHTLAUNCH (UCF black & gold, condensed-display) ---------- */

const KL_GOLD = "#FFC904";

function KlPhaseIcon({ kind, stroke }: { kind: "explore" | "design" | "launch"; stroke: string }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke,
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (kind === "explore")
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    );
  if (kind === "design")
    return (
      <svg {...common}>
        <path d="m12.99 6.74 1.93 3.44" />
        <path d="M19.136 12a10 10 0 0 1-14.271 0" />
        <path d="m21 21-2.16-3.84" />
        <path d="m3 21 8.02-14.26" />
        <circle cx="12" cy="5" r="2" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M15 9h5s-.55 3.03-2 4c-1.62 1.08-5 0-5 0" />
    </svg>
  );
}

function KnightLaunchKit() {
  const oswald = "var(--font-oswald)";
  const mont = "var(--font-montserrat)";
  const label = { fontFamily: mont, fontWeight: 700, fontSize: 11, letterSpacing: "0.16em", color: "#808080" } as const;
  const phases = [
    { num: "01", name: "Explore", kind: "explore" as const, active: false },
    { num: "02", name: "Design", kind: "design" as const, active: false },
    { num: "03", name: "Launch", kind: "launch" as const, active: true },
  ];
  return (
    <div
      className="overflow-hidden"
      style={{
        borderRadius: "var(--radius-lg)",
        border: "1px solid #E6E6E6",
        background: "#FFFFFF",
        boxShadow: "var(--shadow-md)",
      }}
    >
      {/* header strip */}
      <div className="flex items-center gap-[14px] px-6 py-[18px]" style={{ background: "#000000" }}>
        <span className="inline-block" style={{ width: 26, height: 6, background: KL_GOLD }} />
        <span
          className="text-[19px]"
          style={{ fontFamily: oswald, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "#FFFFFF" }}
        >
          Knight<span style={{ color: KL_GOLD }}>Launch</span>
        </span>
        <span className="ml-auto text-[11px]" style={{ fontFamily: mont, fontWeight: 700, letterSpacing: "0.12em", color: KL_GOLD }}>
          {"// BRAND_KIT"}
        </span>
      </div>

      <div className="flex flex-col gap-[30px] px-6 pt-7 pb-[30px]">
        {/* COLOR */}
        <div>
          <div className="mb-[14px]" style={label}>
            COLOR
          </div>
          <Swatches
            palette={KNIGHTLAUNCH_PALETTE}
            radius={6}
            swatchBorder="#E6E6E6"
            nameColor="#404040"
            hexColor="#808080"
            fontFamily={mont}
          />
        </div>

        {/* TYPE */}
        <div className="pt-[26px]" style={{ borderTop: "1px solid #E6E6E6" }}>
          <div className="mb-4" style={label}>
            TYPE
          </div>
          <div className="flex flex-col gap-[18px]">
            <div className="flex flex-wrap items-baseline gap-4">
              <span className="w-[132px] flex-none text-[11px]" style={{ fontFamily: mont, fontWeight: 700, letterSpacing: "0.08em", color: "#BFBFBF" }}>
                OSWALD · display
              </span>
              <span
                className="text-[30px]"
                style={{ fontFamily: oswald, fontWeight: 700, letterSpacing: "0.01em", textTransform: "uppercase", color: "#000000" }}
              >
                Every venture is a quest.
              </span>
            </div>
            <div className="flex flex-wrap items-baseline gap-4">
              <span className="w-[132px] flex-none text-[11px]" style={{ fontFamily: mont, fontWeight: 700, letterSpacing: "0.08em", color: "#BFBFBF" }}>
                MONTSERRAT · body
              </span>
              <span className="text-[16px] leading-[1.6]" style={{ fontFamily: mont, color: "#404040" }}>
                Academics, mentors, events, and competitions for student founders.
              </span>
            </div>
            <div className="flex flex-wrap items-baseline gap-4">
              <span className="w-[132px] flex-none text-[11px]" style={{ fontFamily: mont, fontWeight: 700, letterSpacing: "0.08em", color: "#BFBFBF" }}>
                EYEBROW · caps
              </span>
              <span
                className="text-[16px]"
                style={{ fontFamily: oswald, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: "#6B5500" }}
              >
                Ideas Tournament · $5K
              </span>
            </div>
          </div>
        </div>

        {/* THE QUEST */}
        <div className="pt-[26px]" style={{ borderTop: "1px solid #E6E6E6" }}>
          <div className="mb-4" style={label}>
            THE QUEST
          </div>
          <div className="flex flex-wrap gap-3">
            {phases.map((p) => (
              <div
                key={p.num}
                className="flex-[1_1_150px] px-4 pt-4 pb-[18px]"
                style={{
                  border: p.active ? "1px solid #000000" : "1px solid #E6E6E6",
                  borderTop: "4px solid " + KL_GOLD,
                  borderRadius: 8,
                  background: p.active ? "#000000" : "#FFFFFF",
                }}
              >
                <div className="mb-[10px] flex items-center justify-between">
                  <span style={{ fontFamily: oswald, fontWeight: 700, fontSize: 22, color: p.active ? KL_GOLD : "#6B5500" }}>{p.num}</span>
                  <KlPhaseIcon kind={p.kind} stroke={p.active ? KL_GOLD : "#000000"} />
                </div>
                <div
                  className="text-[20px]"
                  style={{ fontFamily: oswald, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: p.active ? "#FFFFFF" : "#000000" }}
                >
                  {p.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COMPONENTS */}
        <div className="pt-[26px]" style={{ borderTop: "1px solid #E6E6E6" }}>
          <div className="mb-[14px]" style={label}>
            COMPONENTS
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="text-[13px]"
              style={{ fontFamily: mont, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: KL_GOLD, background: "#000000", padding: "11px 20px", borderRadius: 4 }}
            >
              Apply now
            </span>
            <span
              className="text-[13px]"
              style={{ fontFamily: mont, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#000000", background: KL_GOLD, padding: "11px 20px", borderRadius: 4 }}
            >
              Get our newsletter
            </span>
            <span
              className="text-[13px]"
              style={{ fontFamily: mont, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#000000", border: "1.5px solid #000000", padding: "9.5px 18px", borderRadius: 4 }}
            >
              Book a Mentor
            </span>
            <span
              className="text-[11px]"
              style={{ fontFamily: mont, fontWeight: 700, letterSpacing: "0.04em", color: "#000000", background: "#FFF4CD", border: "1px solid " + KL_GOLD, padding: "5px 11px", borderRadius: 999 }}
            >
              $50,000+ in prizes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Signals({
  fontFamily,
  labelColor,
  textColor,
  items,
}: {
  fontFamily: string;
  labelColor: string;
  textColor: string;
  items: { label: string; color: string }[];
}) {
  return (
    <div>
      <div className="mb-[14px] text-[11px]" style={{ fontFamily, letterSpacing: "0.12em", color: labelColor }}>
        SIGNALS
      </div>
      <div className="flex items-center gap-[18px]">
        {items.map((s) => (
          <span
            key={s.label}
            className="inline-flex items-center gap-[7px] text-[12px]"
            style={{ fontFamily, color: textColor }}
          >
            <span className="h-[9px] w-[9px] rounded-full" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Renders the brand kit for a design-system project, or nothing otherwise. */
export function ProjectBrandKit({ slug }: { slug: string }) {
  if (slug === "serverizz") return <ServerizzKit />;
  if (slug === "impeccabyte") return <ImpeccabyteKit />;
  if (slug === "knightlaunch") return <KnightLaunchKit />;
  return null;
}

export function hasBrandKit(slug: string): boolean {
  return slug === "serverizz" || slug === "impeccabyte" || slug === "knightlaunch";
}
