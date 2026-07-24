/**
 * ImpeccabyteCover — a live, resolution-independent warm/editorial cover for the
 * Impeccabyte project, mirroring the design's current `cover-impeccabyte` render.
 * Used behind the bento card chrome (`card`) and as the project-detail hero
 * cover (`detail`).
 *
 * Authored to the design's 1080px artboard, expressed in container-query width
 * units (1cqw = 1% of the cover's width; design-px ÷ 10.8) so the composition
 * scales to any container width and stays crisp — no raster upscaling.
 */

const CLAY = "#C0623E";
const AMBER = "#E0A04D";
const INK = "#2A211A";

export function ImpeccabyteCover({ variant = "detail" }: { variant?: "card" | "detail" }) {
  // The design cover is identical in both crops; the container handles framing.
  void variant;
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        containerType: "size",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(76cqw 65cqw at 50% 42%, rgba(224,160,77,0.16), rgba(250,246,239,0) 64%), #FAF6EF",
      }}
    >
      {/* centered, crop-safe cluster */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "2.78cqw",
          width: "90.7cqw",
        }}
      >
        {/* emblem + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.67cqw" }}>
          <span style={{ width: "6.1cqw", height: "6.1cqw", display: "inline-flex" }}>
            <svg width="100%" height="100%" viewBox="16 22 68 68" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <defs>
                <linearGradient id="ibRise" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0" stopColor="#C0623E" />
                  <stop offset="0.55" stopColor="#D27C46" />
                  <stop offset="1" stopColor="#E0A04D" />
                </linearGradient>
              </defs>
              <rect x="16" y="60" width="68" height="30" rx="7" fill="#C0623E" />
              <rect x="25" y="68" width="13" height="9" rx="2.5" fill="#2A211A" opacity="0.2" />
              <g fill="url(#ibRise)">
                <rect x="28" y="46" width="11" height="11" rx="3.4" />
                <rect x="43" y="34" width="11" height="11" rx="3.4" />
                <rect x="58" y="22" width="11" height="11" rx="3.4" />
              </g>
            </svg>
          </span>
          <span
            style={{
              fontFamily: "var(--font-newsreader), serif",
              fontWeight: 600,
              fontSize: "3.7cqw",
              letterSpacing: "-0.02em",
              color: INK,
            }}
          >
            Impecca<span style={{ color: CLAY }}>byte</span>
          </span>
        </div>

        {/* headline */}
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-newsreader), serif",
            fontWeight: 600,
            fontSize: "5.37cqw",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: INK,
            whiteSpace: "nowrap",
          }}
        >
          Impeccably{" "}
          <em style={{ fontStyle: "italic", color: CLAY }}>convenient.</em>
        </h1>

        {/* subhead */}
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-hanken), sans-serif",
            fontSize: "2.04cqw",
            lineHeight: 1.5,
            color: "#5C4E40",
            maxWidth: "66.7cqw",
          }}
        >
          Merchant services for the next generation of founders. Get paid in minutes, not days.
        </p>

        {/* pills + pricing */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.48cqw", marginTop: "0.56cqw" }}>
          <span
            style={{
              fontFamily: "var(--font-hanken), sans-serif",
              fontSize: "1.67cqw",
              fontWeight: 600,
              color: "#FFFFFF",
              background: CLAY,
              padding: "1.3cqw 2.59cqw",
              borderRadius: "999px",
              boxShadow: "0 0.74cqw 2.04cqw rgba(192,98,62,0.30)",
              whiteSpace: "nowrap",
            }}
          >
            Get started
          </span>
          <span
            style={{
              fontFamily: "var(--font-hanken), sans-serif",
              fontSize: "1.67cqw",
              fontWeight: 600,
              color: INK,
              background: AMBER,
              padding: "1.3cqw 2.59cqw",
              borderRadius: "999px",
              whiteSpace: "nowrap",
            }}
          >
            See pricing
          </span>
          <span
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "1.48cqw",
              color: "#9A6A3F",
              marginLeft: "0.56cqw",
              whiteSpace: "nowrap",
            }}
          >
            2.6% + 10¢ · no monthly fee
          </span>
        </div>
      </div>
    </div>
  );
}
