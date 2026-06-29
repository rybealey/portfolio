import type { Metadata } from "next";
import {
  Newsreader,
  Hanken_Grotesk,
  JetBrains_Mono,
  Sora,
  Inter,
  Oswald,
  Montserrat,
} from "next/font/google";
import "./globals.css";

// Display serif — editorial weight & elegant italics
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

// UI / body sans — warm, legible grotesque
const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

// Mono / labels — engineer identity, code eyebrows
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

// Brand-kit faces — used only inside the SERVERIZZ project showcase, which
// reproduces that brand's own Sora display / Inter body pairing.
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// KnightLaunch brand faces — used only inside the KnightLaunch project
// showcase and its standalone brand guide (/guide/knightlaunch). Oswald is the
// condensed-display Knockout substitute; Montserrat is the Gotham substitute.
const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://rybealey.com";
const TITLE = "Ry Bealey — Portfolio";
const DESCRIPTION =
  "Founder, consultant and web engineer. I design and build thoughtful, user-centered products where infrastructure, design and code meet.";

export const metadata: Metadata = {
  // Resolves the file-based opengraph-image/twitter-image to absolute URLs.
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "Ry Bealey",
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable} ${sora.variable} ${inter.variable} ${oswald.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
