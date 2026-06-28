"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Tag } from "@/components/portfolio/tag";
import { ProjectMotif } from "@/components/portfolio/project-motif";
import { PROJECTS, projectIndex, type Project } from "@/lib/projects";

/* ---------- building blocks ---------- */

/** A labelled content row: a mono `// label` rail beside the section body. */
function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="grid gap-3 border-t pt-9 md:grid-cols-[200px_1fr] md:gap-7"
      style={{ borderColor: "var(--border-subtle)" }}
    >
      <div className="eyebrow text-[13px]">
        <span className="opacity-55">{"// "}</span>
        {label}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2 font-mono text-[12px]">
      <span style={{ color: "var(--text-faint)" }}>{label} /</span>
      <span style={{ color: "var(--text-muted)" }}>{value}</span>
    </div>
  );
}

/* ---------- overlay ---------- */

export function ProjectDetail({
  slug,
  onClose,
  onNavigate,
}: {
  slug: string;
  onClose: () => void;
  onNavigate: (slug: string) => void;
}) {
  const idx = projectIndex(slug);
  const project: Project | undefined = PROJECTS[idx];

  // Esc closes the overlay; lock the body while it's open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  if (!project) return null;

  const { detail } = project;
  const prev = PROJECTS[(idx - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(idx + 1) % PROJECTS.length];

  return (
    <div
      className="animate-panel-in fixed inset-0 z-[90] overflow-y-auto"
      style={{ background: "var(--surface-page)" }}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} — project detail`}
    >
      {/* STICKY TOP BAR */}
      <div
        className="sticky top-0 z-[2] flex items-center justify-between gap-4 px-[clamp(20px,4vw,40px)] py-3"
        style={{
          background: "rgba(246,244,236,0.86)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer font-mono text-[12px] hover:underline"
          style={{ color: "var(--text-body)" }}
        >
          ← selected work
        </button>
        <span
          className="truncate font-mono text-[12px] tracking-[0.12em] uppercase"
          style={{ color: "var(--text-faint)" }}
        >
          {project.title}
        </span>
      </div>

      {/* CONTENT */}
      <div className="mx-auto max-w-[940px] px-[clamp(20px,4vw,40px)] pt-[clamp(28px,5vw,52px)] pb-[120px]">
        {/* HERO */}
        <div className="eyebrow text-[13px]">
          <span className="opacity-55">{"// "}</span>
          {detail.kicker}
        </div>
        <h1
          className="mt-3 text-[clamp(38px,6vw,62px)] leading-[1.02]"
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 400,
            letterSpacing: "-0.025em",
            color: "var(--text-strong)",
          }}
        >
          {project.title}
        </h1>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1">
          <MetaItem label="role" value={detail.role} />
          <MetaItem label="year" value={detail.year} />
        </div>
        <p
          className="mt-5 max-w-[680px] text-[clamp(17px,2.2vw,20px)] leading-[1.55]"
          style={{ color: "var(--text-body)" }}
        >
          {detail.summary}
        </p>
        {(detail.liveUrl || detail.repoUrl) && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {detail.liveUrl && (
              <Button
                asChild
                className="h-11 rounded-[var(--radius-sm)] px-5 text-[14.5px] font-semibold hover:bg-[var(--accent-hover)]"
              >
                <a href={detail.liveUrl} target="_blank" rel="noopener">
                  visit live ↗
                </a>
              </Button>
            )}
            {detail.repoUrl && (
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-[var(--radius-sm)] px-5 text-[14.5px] font-medium"
              >
                <a href={detail.repoUrl} target="_blank" rel="noopener">
                  source ↗
                </a>
              </Button>
            )}
          </div>
        )}

        {/* COVER */}
        <div
          className="relative mt-9 w-full overflow-hidden rounded-[var(--radius-lg)]"
          style={{
            aspectRatio: "16 / 9",
            border: "1px solid var(--border-default)",
            boxShadow: "var(--shadow-sm)",
            background: "var(--xanadu-50)",
          }}
        >
          {project.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.cover} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <ProjectMotif slug={project.slug} />
          )}
        </div>

        {/* SECTIONS */}
        <div className="mt-10 flex flex-col gap-9">
          {/* overview */}
          <Section label="overview">
            <div className="flex max-w-[620px] flex-col gap-4">
              {detail.overview.map((para, i) => (
                <p key={i} className="m-0 text-[16px] leading-[1.7]" style={{ color: "var(--text-body)" }}>
                  {para}
                </p>
              ))}
            </div>
          </Section>

          {/* what_i_did */}
          <Section label="what_i_did">
            <div className="flex flex-col gap-5">
              {detail.contributions.map((c) => (
                <div key={c.title} className="pl-[18px]" style={{ borderLeft: "2px solid var(--xanadu-200)" }}>
                  <h4 className="m-0 text-[16px] font-semibold" style={{ color: "var(--text-strong)" }}>
                    {c.title}
                  </h4>
                  <p className="mt-1 mb-0 text-[14.5px] leading-[1.6]" style={{ color: "var(--text-muted)" }}>
                    {c.body}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          {/* key_features */}
          <Section label="key_features">
            <div
              className="grid gap-3"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}
            >
              {detail.features.map((f) => (
                <div
                  key={f}
                  className="flex items-start gap-2 px-4 py-[14px]"
                  style={{
                    background: "var(--surface-card)",
                    border: "1px solid var(--border-default)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <span className="flex-none text-[14px]" style={{ color: "var(--accent-hover)" }} aria-hidden>
                    →
                  </span>
                  <span className="text-[14px] leading-[1.4]" style={{ color: "var(--text-body)" }}>
                    {f}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          {/* stack */}
          <Section label="stack">
            <div className="flex flex-col gap-4">
              {detail.stack.map((g) => (
                <div key={g.group}>
                  <div
                    className="mb-[9px] font-mono text-[11px] tracking-[0.12em] uppercase"
                    style={{ color: "var(--text-faint)" }}
                  >
                    {g.group}
                  </div>
                  <div className="flex flex-wrap gap-[7px]">
                    {g.items.map((item) => (
                      <Tag key={item} tone="sage">
                        {item}
                      </Tag>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* process */}
          <Section label="process">
            <ol className="m-0 flex list-none flex-col p-0">
              {detail.timeline.map((step, i) => {
                const last = i === detail.timeline.length - 1;
                return (
                  <li key={step.phase + step.title} className="relative flex gap-4 pb-7 last:pb-0">
                    {/* gutter: node + connector */}
                    <div className="relative flex w-[13px] flex-none justify-center">
                      {!last && (
                        <span
                          className="absolute top-[13px] bottom-[-28px] w-[2px]"
                          style={{ background: "var(--xanadu-200)" }}
                          aria-hidden
                        />
                      )}
                      <span
                        className="relative mt-[5px] h-[13px] w-[13px] flex-none rounded-full"
                        style={{
                          background: "var(--surface-page)",
                          border: "2px solid var(--accent-hover)",
                          boxShadow: "0 0 0 4px var(--surface-sage)",
                        }}
                        aria-hidden
                      />
                    </div>
                    {/* content */}
                    <div className="min-w-0 pt-[2px]">
                      <span
                        className="inline-block rounded-full px-[10px] py-[3px] font-mono text-[11px] tracking-[0.06em]"
                        style={{
                          color: "var(--accent-hover)",
                          background: "var(--surface-sage)",
                          border: "1px solid var(--xanadu-200)",
                        }}
                      >
                        {step.phase}
                      </span>
                      <h4
                        className="mt-2 mb-0 text-[19px]"
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontWeight: 400,
                          color: "var(--text-strong)",
                        }}
                      >
                        {step.title}
                      </h4>
                      <p className="mt-1 mb-0 text-[14.5px] leading-[1.6]" style={{ color: "var(--text-muted)" }}>
                        {step.body}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Section>

          {/* outcomes */}
          <Section label="outcomes">
            <div
              className="grid gap-3"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" }}
            >
              {detail.outcomes.map((o) => (
                <div
                  key={o.label}
                  className="p-5"
                  style={{
                    background: "var(--surface-sage)",
                    border: "1px solid var(--xanadu-200)",
                    borderRadius: "var(--radius-lg)",
                  }}
                >
                  <div
                    className="text-[30px] leading-none"
                    style={{ fontFamily: "var(--font-serif)", color: "var(--text-strong)" }}
                  >
                    {o.stat}
                  </div>
                  <div
                    className="mt-2 font-mono text-[11px] tracking-[0.06em]"
                    style={{ color: "var(--xanadu-700)" }}
                  >
                    {o.label}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* gallery */}
          <Section label="gallery">
            <div
              className="grid gap-3"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}
            >
              {detail.gallery.map((g) => (
                <div
                  key={g.id}
                  className="relative overflow-hidden"
                  style={{
                    aspectRatio: "4 / 3",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-default)",
                    background: "var(--xanadu-50)",
                  }}
                >
                  <ProjectMotif slug={project.slug} />
                  <span
                    className="absolute bottom-2 left-2 rounded-full px-[8px] py-[3px] font-mono text-[10px] tracking-[0.08em] uppercase"
                    style={{
                      color: "var(--text-muted)",
                      background: "rgba(246,244,236,0.82)",
                      backdropFilter: "blur(3px)",
                      WebkitBackdropFilter: "blur(3px)",
                    }}
                  >
                    {g.placeholder}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* PREV / NEXT */}
        <div
          className="mt-12 grid grid-cols-2 gap-4 border-t pt-7"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <button
            type="button"
            onClick={() => onNavigate(prev.slug)}
            className="group cursor-pointer text-left"
          >
            <div className="font-mono text-[11px] tracking-[0.1em] uppercase" style={{ color: "var(--text-faint)" }}>
              ← previous
            </div>
            <div
              className="mt-1 text-[21px] group-hover:underline"
              style={{ fontFamily: "var(--font-serif)", color: "var(--text-strong)" }}
            >
              {prev.title}
            </div>
          </button>
          <button
            type="button"
            onClick={() => onNavigate(next.slug)}
            className="group cursor-pointer text-right"
          >
            <div className="font-mono text-[11px] tracking-[0.1em] uppercase" style={{ color: "var(--text-faint)" }}>
              next →
            </div>
            <div
              className="mt-1 text-[21px] group-hover:underline"
              style={{ fontFamily: "var(--font-serif)", color: "var(--text-strong)" }}
            >
              {next.title}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
