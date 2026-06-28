import { Badge } from "@/components/ui/badge";

/**
 * Tag — the small mono pill used across the bento (skills, AI, project cards).
 * Tones mirror the Ry Bealey design-system Tag exactly.
 */
export type TagTone = "paper" | "sage" | "ink" | "amber";

const TAG_TONES: Record<TagTone, { background: string; color: string; borderColor: string }> = {
  paper: {
    background: "var(--surface-card)",
    color: "var(--text-body)",
    borderColor: "var(--border-default)",
  },
  sage: {
    background: "var(--xanadu-100)",
    color: "var(--xanadu-700)",
    borderColor: "var(--xanadu-200)",
  },
  ink: {
    background: "var(--ink-900)",
    color: "var(--paper-50)",
    borderColor: "var(--ink-900)",
  },
  amber: {
    background: "var(--highlight-soft)",
    color: "var(--amber-600)",
    borderColor: "var(--amber-200)",
  },
};

export function Tag({ children, tone = "sage" }: { children: React.ReactNode; tone?: TagTone }) {
  return (
    <Badge
      variant="outline"
      className="h-6 rounded-full border px-[9px] font-mono text-[var(--text-2xs)] font-medium tracking-[var(--tracking-label)] uppercase"
      style={TAG_TONES[tone]}
    >
      {children}
    </Badge>
  );
}
