import { KnightLaunchCover } from "@/components/portfolio/knightlaunch-cover";
import { ServerizzCover } from "@/components/portfolio/serverizz-cover";
import { ImpeccabyteCover } from "@/components/portfolio/impeccabyte-cover";
import { ProjectMotif } from "@/components/portfolio/project-motif";

/**
 * ProjectCover — resolves a project's slug to its live, resolution-independent
 * cover (mirroring the design's `cover-<slug>` renders). Shared by the work-grid
 * card and the project-detail hero so both stay crisp at any size and in sync
 * with the design. Unknown slugs fall back to the generic brand motif.
 */
export function ProjectCover({
  slug,
  variant = "detail",
}: {
  slug: string;
  variant?: "card" | "detail";
}) {
  switch (slug) {
    case "serverizz":
      return <ServerizzCover variant={variant} />;
    case "impeccabyte":
      return <ImpeccabyteCover variant={variant} />;
    case "knightlaunch":
      return <KnightLaunchCover variant={variant} />;
    default:
      return <ProjectMotif slug={slug} />;
  }
}
