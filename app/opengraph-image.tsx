import { ImageResponse } from "next/og";

import { LandscapeShare, loadOgFonts } from "@/lib/og";

export const alt =
  "Ry Bealey — founder, consultant and web engineer based in Austin, TX. Looking for work.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(LandscapeShare(), { ...size, fonts: await loadOgFonts() });
}
