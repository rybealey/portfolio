import { ImageResponse } from "next/og";

import { SquareShare, loadOgFonts } from "@/lib/og";

// 1080×1080 square share card, served at /og/square — the variant to attach
// manually on LinkedIn and Instagram posts (those platforms don't honour
// per-link og:image targeting). Statically generated and cached.
export const dynamic = "force-static";

export async function GET() {
  return new ImageResponse(SquareShare(), {
    width: 1080,
    height: 1080,
    fonts: await loadOgFonts(),
  });
}
