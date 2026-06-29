import type { Metadata } from "next";

import { KnightLaunchGuide } from "@/components/guide/knightlaunch-guide";
import "./guide.css";

export const metadata: Metadata = {
  title: "KnightLaunch — Design System Guide",
  description:
    "The KnightLaunch brand & design system: black-and-gold UCF foundations, Oswald / Montserrat type, the Explore · Design · Launch quest, components, and a full homepage UI kit.",
  // Internal showcase reached from the portfolio — keep it out of search indexes.
  robots: { index: false, follow: false },
};

export default function KnightLaunchGuidePage() {
  return <KnightLaunchGuide />;
}
