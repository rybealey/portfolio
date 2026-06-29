"use client";

import { useState } from "react";

import { FILTERS, PROJECTS, type Project } from "@/lib/projects";
import { ProjectMotif } from "@/components/portfolio/project-motif";
import { KnightLaunchCover } from "@/components/portfolio/knightlaunch-cover";

/* ---------- card ---------- */

function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (slug: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(project.slug)}
      className="work-card group relative aspect-square overflow-hidden"
      aria-label={`Open project: ${project.title}`}
    >
      {/* MEDIA — live cover, real cover image, or a brand motif fallback */}
      {project.slug === "knightlaunch" ? (
        <KnightLaunchCover variant="card" />
      ) : project.cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.cover}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <ProjectMotif slug={project.slug} />
      )}

      {/* SCRIM — anchors white text to the bottom of the card */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to top, rgba(27,32,28,0.94) 0%, rgba(27,32,28,0.78) 24%, rgba(27,32,28,0.32) 50%, rgba(27,32,28,0.04) 74%, rgba(27,32,28,0) 100%)",
        }}
      />

      {/* KICKER BADGE */}
      <span
        className="absolute top-[14px] left-[14px] rounded-full px-[9px] py-1 font-mono text-[10px] tracking-[0.12em] uppercase"
        style={{
          color: "var(--white)",
          background: "rgba(27,32,28,0.4)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
        }}
      >
        {project.kicker}
      </span>

      {/* ARROW */}
      <span
        className="work-card-arrow absolute top-[13px] right-[15px] font-mono text-[18px] leading-none"
        style={{
          color: "rgba(255,255,255,0.82)",
          transition: "transform var(--dur-base) var(--ease-out)",
        }}
        aria-hidden
      >
        ↗
      </span>

      {/* CONTENT */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-[9px] p-[22px]">
        <h3
          className="m-0 leading-[1.1]"
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 400,
            letterSpacing: "-0.01em",
            fontSize: 22,
            color: "var(--white)",
          }}
        >
          {project.title}
        </h3>
        <p
          className="m-0 line-clamp-2 text-[13.5px] leading-[1.5] text-pretty"
          style={{ color: "rgba(246,244,236,0.84)" }}
        >
          {project.excerpt}
        </p>
        <div className="mt-[3px] flex flex-wrap gap-[6px]">
          {project.tags.map((t) => (
            <span
              key={t}
              className="rounded-full px-[9px] py-1 font-mono text-[10px] tracking-[0.08em] uppercase"
              style={{
                color: "var(--white)",
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                border: "1px solid rgba(255,255,255,0.24)",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

/* ---------- grid ---------- */

export function WorkGrid({ onOpenProject }: { onOpenProject: (slug: string) => void }) {
  const [filter, setFilter] = useState("all");
  const visible = PROJECTS.filter((p) => filter === "all" || p.cats.includes(filter));

  return (
    <div className="my-auto w-full max-w-[1180px]">
      {/* HEADER + FILTER BAR */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="flex-none">
          <div className="eyebrow text-[13px]">
            <span className="opacity-55">{"// "}</span>selected_work
          </div>
          <h2
            className="display mt-3 text-[clamp(30px,4vw,42px)] whitespace-nowrap"
            style={{ letterSpacing: "-0.02em" }}
          >
            Selected work.
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const on = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                aria-pressed={on}
                className="cursor-pointer rounded-full px-[15px] py-2 font-mono text-[11px] tracking-[0.1em] whitespace-nowrap uppercase"
                style={{
                  // Active chip: saturated brand green with white text (AA-contrast).
                  // The inactive chip stays a light paper pill with muted ink text.
                  background: on ? "var(--accent-hover)" : "var(--surface-card)",
                  color: on ? "var(--white)" : "var(--text-muted)",
                  border: `1px solid ${on ? "var(--accent-hover)" : "var(--border-default)"}`,
                  boxShadow: on ? "var(--shadow-sm)" : "none",
                  transition:
                    "background-color 0.22s var(--ease-out), color 0.22s var(--ease-out), border-color 0.22s var(--ease-out)",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* BENTO GRID — uniform square tiles, two-up above 680px */}
      {visible.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 min-[680px]:grid-cols-2">
          {visible.map((p) => (
            <ProjectCard key={p.slug} project={p} onOpen={onOpenProject} />
          ))}
        </div>
      ) : (
        <div
          className="rounded-[var(--radius-lg)] px-7 py-[72px] text-center"
          style={{ border: "1px dashed var(--border-strong)" }}
        >
          <div
            className="font-mono text-[13px] tracking-[0.04em]"
            style={{ color: "var(--text-faint)" }}
          >
            <span className="opacity-60">{"// "}</span>no_projects_yet
          </div>
          <p
            className="mx-auto mt-[14px] max-w-[360px] text-[15px] leading-[1.6]"
            style={{ color: "var(--text-muted)" }}
          >
            Nothing here under this filter yet. Try another, or check back soon.
          </p>
        </div>
      )}
    </div>
  );
}
