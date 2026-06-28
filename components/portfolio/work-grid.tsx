"use client";

import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";

import { Tag } from "@/components/portfolio/tag";

/* ---------- content ---------- */

type Project = {
  slug: string;
  title: string;
  kicker: string;
  cats: string[];
  tags: string[];
  excerpt: string;
};

const PROJECTS: Project[] = [
  {
    slug: "serverizz",
    title: "SERVERIZZ®",
    kicker: "agency",
    cats: ["infrastructure", "engineering"],
    tags: ["Hosting", "WordPress", "Agency"],
    excerpt:
      "A full-service web-hosting and digital agency built from the ground up: cPanel/WHM and CloudLinux infrastructure, a custom WordPress delivery pipeline, and AI-assisted content and support.",
  },
  {
    slug: "impeccabyte",
    title: "Impeccabyte",
    kicker: "saas",
    cats: ["product", "engineering"],
    tags: ["SaaS", "Next.js", "Formation"],
    excerpt:
      "A business-formation SaaS that walks founders through the entire LLC and corporation setup: naming, registered agent, EIN filing, and member management in one streamlined flow.",
  },
  {
    slug: "portfolio-cms",
    title: "Portfolio CMS",
    kicker: "web app",
    cats: ["engineering"],
    tags: ["Next.js", "Supabase", "CMS"],
    excerpt:
      "A full-stack portfolio platform with a purpose-built admin CMS: public site and admin unified in one Next.js app, backed by Supabase for auth, data, and storage.",
  },
  {
    slug: "plasm",
    title: "Plasm",
    kicker: "design system",
    cats: ["design"],
    tags: ["Design System", "UI Kit"],
    excerpt:
      "A comprehensive design system and full-screen UI kit reimagining Agar.io, bridging game identity with a polished web app, authored with shadcn/ui handoff in mind.",
  },
];

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "design", label: "Design" },
  { key: "engineering", label: "Engineering" },
  { key: "product", label: "Product" },
  { key: "infrastructure", label: "Infrastructure" },
];

/* ---------- card ---------- */

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="mb-[18px] inline-block w-full break-inside-avoid align-top">
      <article className="project-card">
        {/* FEATURED IMAGE PLACEHOLDER — 16:9 */}
        <div
          className="relative w-full"
          style={{ aspectRatio: "16 / 9", background: "var(--xanadu-50)" }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon
              size={26}
              strokeWidth={1.5}
              style={{ color: "var(--xanadu-300)" }}
              aria-hidden
            />
          </div>
          <div
            className="absolute top-3 left-3 rounded-full px-[9px] py-1 font-mono text-[10px] tracking-[0.12em] uppercase"
            style={{
              color: "var(--white)",
              background: "rgba(27,32,28,0.5)",
              backdropFilter: "blur(4px)",
            }}
          >
            {project.kicker}
          </div>
        </div>

        {/* BODY */}
        <div className="px-[22px] pt-[22px] pb-6">
          <div className="flex items-start justify-between gap-3">
            <h3
              className="m-0 text-[23px] leading-[1.15]"
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 400,
                color: "var(--text-strong)",
              }}
            >
              {project.title}
            </h3>
            <span
              className="flex-none translate-y-[2px] font-mono text-[18px]"
              style={{ color: "var(--text-faint)" }}
              aria-hidden
            >
              ↗
            </span>
          </div>
          <p
            className="mt-[10px] text-[14.5px] leading-[1.6] text-pretty"
            style={{ color: "var(--text-body)" }}
          >
            {project.excerpt}
          </p>
          <div className="mt-4 flex flex-wrap gap-[7px]">
            {project.tags.map((t) => (
              <Tag key={t} tone="sage">
                {t}
              </Tag>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}

/* ---------- grid ---------- */

export function WorkGrid() {
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
                  background: on ? "var(--accent)" : "var(--surface-card)",
                  color: on ? "var(--white)" : "var(--text-muted)",
                  border: `1px solid ${on ? "var(--accent)" : "var(--border-default)"}`,
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

      {/* MASONRY GRID */}
      <div style={{ columns: "400px", columnGap: "18px" }}>
        {visible.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </div>
  );
}
