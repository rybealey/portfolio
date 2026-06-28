import { Tag } from "@/components/portfolio/tag";

const AI_TAGS = [
  "LLM Integration",
  "Prompt Engineering",
  "RAG Pipelines",
  "AI Agents",
  "Claude & GPT APIs",
  "AI-Assisted Dev",
];

/**
 * AiCard — the sage "building_with_ai" block. Anchors the right column where
 * the clock + now-playing widgets used to sit.
 */
export function AiCard() {
  return (
    <div
      className="flex flex-col rounded-[var(--radius-lg)] p-6"
      style={{
        background: "var(--surface-sage)",
        border: "1px solid var(--xanadu-200)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div
          className="font-mono text-[11px] tracking-[var(--tracking-label)] uppercase"
          style={{ color: "var(--xanadu-600)" }}
        >
          <span className="opacity-55">{"// "}</span>building_with_ai
        </div>
        <div
          className="inline-flex items-center gap-[7px] font-mono text-[11px]"
          style={{ color: "var(--xanadu-700)" }}
        >
          <span
            className="h-[7px] w-[7px] flex-none rounded-full"
            style={{
              background: "var(--accent)",
              boxShadow: "0 0 0 3px rgba(115,134,120,0.2)",
            }}
          />
          shipping
        </div>
      </div>
      <h3
        className="mt-[14px] mb-2 text-[24px] leading-[1.12]"
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 400,
          letterSpacing: "-0.015em",
          color: "var(--text-strong)",
        }}
      >
        AI woven into the{" "}
        <em className="italic" style={{ color: "var(--text-accent)" }}>
          product
        </em>
        .
      </h3>
      <p
        className="m-0 mb-4 max-w-[360px] text-sm leading-[1.55]"
        style={{ color: "var(--xanadu-700)" }}
      >
        Embedding LLMs into real products: RAG search, agentic workflows, and AI-assisted content and
        support that actually ship.
      </p>
      <div className="flex flex-wrap gap-[7px]">
        {AI_TAGS.map((t) => (
          <Tag key={t} tone="ink">
            {t}
          </Tag>
        ))}
      </div>
    </div>
  );
}
