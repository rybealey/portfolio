"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClockCard } from "@/components/portfolio/clock-card";
import { NowPlayingCard } from "@/components/portfolio/now-playing-card";
import { FloatingNav, type NavKey } from "@/components/portfolio/floating-nav";
import { ContactSheet } from "@/components/portfolio/contact-sheet";

/* ---------- content ---------- */

const SKILLS: { group: string; tone: "paper" | "sage"; items: string[] }[] = [
  { group: "DESIGN", tone: "paper", items: ["UI / UX Design", "Prototyping", "User Research"] },
  {
    group: "DEVELOPMENT",
    tone: "paper",
    items: ["React / Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Supabase"],
  },
  { group: "TOOLS", tone: "sage", items: ["VS Code", "GitHub", "Vercel", "Claude Code"] },
];

const TAG_TONES = {
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
} as const;

/* ---------- small primitives ---------- */

function Tag({ children, tone }: { children: React.ReactNode; tone: "paper" | "sage" }) {
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

/* ---------- page ---------- */

export function BentoPortfolio() {
  const [active, setActive] = useState<NavKey>("home");
  const [sheetOpen, setSheetOpen] = useState(false);

  // Scroll-spy: mirror the active floating-nav item to the section in view.
  useEffect(() => {
    const topOf = (id: string) => {
      const el = document.getElementById(id);
      return el ? el.getBoundingClientRect().top + window.scrollY : Infinity;
    };
    const onScroll = () => {
      const doc = document.documentElement;
      const atBottom = window.innerHeight + window.scrollY >= doc.scrollHeight - 60;
      const y = window.scrollY + 140;
      let tab: NavKey = "home";
      if (y >= topOf("about")) tab = "about";
      if (y >= topOf("work")) tab = "work";
      if (y >= topOf("contact")) tab = "contact";
      if (atBottom) tab = "contact";
      setActive((prev) => (prev === tab ? prev : tab));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToId = useCallback((id: string, offset: number) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }, []);

  const navigate = useCallback(
    (key: NavKey) => {
      if (key === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        scrollToId(key, key === "about" ? 24 : 80);
      }
    },
    [scrollToId],
  );

  return (
    <div className="min-h-screen pb-[124px]" style={{ background: "var(--surface-page)" }}>
      {/* ===== TOP NAV ===== */}
      <nav
        className="flex items-center justify-between px-[clamp(24px,5vw,64px)] py-4"
        style={{
          background: "var(--surface-page)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div
          className="font-mono text-[15px] font-medium tracking-[-0.01em]"
          style={{ color: "var(--text-accent)" }}
        >
          ry.bealey
        </div>
        <div
          className="font-mono text-xs tracking-[0.12em] uppercase"
          style={{ color: "var(--text-faint)" }}
        >
          portfolio / 2026
        </div>
      </nav>

      <main className="mx-auto max-w-[1180px] px-[clamp(20px,4vw,40px)] pt-[clamp(28px,5vw,56px)]">
        {/* ===== INTRO BENTO ===== */}
        <div className="flex flex-wrap items-start gap-4">
          {/* HERO */}
          <div className="bento flex min-w-[300px] flex-[1_1_320px] flex-col p-[30px]">
            <div className="eyebrow">
              <span className="opacity-55">{"// "}</span>founder · consultant · web engineer
            </div>
            <h1
              className="display my-[14px] text-[clamp(40px,5.4vw,60px)] leading-[1.02]"
              style={{ letterSpacing: "-0.025em" }}
            >
              Ry <em className="italic" style={{ color: "var(--text-accent)" }}>Bealey</em>.
            </h1>
            <p
              className="m-0 max-w-[440px] text-base leading-[1.6]"
              style={{ color: "var(--text-body)" }}
            >
              I design and build thoughtful, user-centered products — where infrastructure, design
              and code meet.
            </p>
            <div className="mt-[26px] flex flex-wrap items-center gap-3">
              <Button
                onClick={() => navigate("work")}
                className="h-11 rounded-[var(--radius-sm)] px-5 text-[14.5px] font-semibold hover:bg-[var(--accent-hover)]"
              >
                view projects
              </Button>
              <Button
                variant="ghost"
                onClick={() => setSheetOpen(true)}
                className="h-11 rounded-[var(--radius-xs)] bg-transparent px-1 font-mono text-[14.5px] font-medium text-[var(--text-accent)] underline-offset-[3px] hover:bg-transparent hover:underline"
              >
                get in touch
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN: CLOCK + NOW PLAYING */}
          <div className="flex min-w-[280px] flex-[1_1_320px] flex-col gap-4">
            <ClockCard />
            <NowPlayingCard />
          </div>
        </div>

        {/* ===== ABOUT BENTO ===== */}
        <div
          id="about"
          className="mt-4 flex flex-wrap items-start gap-4 scroll-mt-6"
        >
          {/* PORTRAIT */}
          <div
            className="relative aspect-square min-w-[160px] flex-[1_1_200px] overflow-hidden rounded-[var(--radius-lg)]"
            style={{
              border: "1px solid var(--border-default)",
              boxShadow: "var(--shadow-sm)",
              background: "var(--surface-sunken)",
            }}
          >
            <Image
              src="/portrait.jpeg"
              alt="Ry Bealey"
              fill
              sizes="(max-width: 700px) 50vw, 300px"
              className="object-cover"
              priority
            />
            <div
              className="pointer-events-none absolute top-3 left-3 z-[1] rounded-full px-[9px] py-1 font-mono text-[11px] tracking-[0.12em] uppercase"
              style={{
                color: "var(--white)",
                background: "rgba(27,32,28,0.5)",
                backdropFilter: "blur(4px)",
              }}
            >
              {"// me"}
            </div>
          </div>

          {/* BASED_IN (map) + CURRENTLY */}
          <div className="flex min-w-[200px] flex-[1_1_200px] flex-col gap-4">
            {/* BASED_IN map */}
            <div
              className="relative h-[196px] overflow-hidden rounded-[var(--radius-lg)]"
              style={{
                border: "1px solid var(--border-default)",
                boxShadow: "var(--shadow-sm)",
                background: "var(--xanadu-50)",
              }}
            >
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
              <svg
                viewBox="0 0 240 160"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
              >
                <path
                  d="M-10 104 C 50 80, 86 122, 124 96 S 200 58, 260 78"
                  fill="none"
                  stroke="var(--xanadu-300)"
                  strokeWidth="9"
                  strokeLinecap="round"
                  opacity="0.85"
                />
              </svg>
              <div
                className="absolute top-3 left-3 rounded-full px-[9px] py-1 font-mono text-[11px] tracking-[0.12em] whitespace-nowrap uppercase"
                style={{
                  color: "var(--text-muted)",
                  background: "rgba(246,244,236,0.85)",
                  backdropFilter: "blur(3px)",
                }}
              >
                <span className="opacity-55">{"// "}</span>based_in
              </div>
              <div
                className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-[7px] rounded-full px-[11px] py-[5px]"
                style={{
                  background: "var(--surface-card)",
                  border: "1px solid var(--border-default)",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                <span
                  className="h-2 w-2 flex-none rounded-full"
                  style={{
                    background: "var(--amber-500)",
                    boxShadow: "0 0 0 4px rgba(198,138,78,0.18)",
                  }}
                />
                <span
                  className="font-mono text-[11.5px] whitespace-nowrap"
                  style={{ color: "var(--text-strong)" }}
                >
                  Austin, TX
                </span>
              </div>
              <div
                className="absolute bottom-3 left-3 rounded-full px-[7px] py-0.5 font-mono text-[10px] whitespace-nowrap"
                style={{ color: "var(--text-faint)", background: "rgba(246,244,236,0.7)" }}
              >
                30.27° N, 97.74° W
              </div>
            </div>

            {/* CURRENTLY */}
            <div className="bento flex flex-col p-[22px]">
              <div className="mono-label">
                <span className="opacity-55">{"// "}</span>currently
              </div>
              <div className="mt-auto flex items-center gap-[11px] pt-4">
                <svg
                  viewBox="0 0 384 512"
                  width="17"
                  height="22"
                  role="img"
                  aria-label="Apple"
                  className="flex-none"
                  style={{ fill: "var(--text-strong)" }}
                >
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                </svg>
                <div>
                  <div
                    className="text-[15px] leading-[1.2] font-semibold"
                    style={{ color: "var(--text-strong)" }}
                  >
                    Sales Chat Specialist
                  </div>
                  <div
                    className="mt-[3px] font-mono text-[11px] tracking-[0.08em] uppercase"
                    style={{ color: "var(--text-accent)" }}
                  >
                    Apple
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SKILLS */}
          <div className="bento flex min-w-[280px] flex-[2_1_416px] flex-col gap-4 p-6">
            <div className="mono-label">
              <span className="opacity-55">{"// "}</span>stack
            </div>
            {SKILLS.map((s) => (
              <div key={s.group}>
                <div
                  className="mb-[9px] font-mono text-[11px] tracking-[0.12em]"
                  style={{ color: "var(--text-faint)" }}
                >
                  {s.group}
                </div>
                <div className="flex flex-wrap gap-[7px]">
                  {s.items.map((item) => (
                    <Tag key={item} tone={s.tone}>
                      {item}
                    </Tag>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== WORK ===== */}
        <div id="work" className="mt-14 mb-[22px] scroll-mt-20">
          <div className="eyebrow text-[13px]">
            <span className="opacity-55">{"// "}</span>selected_work
          </div>
          <h2 className="display mt-3 text-[clamp(30px,4vw,42px)]" style={{ letterSpacing: "-0.02em" }}>
            Selected work.
          </h2>
        </div>
        <div
          className="rounded-[var(--radius-lg)] px-7 py-[44px] text-center font-mono text-[13px] tracking-[0.04em]"
          style={{ border: "1px dashed var(--border-strong)", color: "var(--text-faint)" }}
        >
          <span className="opacity-60">{"// "}</span>case studies in progress
        </div>

        {/* ===== CONTACT ===== */}
        <div
          id="contact"
          className="mt-14 flex scroll-mt-20 flex-col rounded-[var(--radius-lg)] p-[clamp(36px,5vw,56px)]"
          style={{ background: "var(--surface-inverse)", boxShadow: "var(--shadow-md)" }}
        >
          <div className="font-mono text-[13px]" style={{ color: "var(--xanadu-300)" }}>
            <span className="opacity-60">{"// "}</span>contact
          </div>
          <h2
            className="my-[14px] mb-4 text-[clamp(32px,4.5vw,48px)]"
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "var(--white)",
            }}
          >
            Let&apos;s work together.
          </h2>
          <p
            className="m-0 mb-7 max-w-[520px] text-[17px] leading-[1.65]"
            style={{ color: "var(--paper-200)" }}
          >
            Have a project in mind, or just want to chat? I&apos;m always open to discussing new
            opportunities and ideas.
          </p>
          <div className="flex flex-wrap items-center gap-[18px]">
            <Button
              onClick={() => setSheetOpen(true)}
              className="h-[52px] rounded-[var(--radius-sm)] px-7 text-base font-semibold hover:bg-[var(--accent-hover)]"
            >
              send an email
            </Button>
            <a
              href="https://github.com/rybealey"
              target="_blank"
              rel="noopener"
              className="font-mono text-[13px] no-underline hover:underline"
              style={{ color: "var(--xanadu-300)" }}
            >
              GitHub ↗
            </a>
            <a
              href="https://www.linkedin.com/in/ryanbealey/"
              target="_blank"
              rel="noopener"
              className="font-mono text-[13px] no-underline hover:underline"
              style={{ color: "var(--xanadu-300)" }}
            >
              LinkedIn ↗
            </a>
          </div>
          <div className="mt-12 font-mono text-[11px]" style={{ color: "var(--ink-400)" }}>
            © 2026 Ry Bealey. All rights reserved.
          </div>
        </div>
      </main>

      <FloatingNav active={active} onNavigate={navigate} hidden={sheetOpen} />
      <ContactSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
}
