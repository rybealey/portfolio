/**
 * ServerizzCover — a live, resolution-independent dark "terminal window" cover
 * for the SERVERIZZ project, mirroring the design's current `cover-serverizz`
 * render. Used behind the bento card chrome (`card`) and as the project-detail
 * hero cover (`detail`).
 *
 * Authored to the design's 1080px artboard, expressed in container-query width
 * units (1cqw = 1% of the cover's width; design-px ÷ 10.8) so it scales to any
 * container width and stays crisp — no raster upscaling. The SERVERIZZ design
 * tokens (--szz-*) are inlined as their resolved hex values.
 */

const BORDER = "#1E3A5F";
const BLUE = "#60A5FA";
const GREEN = "#22C55E";
const T_LIGHT = "#CBD5E1";
const T_MUTED = "#94A3B8";
const T_DIM = "#64748B";
const T_FAINT = "#475569";

export function ServerizzCover({ variant = "detail" }: { variant?: "card" | "detail" }) {
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
          "radial-gradient(76cqw 65cqw at 50% 44%, rgba(96,165,250,0.16), rgba(11,14,24,0) 62%), linear-gradient(180deg, #0B0E18 0%, #0F1626 46%, #0B0E18 100%)",
      }}
    >
      {/* faint grid texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(30,58,95,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(30,58,95,0.18) 1px, transparent 1px)",
          backgroundSize: "5.56cqw 5.56cqw",
          WebkitMaskImage: "radial-gradient(83.3cqw 44.4cqw at 50% 46%, #000 40%, transparent 86%)",
          maskImage: "radial-gradient(83.3cqw 44.4cqw at 50% 46%, #000 40%, transparent 86%)",
          pointerEvents: "none",
        }}
      />

      {/* single focal element: terminal window, branded in its title bar */}
      <div
        style={{
          position: "relative",
          width: "85.2cqw",
          border: `1px solid ${BORDER}`,
          borderRadius: "1.48cqw",
          background: "#0D1117",
          boxShadow: "0 2.22cqw 6.48cqw rgba(0,0,0,0.5), 0 0.74cqw 4.63cqw rgba(96,165,250,0.16)",
          overflow: "hidden",
        }}
      >
        {/* title bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.3cqw",
            padding: "1.67cqw 2.22cqw",
            borderBottom: `1px solid ${BORDER}`,
            background: "#111827",
          }}
        >
          <span style={{ width: "1.2cqw", height: "1.2cqw", borderRadius: "50%", background: "#EF4444" }} />
          <span style={{ width: "1.2cqw", height: "1.2cqw", borderRadius: "50%", background: "#F59E0B" }} />
          <span style={{ width: "1.2cqw", height: "1.2cqw", borderRadius: "50%", background: "#22C55E" }} />
          <div style={{ display: "flex", alignItems: "baseline", gap: "1.02cqw", marginLeft: "1.3cqw", whiteSpace: "nowrap" }}>
            <span style={{ fontFamily: "var(--font-sora), sans-serif", fontWeight: 800, fontSize: "1.57cqw", letterSpacing: "0.14cqw", color: "#FFFFFF" }}>
              SERVERIZZ
            </span>
            <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: "1.2cqw", color: T_DIM }}>— deploy</span>
          </div>
          <span
            style={{
              marginLeft: "auto",
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "1.11cqw",
              letterSpacing: "0.185cqw",
              color: BLUE,
              whiteSpace: "nowrap",
            }}
          >
            {"// IaaS · AGENCY"}
          </span>
        </div>

        {/* body */}
        <div style={{ padding: "3.15cqw 3.52cqw 3.52cqw", fontFamily: "var(--font-jetbrains), monospace", fontSize: "1.94cqw", lineHeight: 1.95 }}>
          <div>
            <span style={{ color: GREEN }}>$</span> <span style={{ color: BLUE }}>serverizz deploy</span>{" "}
            <span style={{ color: T_LIGHT }}>--region us-east --scale auto</span>
          </div>
          <div style={{ color: T_MUTED }}>
            <span style={{ color: GREEN }}>✓</span> provisioning compute{"  "}
            <span style={{ color: T_FAINT }}>4 vCPU · 8 GB</span>
          </div>
          <div style={{ color: T_MUTED }}>
            <span style={{ color: GREEN }}>✓</span> network configured{"  "}
            <span style={{ color: T_FAINT }}>edge · 32 regions</span>
          </div>
          <div style={{ color: T_MUTED }}>
            <span style={{ color: GREEN }}>✓</span> managed database attached
          </div>
          <div style={{ marginTop: "0.74cqw" }}>
            <span style={{ color: BLUE }}>→</span> <span style={{ color: "#FFFFFF" }}>live in</span>{" "}
            <span style={{ color: BLUE }}>4.2s</span> <span style={{ color: T_DIM }}>·</span>{" "}
            <span style={{ color: T_LIGHT }}>https://app.serverizz.com</span>
            <span style={{ display: "inline-block", width: "1.02cqw", height: "2.04cqw", background: BLUE, verticalAlign: "-0.37cqw", marginLeft: "0.56cqw" }} />
          </div>
          <div style={{ marginTop: "2.04cqw", fontFamily: "var(--font-sora), sans-serif", fontWeight: 800, fontSize: "2.41cqw", letterSpacing: "-0.046cqw", color: "#FFFFFF" }}>
            Ship infrastructure. <span style={{ color: BLUE }}>Ship software. Ship brands.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
