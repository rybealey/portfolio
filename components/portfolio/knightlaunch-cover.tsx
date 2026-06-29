/**
 * KnightLaunchCover — a live, resolution-independent black-and-gold cover for
 * the KnightLaunch project, mirroring the design's `cover-knightlaunch` render.
 * Used behind the bento card chrome (`card`) and as the project-detail hero
 * cover (`detail`). It scales fluidly with its container via container-query
 * units, so it stays crisp at any size (unlike a raster PNG).
 *
 * The `card` variant drops the phase triad so the card's title/excerpt overlay
 * reads cleanly over the lower portion; the `detail` variant shows the full
 * composition including the Explore / Design / Launch phase cards.
 */

const GOLD = "#FFC904";

function CompassIcon({ stroke }: { stroke: string }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function DraftingCompassIcon({ stroke }: { stroke: string }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m12.99 6.74 1.93 3.44" />
      <path d="M19.136 12a10 10 0 0 1-14.271 0" />
      <path d="m21 21-2.16-3.84" />
      <path d="m3 21 8.02-14.26" />
      <circle cx="12" cy="5" r="2" />
    </svg>
  );
}

function RocketIcon({ stroke }: { stroke: string }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

const PHASES = [
  { num: "01", name: "Explore", Icon: CompassIcon, gold: false },
  { num: "02", name: "Design", Icon: DraftingCompassIcon, gold: false },
  { num: "03", name: "Launch", Icon: RocketIcon, gold: true },
] as const;

export function KnightLaunchCover({ variant = "detail" }: { variant?: "card" | "detail" }) {
  const showPhases = variant === "detail";
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        containerType: "size",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "3.2cqmin",
        padding: "6cqmin",
        fontFamily: "var(--font-oswald), 'Arial Narrow', sans-serif",
        background:
          "radial-gradient(70cqmin 56cqmin at 50% 32%, rgba(255,201,4,0.14), rgba(0,0,0,0) 64%), #000000",
      }}
    >
      {/* faint gold grid texture, faded out toward the edges */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,201,4,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,201,4,0.06) 1px, transparent 1px)",
          backgroundSize: "7cqmin 7cqmin",
          WebkitMaskImage:
            "radial-gradient(76cqmin 50cqmin at 50% 42%, #000 38%, transparent 84%)",
          maskImage: "radial-gradient(76cqmin 50cqmin at 50% 42%, #000 38%, transparent 84%)",
          pointerEvents: "none",
        }}
      />

      {/* eyebrow */}
      <div
        style={{
          position: "relative",
          fontWeight: 500,
          fontSize: "2.6cqmin",
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          color: GOLD,
          whiteSpace: "nowrap",
        }}
      >
        UCF College of Business · CEL
      </div>

      {/* wordmark */}
      <div
        style={{
          position: "relative",
          fontWeight: 700,
          fontSize: "clamp(22px, 13cqmin, 112px)",
          lineHeight: 0.92,
          letterSpacing: "0.005em",
          textTransform: "uppercase",
          color: "#FFFFFF",
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        Knight<span style={{ color: GOLD }}>Launch</span>
      </div>

      {/* gold accent rule */}
      <div style={{ position: "relative", width: "18cqmin", height: "0.7cqmin", minHeight: 3, background: GOLD }} />

      {/* quest line */}
      <div
        style={{
          position: "relative",
          fontFamily: "var(--font-montserrat), system-ui, sans-serif",
          fontWeight: 500,
          fontSize: "clamp(11px, 3.6cqmin, 30px)",
          lineHeight: 1.4,
          color: "#BFBFBF",
          textAlign: "center",
        }}
      >
        Every venture is a quest.
      </div>

      {/* phase triad (detail only) */}
      {showPhases && (
        <div style={{ position: "relative", display: "flex", alignItems: "stretch", gap: "2.4cqmin", marginTop: "3cqmin" }}>
          {PHASES.map(({ num, name, Icon, gold }) => (
            <div
              key={num}
              style={{
                width: "26cqmin",
                maxWidth: 262,
                borderRadius: 8,
                border: `1px solid ${gold ? GOLD : "rgba(255,201,4,0.34)"}`,
                borderTop: `0.4cqmin solid ${GOLD}`,
                background: gold ? GOLD : "#0A0A0A",
                padding: "3.4cqmin 2.6cqmin 3.8cqmin",
                display: "flex",
                flexDirection: "column",
                gap: "1.6cqmin",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: "3.4cqmin", color: gold ? "#000000" : GOLD, lineHeight: 1 }}>{num}</span>
                <span style={{ width: "3.8cqmin", height: "3.8cqmin", display: "inline-flex" }}>
                  <Icon stroke={gold ? "#000000" : "#FFFFFF"} />
                </span>
              </div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "3.4cqmin",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: gold ? "#000000" : "#FFFFFF",
                  lineHeight: 1,
                }}
              >
                {name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
