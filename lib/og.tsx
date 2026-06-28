import { readFile } from "node:fs/promises";
import { join } from "node:path";

/* ============================================================
   Social share image generation (next/og + Satori).
   Shared between the landscape OG/Twitter card and the square
   LinkedIn/Instagram asset so both stay in lockstep with the
   "Bento Portfolio" design. Colours are the literal hex values
   behind the brand tokens in app/globals.css (Satori can't read
   CSS custom properties), kept in sync by name below.
   ============================================================ */

const FONT_DIR = join(process.cwd(), "assets/fonts");

// Fonts must be passed to ImageResponse as raw buffers — next/font is for the
// app runtime, not Satori. Latin-subset TTFs keep us well under the 500KB cap.
export async function loadOgFonts() {
  const [serif, serifItalic, mono, monoMedium, sans, sansSemibold] = await Promise.all([
    readFile(join(FONT_DIR, "newsreader-400.ttf")),
    readFile(join(FONT_DIR, "newsreader-400-italic.ttf")),
    readFile(join(FONT_DIR, "jetbrains-400.ttf")),
    readFile(join(FONT_DIR, "jetbrains-500.ttf")),
    readFile(join(FONT_DIR, "hanken-400.ttf")),
    readFile(join(FONT_DIR, "hanken-600.ttf")),
  ]);
  return [
    { name: "Newsreader", data: serif, weight: 400 as const, style: "normal" as const },
    { name: "Newsreader", data: serifItalic, weight: 400 as const, style: "italic" as const },
    { name: "JetBrains Mono", data: mono, weight: 400 as const, style: "normal" as const },
    { name: "JetBrains Mono", data: monoMedium, weight: 500 as const, style: "normal" as const },
    { name: "Hanken Grotesk", data: sans, weight: 400 as const, style: "normal" as const },
    { name: "Hanken Grotesk", data: sansSemibold, weight: 600 as const, style: "normal" as const },
  ];
}

const MONO = "JetBrains Mono";
const SERIF = "Newsreader";
const SANS = "Hanken Grotesk";

// Brand tokens → hex (from app/globals.css :root).
const C = {
  page: "#f6f4ec", // --surface-page / paper-50
  card: "#fcfbf7", // --surface-card / white
  sage: "#f2f5f1", // --surface-sage / xanadu-50
  strong: "#1b201c", // --text-strong / ink-900
  body: "#353b36", // --text-body / ink-700
  faint: "#7e847d", // --text-faint / ink-400
  accent: "#556b5a", // --text-accent / xanadu-600
  dot: "#738678", // --accent / xanadu-500
  border: "#dcdacf", // --border-default / paper-300
  sageBorder: "#d3ddd4", // --xanadu-200
} as const;

/* ---------- shared leaves ---------- */

// The signature dimmed "// " code-comment prefix on every mono label.
function Comment() {
  // Non-breaking space so Satori doesn't trim the gap after "//" in flex layout.
  return <span style={{ opacity: 0.55 }}>{"// "}</span>;
}

function Label({ size, mb = 8, children }: { size: number; mb?: number; children: string }) {
  return (
    <div
      style={{
        display: "flex",
        fontFamily: MONO,
        fontSize: size,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: C.accent,
        marginBottom: mb,
      }}
    >
      <Comment />
      {children}
    </div>
  );
}

function Eyebrow({ fontSize, marginBottom }: { fontSize: number; marginBottom: number }) {
  return (
    <div
      style={{
        display: "flex",
        fontFamily: MONO,
        fontSize,
        letterSpacing: "0.02em",
        color: C.accent,
        marginBottom,
      }}
    >
      <Comment />
      founder · consultant · web engineer
    </div>
  );
}

function Headline({
  fontSize,
  lineHeight,
  marginBottom,
}: {
  fontSize: number;
  lineHeight: number;
  marginBottom: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        fontFamily: SERIF,
        fontWeight: 400,
        fontSize,
        lineHeight,
        letterSpacing: "-0.03em",
        color: C.strong,
        marginBottom,
      }}
    >
      <span>Ry</span>
      <span style={{ fontStyle: "italic", color: C.accent }}>{" Bealey"}</span>
      <span>.</span>
    </div>
  );
}

function Lede({ fontSize, maxWidth }: { fontSize: number; maxWidth: number }) {
  return (
    <div style={{ display: "flex", fontFamily: SANS, fontSize, lineHeight: 1.5, maxWidth, color: C.body }}>
      I design and build thoughtful, user-centered products — where infrastructure, design and code
      meet.
    </div>
  );
}

function Wordmark({ size, metaSize }: { size: number; metaSize: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div
        style={{
          display: "flex",
          fontFamily: MONO,
          fontSize: size,
          fontWeight: 500,
          color: C.accent,
          letterSpacing: "-0.01em",
        }}
      >
        ry.bealey
      </div>
      <div
        style={{
          display: "flex",
          fontFamily: MONO,
          fontSize: metaSize,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: C.faint,
        }}
      >
        portfolio / 2026
      </div>
    </div>
  );
}

/* ---------- detail blocks (sage panel / band) ---------- */

