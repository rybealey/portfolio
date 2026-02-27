import Link from "next/link";
import { Eye, Folder, Mail, Activity, ArrowUpRight, Plus, MoreHorizontal } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/proxy";
import { getLatestDeployment } from "@/lib/vercel/client";

function relativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

export default async function DashboardPage() {
  const user = await requireAuth();
  const supabase = await createClient();

  const fullName = (user.user_metadata?.full_name as string | undefined) ?? user.email ?? "Admin";
  const firstName = fullName.split(" ")[0];

  const [{ count: projectCount }, { data: recentProjects }, deployment] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("projects").select().order("created_at", { ascending: false }).limit(4),
    getLatestDeployment(),
  ]);

  const isOperational = deployment?.state === "READY";
  const uptimeValue = deployment ? (isOperational ? "99.9%" : deployment.state) : "—";
  const uptimeChange = deployment
    ? {
        dot: true,
        color: isOperational ? "bg-green-400" : "bg-red-400",
        text: isOperational ? "All systems operational" : "Deployment issue detected",
      }
    : null;
  const uptimeNote = !deployment ? "Add VERCEL_API_TOKEN to enable" : undefined;

  const stats = [
    {
      label: "Total Views",
      value: "—",
      icon: Eye,
      change: null,
      note: "No public Vercel Analytics API",
    },
    {
      label: "Projects",
      value: String(projectCount ?? 0),
      icon: Folder,
      change: { icon: ArrowUpRight, color: "text-green-400", text: "in your portfolio" },
    },
    {
      label: "Messages",
      value: "—",
      icon: Mail,
      change: null,
      note: "Coming soon",
    },
    {
      label: "Uptime",
      value: uptimeValue,
      icon: Activity,
      valueCyan: true,
      change: uptimeChange,
      note: uptimeNote,
    },
  ];

  return (
    <div className="flex flex-col gap-7 p-8">
      {/* Page header */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-bold text-text-primary">Welcome back, {firstName}</h1>
          <p className="text-sm text-text-secondary">
            Here&apos;s what&apos;s happening with your portfolio today.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-bg-dark transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-4 rounded-lg border border-border-light bg-bg-page p-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-text-secondary">{stat.label}</span>
              <stat.icon className="h-[18px] w-[18px] text-text-muted" />
            </div>
            <span className={`font-mono text-[28px] font-bold leading-none ${stat.valueCyan ? "text-brand" : "text-text-primary"}`}>
              {stat.value}
            </span>
            {stat.change && (
              <div className="flex items-center gap-1.5">
                {"icon" in stat.change && stat.change.icon && (
                  <stat.change.icon className={`h-3.5 w-3.5 ${stat.change.color}`} />
                )}
                {"dot" in stat.change && stat.change.dot && (
                  <span className={`h-2 w-2 rounded-full ${stat.change.color}`} />
                )}
                <span className="text-xs text-text-muted">{stat.change.text}</span>
              </div>
            )}
            {!stat.change && stat.note && (
              <span className="text-xs text-text-muted">{stat.note}</span>
            )}
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="flex gap-5" style={{ minHeight: 0, flex: 1 }}>
        {/* Recent Projects table */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-border-light bg-bg-page">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border-light px-6 py-5">
            <span className="text-[15px] font-semibold text-text-primary">Recent Projects</span>
            <Link href="/admin/projects" className="text-xs font-medium text-brand hover:opacity-80">
              View all →
            </Link>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-[1fr_120px_140px_40px] border-b border-border-light px-6 py-3">
            {["PROJECT", "STATUS", "UPDATED", ""].map((col) => (
              <span key={col} className="font-mono text-[10px] font-semibold tracking-[2px] text-text-muted">
                {col}
              </span>
            ))}
          </div>

          {/* Rows */}
          {(recentProjects ?? []).length > 0 ? (
            (recentProjects ?? []).map((project, i, arr) => (
              <div
                key={project.id}
                className={`grid grid-cols-[1fr_120px_140px_40px] items-center px-6 py-4 ${i < arr.length - 1 ? "border-b border-border-light" : ""}`}
              >
                <span className="text-sm font-medium text-text-primary">{project.name}</span>
                <div>
                  <span className="rounded-full bg-green-500/10 px-2.5 py-1 font-mono text-[11px] font-medium text-green-400">
                    Published
                  </span>
                </div>
                <span className="text-[13px] text-text-secondary">
                  {new Date(project.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <button className="flex items-center justify-center text-text-muted hover:text-text-primary transition-colors">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="flex flex-1 items-center justify-center py-16">
              <p className="font-mono text-sm text-text-muted">No projects yet.</p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="flex w-[340px] shrink-0 flex-col overflow-hidden rounded-lg border border-border-light bg-bg-page">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border-light px-6 py-5">
            <span className="text-[15px] font-semibold text-text-primary">Recent Activity</span>
            {(recentProjects ?? []).length > 0 && (
              <span className="rounded-full bg-brand px-2 py-0.5 font-mono text-[10px] font-semibold text-bg-dark">
                {recentProjects!.length} new
              </span>
            )}
          </div>

          {/* Activity items */}
          <div className="flex flex-col">
            {(recentProjects ?? []).length > 0 ? (
              (recentProjects ?? []).map((project, i) => {
                const dotColors = ["bg-brand", "bg-yellow-400", "bg-green-400", "bg-text-muted"];
                return (
                  <div
                    key={project.id}
                    className="flex items-start gap-3.5 border-b border-border-light px-6 py-3.5 last:border-b-0"
                  >
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotColors[i % dotColors.length]}`} />
                    <div className="flex flex-col gap-1">
                      <span className="text-[13px] font-medium text-text-primary">
                        Added {project.name}
                      </span>
                      <span className="font-mono text-[11px] text-text-muted">
                        {relativeTime(new Date(project.created_at))}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-1 items-center justify-center py-16">
                <p className="font-mono text-sm text-text-muted">No activity yet.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-auto border-t border-border-light px-6 py-4 text-center">
            <Link href="/admin/projects" className="text-xs font-medium text-brand hover:opacity-80">
              View all activity →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
