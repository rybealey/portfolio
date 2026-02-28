"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  TrendingUp,
  Folder,
  Briefcase,
  Code,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { signOut } from "@/app/actions/auth";

const NAV = [
  {
    label: "OVERVIEW",
    items: [
      { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/admin/analytics", icon: TrendingUp, label: "Analytics" },
    ],
  },
  {
    label: "CONTENT",
    items: [
      { href: "/admin/projects", icon: Folder, label: "Projects" },
      { href: "/admin/work-history", icon: Briefcase, label: "Work History" },
      { href: "/admin/skills", icon: Code, label: "Skills" },
    ],
  },
  {
    label: "SYSTEM",
    items: [
{ href: "/admin/settings", icon: Settings, label: "Settings" },
    ],
  },
];

type SidebarProps = {
  userName: string;
  userEmail: string;
};

export function Sidebar({ userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="flex h-screen w-[260px] shrink-0 flex-col justify-between border-r border-border-light bg-bg-page">
      {/* Top */}
      <div className="flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5">
          <span className="font-mono text-base font-bold text-text-primary">ry.bealey</span>
          <span className="rounded px-2 py-0.5 font-mono text-[9px] font-bold tracking-[1.5px] text-bg-dark bg-brand">
            ADMIN
          </span>
        </div>

        <div className="h-px bg-border-light" />

        {/* Nav */}
        <nav className="flex flex-col gap-6 px-3 py-4">
          {NAV.map((section) => (
            <div key={section.label} className="flex flex-col gap-1">
              <span className="mb-1 px-3 font-mono text-[10px] font-semibold tracking-[2px] text-text-muted">
                {section.label}
              </span>
              {section.items.map(({ href, icon: Icon, label }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                      active
                        ? "bg-bg-card text-text-primary font-medium"
                        : "text-text-secondary hover:bg-bg-card/50 hover:text-text-primary"
                    }`}
                  >
                    <Icon
                      className={`h-[18px] w-[18px] shrink-0 ${active ? "text-brand" : "text-text-muted"}`}
                    />
                    {label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="flex flex-col">
        <div className="h-px bg-border-light" />
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-bg-card font-mono text-xs font-semibold text-text-secondary">
              {initials}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-text-primary leading-none">{userName}</span>
              <span className="font-mono text-[11px] text-text-muted leading-none">{userEmail}</span>
            </div>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="text-text-muted transition-colors hover:text-text-primary"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}

export function TopBar() {
  return (
    <div className="flex items-center justify-between border-b border-border-light px-8 py-4">
      {/* Search */}
      <div className="flex items-center gap-2.5 rounded-md border border-border-light bg-bg-page px-3.5 py-2 w-80">
        <svg className="h-4 w-4 shrink-0 text-text-muted" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <span className="text-sm text-text-muted flex-1">Search anything...</span>
        <span className="rounded border border-border-light px-2 py-0.5 font-mono text-[11px] text-text-muted">⌘K</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-md border border-border-light px-3.5 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View Site
        </Link>
      </div>
    </div>
  );
}
