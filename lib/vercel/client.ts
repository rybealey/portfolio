export interface VercelDeployment {
  uid: string;
  name: string;
  state: "BUILDING" | "ERROR" | "INITIALIZING" | "QUEUED" | "READY" | "CANCELED";
  created: number;  // ms epoch — when the deployment was queued
  ready?: number;   // ms epoch — when state became READY
  url: string;
  meta?: {
    githubCommitMessage?: string;
    githubCommitRef?: string;       // branch name
    githubCommitAuthorName?: string;
    gitlabCommitMessage?: string;
    gitlabCommitRef?: string;
  };
}

export interface DeploymentStats {
  deployments: VercelDeployment[];
  latest: VercelDeployment;
  isOperational: boolean;
  /** Percentage of settled (non-pending) deployments that are READY */
  uptimePct: number;
  /** Average ms from creation to READY, across READY deployments — null if no data */
  avgBuildMs: number | null;
  /** Number of deployments created in the last 30 days */
  deploymentsLast30d: number;
}

async function fetchDeployments(limit: number): Promise<VercelDeployment[]> {
  const token = process.env.VERCEL_API_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;

  if (!token || !projectId) return [];

  const url = new URL("https://api.vercel.com/v6/deployments");
  url.searchParams.set("projectId", projectId);
  url.searchParams.set("limit", String(limit));

  const teamId = process.env.VERCEL_TEAM_ID;
  if (teamId) url.searchParams.set("teamId", teamId);

  try {
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 300 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    return (data.deployments as VercelDeployment[]) ?? [];
  } catch {
    return [];
  }
}

/** Used on the dashboard — fetches only the single latest deployment. */
export async function getLatestDeployment(): Promise<VercelDeployment | null> {
  const deploys = await fetchDeployments(1);
  return deploys[0] ?? null;
}

/**
 * Used on the analytics page — fetches the last 20 deployments and
 * computes uptime %, avg build time, and 30-day deploy count.
 * Returns null when VERCEL_API_TOKEN / VERCEL_PROJECT_ID are not set.
 */
export async function getDeploymentStats(): Promise<DeploymentStats | null> {
  const deployments = await fetchDeployments(20);
  if (deployments.length === 0) return null;

  const latest = deployments[0];
  const isOperational = latest.state === "READY";

  // Only count deployments that have reached a terminal state
  const settled = deployments.filter((d) =>
    ["READY", "ERROR", "CANCELED"].includes(d.state)
  );
  const readyCount = settled.filter((d) => d.state === "READY").length;
  const uptimePct = settled.length > 0 ? (readyCount / settled.length) * 100 : 100;

  // Average build time across deployments that have a valid ready timestamp
  const buildTimes = deployments
    .filter((d) => d.state === "READY" && d.ready && d.ready > d.created)
    .map((d) => d.ready! - d.created);
  const avgBuildMs =
    buildTimes.length > 0
      ? buildTimes.reduce((a, b) => a + b, 0) / buildTimes.length
      : null;

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const deploymentsLast30d = deployments.filter((d) => d.created >= thirtyDaysAgo).length;

  return { deployments, latest, isOperational, uptimePct, avgBuildMs, deploymentsLast30d };
}
