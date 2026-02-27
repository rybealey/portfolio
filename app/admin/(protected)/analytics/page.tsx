import { Calendar, CheckCircle2, XCircle, Clock, GitBranch } from "lucide-react";
import { getDeploymentStats, type VercelDeployment } from "@/lib/vercel/client";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function relativeTime(ms: number): string {
  const diff = Date.now() - ms;
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(mins  / 60);
  const days  = Math.floor(hours / 24);
  if (mins  <  1) return "just now";
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days  === 1) return "yesterday";
  return `${days}d ago`;
}

function formatBuildTime(ms: number): string {
  const secs = Math.round(ms / 1000);
  if (secs < 60) return `${secs}s`;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return s === 0 ? `${m}m` : `${m}m ${s}s`;
}

function commitLabel(d: VercelDeployment): string {
  const msg = d.meta?.githubCommitMessage ?? d.meta?.gitlabCommitMessage ?? null;
  if (!msg) return "Manual deploy";
  return msg.length > 52 ? msg.slice(0, 52).trimEnd() + "…" : msg;
}

function branchLabel(d: VercelDeployment): string {
  return d.meta?.githubCommitRef ?? d.meta?.gitlabCommitRef ?? "—";
}

const STATE_STYLES: Record<string, { label: string; badge: string }> = {
  READY:        { label: "Ready",     badge: "bg-green-500/10 text-green-400"   },
  ERROR:        { label: "Failed",    badge: "bg-red-500/10 text-red-400"       },
  BUILDING:     { label: "Building",  badge: "bg-yellow-500/10 text-yellow-400" },
  INITIALIZING: { label: "Starting",  badge: "bg-yellow-500/10 text-yellow-400" },
  QUEUED:       { label: "Queued",    badge: "bg-bg-card text-text-muted"       },
  CANCELED:     { label: "Cancelled", badge: "bg-bg-card text-text-muted"       },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function AnalyticsPage() {
  const stats = await getDeploymentStats();

  const hasVercel    = stats !== null;
  const isOperational = stats?.isOperational ?? false;

  const serverRows = [
    {
      label: "Status",
      value: !hasVercel ? "—" : isOperational ? "Operational" : stats!.latest.state,
      green: hasVercel && isOperational,
    },
    {
      label: "Uptime",
      value: hasVercel ? `${stats!.uptimePct.toFixed(1)}%` : "—",
      green: hasVercel && stats!.uptimePct >= 99,
    },
    {
      label: "Avg Build Time",
      value: hasVercel && stats!.avgBuildMs ? formatBuildTime(stats!.avgBuildMs) : "—",
      green: false,
    },
    {
      label: "Deploys (30d)",
      value: hasVercel ? String(stats!.deploymentsLast30d) : "—",
      green: false,
    },
    {
      label: "Last Deployed",
      value: hasVercel ? relativeTime(stats!.latest.created) : "—",
      green: false,
    },
  ];

  const recentDeploys = stats?.deployments.slice(0, 6) ?? [];

  return (
    <div className="flex flex-col gap-7 p-8">
      {/* Page header */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-bold text-text-primary">Analytics</h1>
          <p className="text-sm text-text-secondary">
            Monitor deployment health and server performance.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-border-light px-4 py-2.5 text-sm text-text-secondary">
          <Calendar className="h-4 w-4" />
          Last 30 days
        </div>
      </div>

      {/* Server status + recent deployments row */}
      <div className="flex gap-5">
        {/* Server Status */}
        <div className="flex w-[300px] shrink-0 flex-col overflow-hidden rounded-lg border border-border-light bg-bg-page">
          <div className="flex items-center gap-2.5 border-b border-border-light px-6 py-5">
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${
                !hasVercel ? "bg-text-muted" : isOperational ? "bg-green-400" : "bg-red-400"
              }`}
            />
            <span className="text-[15px] font-semibold text-text-primary">Server Status</span>
          </div>
          {serverRows.map(({ label, value, green }, i) => (
            <div
              key={label}
              className={`flex items-center justify-between px-6 py-4 ${i < serverRows.length - 1 ? "border-b border-border-light" : ""}`}
            >
              <span className="text-[13px] text-text-secondary">{label}</span>
              <span className={`font-mono text-[13px] font-semibold ${green ? "text-green-400" : "text-text-primary"}`}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Recent Deployments */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-border-light bg-bg-page">
          <div className="flex items-center justify-between border-b border-border-light px-6 py-5">
            <span className="text-[15px] font-semibold text-text-primary">Recent Deployments</span>
            {hasVercel && (
              <span className="font-mono text-[11px] text-text-muted">
                {stats!.deploymentsLast30d} this month
              </span>
            )}
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-[1fr_160px_120px_100px_90px] border-b border-border-light px-6 py-2.5">
            {["COMMIT", "BRANCH", "STATUS", "BUILD TIME", "DEPLOYED"].map((col) => (
              <span key={col} className="font-mono text-[10px] font-semibold tracking-[2px] text-text-muted">
                {col}
              </span>
            ))}
          </div>

          {recentDeploys.length > 0 ? (
            recentDeploys.map((d, i) => {
              const style  = STATE_STYLES[d.state] ?? STATE_STYLES.CANCELED;
              const buildMs = d.state === "READY" && d.ready ? d.ready - d.created : null;
              return (
                <div
                  key={d.uid}
                  className={`grid grid-cols-[1fr_160px_120px_100px_90px] items-center px-6 py-3.5 ${
                    i < recentDeploys.length - 1 ? "border-b border-border-light" : ""
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {d.state === "READY"
                      ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-400" />
                      : d.state === "ERROR"
                      ? <XCircle className="h-3.5 w-3.5 shrink-0 text-red-400" />
                      : <Clock className="h-3.5 w-3.5 shrink-0 text-yellow-400" />
                    }
                    <span className="truncate text-sm text-text-primary">{commitLabel(d)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <GitBranch className="h-3 w-3 shrink-0 text-text-muted" />
                    <span className="truncate font-mono text-[12px] text-text-secondary">{branchLabel(d)}</span>
                  </div>
                  <div>
                    <span className={`rounded-full px-2.5 py-1 font-mono text-[11px] font-medium ${style.badge}`}>
                      {style.label}
                    </span>
                  </div>
                  <span className="font-mono text-[12px] text-text-secondary">
                    {buildMs ? formatBuildTime(buildMs) : "—"}
                  </span>
                  <span className="font-mono text-[12px] text-text-muted">{relativeTime(d.created)}</span>
                </div>
              );
            })
          ) : (
            <div className="flex flex-1 items-center justify-center py-16">
              <p className="font-mono text-sm text-text-muted">
                {hasVercel ? "No deployments found." : "Add VERCEL_API_TOKEN to enable."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