function BasedIn({ labelSize }: { labelSize: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Label size={labelSize}>based_in</Label>
      <div
        style={{
          display: "flex",
          fontFamily: SERIF,
          fontSize: 30,
          lineHeight: 1,
          color: C.strong,
          whiteSpace: "nowrap",
        }}
      >
        <span>Austin,</span>
        <span style={{ color: C.accent }}>{" TX"}</span>
      </div>
    </div>
  );
}

function Currently({
  labelSize,
  titleSize,
  minWidth,
}: {
  labelSize: number;
  titleSize: number;
  minWidth?: number;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", ...(minWidth ? { minWidth } : {}) }}>
      <Label size={labelSize}>currently</Label>
      <div
        style={{
          display: "flex",
          fontFamily: SANS,
          fontSize: titleSize,
          fontWeight: 600,
          lineHeight: 1.2,
          color: C.strong,
          whiteSpace: "nowrap",
        }}
      >
        Sales Chat Specialist
      </div>
      <div
        style={{
          display: "flex",
          fontFamily: MONO,
          fontSize: 13,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: C.accent,
          marginTop: 5,
        }}
      >
        Apple
      </div>
    </div>
  );
}

function StatusBlock({ labelSize }: { labelSize: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Label size={labelSize} mb={10}>
        status
      </Label>
      <div
        style={{
          display: "flex",
          alignSelf: "flex-start",
          alignItems: "center",
          gap: 9,
          background: C.card,
          border: `1px solid ${C.sageBorder}`,
          borderRadius: 999,
          padding: "8px 14px",
        }}
      >
        <div
          style={{
            width: 9,
            height: 9,
            borderRadius: 999,
            background: C.dot,
            boxShadow: "0 0 0 4px rgba(115,134,120,0.18)",
          }}
        />
        <div style={{ display: "flex", fontFamily: MONO, fontSize: 13, color: C.strong }}>
          {"looking_for_work: "}
          <span style={{ color: C.accent }}>true</span>
        </div>
      </div>
    </div>
  );
}

function VRule() {
  return <div style={{ width: 1, alignSelf: "stretch", background: C.sageBorder, flexShrink: 0 }} />;
}

function HRule() {
  return <div style={{ height: 1, background: C.sageBorder, flexShrink: 0 }} />;
}

function SiteUrl({ fontSize }: { fontSize: number }) {
  return (
    <div
      style={{
        display: "flex",
        fontFamily: MONO,
        fontSize,
        letterSpacing: "0.06em",
        color: C.accent,
        whiteSpace: "nowrap",
      }}
    >
      rybealey.com
    </div>
  );
}

/* ---------- 1200×630 landscape (og:image + twitter:image) ---------- */

export function LandscapeShare() {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        background: C.page,
        color: C.body,
        fontFamily: SANS,
      }}
    >
      {/* LEFT: editorial wordmark + headline */}
      <div
        style={{
          flexGrow: 1,
          minWidth: 0,
          padding: "60px 56px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Wordmark size={22} metaSize={13} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Eyebrow fontSize={16} marginBottom={18} />
          <Headline fontSize={88} lineHeight={0.98} marginBottom={22} />
          <Lede fontSize={23} maxWidth={540} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {["React / Next.js", "TypeScript", "Design Systems"].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                fontFamily: MONO,
                fontSize: 13,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: C.faint,
                padding: "6px 12px",
                border: `1px solid ${C.border}`,
                borderRadius: 999,
                background: C.card,
                whiteSpace: "nowrap",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: sage detail panel */}
      <div
        style={{
          width: 392,
          flexShrink: 0,
          background: C.sage,
          borderLeft: `1px solid ${C.sageBorder}`,
          padding: "60px 48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <BasedIn labelSize={12} />
          <HRule />
          <Currently labelSize={12} titleSize={19} />
          <HRule />
          <StatusBlock labelSize={12} />
        </div>
        <SiteUrl fontSize={12} />
      </div>
    </div>
  );
}

/* ---------- 1080×1080 square (LinkedIn / Instagram asset) ---------- */

export function SquareShare() {
  return (
    <div
      style={{
        width: 1080,
        height: 1080,
        display: "flex",
        flexDirection: "column",
        background: C.page,
        color: C.body,
        fontFamily: SANS,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", flexShrink: 0, padding: "64px 64px 0" }}>
        <Wordmark size={26} metaSize={15} />
      </div>

      <div
        style={{
          flexGrow: 1,
          padding: "0 64px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Eyebrow fontSize={19} marginBottom={22} />
        <Headline fontSize={132} lineHeight={0.96} marginBottom={30} />
        <Lede fontSize={28} maxWidth={760} />
      </div>

      <div
        style={{
          flexShrink: 0,
          background: C.sage,
          borderTop: `1px solid ${C.sageBorder}`,
          padding: "44px 64px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 32,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 44 }}>
          <BasedIn labelSize={13} />
          <VRule />
          <Currently labelSize={13} titleSize={16} minWidth={280} />
          <VRule />
          <StatusBlock labelSize={13} />
        </div>
        <SiteUrl fontSize={14} />
      </div>
    </div>
  );
}
