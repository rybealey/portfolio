/**
 * ProjectMotif — a per-project decorative visual used wherever a real cover
 * image is absent (work cards, detail cover, gallery tiles). Each motif reuses
 * the brand's grid + route + geometry language in Xanadu tones, so empty media
 * slots read as intentional artwork rather than blank placeholders.
 */

type MotifProps = { slug: string; className?: string };

/** Faint 24px brand grid, shared by every motif. */
function Grid() {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0 23px, var(--xanadu-100) 23px 24px), repeating-linear-gradient(90deg, transparent 0 23px, var(--xanadu-100) 23px 24px)",
        }}
      />
      <div
        className="absolute inset-[-25%]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(34deg, transparent 0 46px, var(--xanadu-100) 46px 47px)",
        }}
      />
    </>
  );
}

const STROKE = "var(--xanadu-300)";
const FILL_SOFT = "var(--xanadu-200)";
const ACCENT = "var(--xanadu-400)";

/** Distinct geometry per project, themed to its discipline. */
const SHAPES: Record<string, React.ReactNode> = {
  // Infrastructure — stacked server racks linked by routing paths.
  serverizz: (
    <>
      <path
        d="M-10 118 C 60 92, 96 130, 150 100 S 220 68, 270 88"
        fill="none"
        stroke={STROKE}
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.7"
      />
      {[44, 62, 80].map((y) => (
        <g key={y}>
          <rect x="150" y={y} width="74" height="13" rx="3" fill={FILL_SOFT} opacity="0.85" />
          <circle cx="160" cy={y + 6.5} r="2.6" fill={ACCENT} />
          <rect x="170" y={y + 5} width="40" height="3" rx="1.5" fill={STROKE} />
        </g>
      ))}
    </>
  ),
  // SaaS — a guided flow: connected step nodes.
  impeccabyte: (
    <>
      <path
        d="M40 110 L 96 70 L 152 110 L 208 70"
        fill="none"
        stroke={STROKE}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
      {[
        [40, 110],
        [96, 70],
        [152, 110],
        [208, 70],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={i === 1 ? 13 : 10}
          fill="var(--xanadu-50)"
          stroke={i === 1 ? ACCENT : STROKE}
          strokeWidth="4"
        />
      ))}
    </>
  ),
  // Web app — layered browser panels.
  "portfolio-cms": (
    <>
      {[
        [110, 44, 0.55],
        [96, 58, 0.75],
        [82, 72, 1],
      ].map(([x, y, op], i) => (
        <g key={i} opacity={op as number}>
          <rect
            x={x as number}
            y={y as number}
            width="96"
            height="64"
            rx="6"
            fill="var(--xanadu-50)"
            stroke={STROKE}
            strokeWidth="3"
          />
          <rect x={(x as number) + 0} y={y as number} width="96" height="13" rx="6" fill={FILL_SOFT} />
          <circle cx={(x as number) + 10} cy={(y as number) + 6.5} r="2.2" fill={ACCENT} />
          <circle cx={(x as number) + 18} cy={(y as number) + 6.5} r="2.2" fill={STROKE} />
        </g>
      ))}
    </>
  ),
  // Design system — overlapping cells (an Agar.io nod).
  plasm: (
    <>
      {[
        [78, 96, 30],
        [142, 70, 22],
        [188, 104, 16],
        [116, 118, 12],
      ].map(([cx, cy, r], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill={i % 2 ? "transparent" : FILL_SOFT}
          stroke={i % 2 ? ACCENT : STROKE}
          strokeWidth="3.5"
          opacity={i % 2 ? 0.9 : 0.7}
        />
      ))}
    </>
  ),
};

export function ProjectMotif({ slug, className }: MotifProps) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className ?? ""}`}
      style={{ background: "linear-gradient(135deg, var(--xanadu-50), var(--xanadu-100))" }}
      aria-hidden
    >
      <Grid />
      <svg viewBox="0 0 240 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        {SHAPES[slug] ?? SHAPES.plasm}
      </svg>
    </div>
  );
}
