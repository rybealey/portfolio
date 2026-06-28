/**
 * Project content — the single source of truth shared by the work grid
 * (card list + filtering) and the project-detail overlay. Mirrors the
 * "Bento Portfolio" design's project dataset.
 */

export type Contribution = { title: string; body: string };
export type StackGroup = { group: string; items: string[] };
export type TimelineStep = { phase: string; title: string; body: string };
export type Outcome = { stat: string; label: string };
export type GalleryItem = { id: string; placeholder: string };

export type ProjectDetail = {
  kicker: string;
  role: string;
  year: string;
  liveUrl: string | null;
  repoUrl: string | null;
  summary: string;
  overview: string[];
  contributions: Contribution[];
  features: string[];
  stack: StackGroup[];
  timeline: TimelineStep[];
  outcomes: Outcome[];
  gallery: GalleryItem[];
};

export type Project = {
  slug: string;
  title: string;
  kicker: string;
  /** Filter categories this project belongs to. */
  cats: string[];
  tags: string[];
  excerpt: string;
  /** Optional cover image path (under /public). Falls back to a motif. */
  cover?: string;
  detail: ProjectDetail;
};

export const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "design", label: "Design" },
  { key: "engineering", label: "Engineering" },
  { key: "product", label: "Product" },
  { key: "infrastructure", label: "Infrastructure" },
];

export const PROJECTS: Project[] = [
  {
    slug: "serverizz",
    title: "SERVERIZZ®",
    kicker: "design system",
    cats: ["design", "engineering"],
    tags: ["Design System", "Brand", "UI Kit"],
    excerpt:
      "The brand and product design system for SERVERIZZ: a dark, terminal-fluent language of tokens, components, and UI kits powering the IaaS platform and agency.",
    cover: "/images/serverizz-cover.png",
    detail: {
      kicker: "design system · brand",
      role: "Design Systems Lead",
      year: "2024 — 2026",
      liveUrl: "https://www.serverizz.com?ref=rybealey.com",
      repoUrl: null,
      summary:
        "A complete, machine-readable design system for SERVERIZZ, the cloud-infrastructure platform and digital agency. One dark, terminal-fluent brand language: color and type tokens, a Lucide icon standard, a React component library, and full-screen UI-kit recreations of both shipping products.",
      overview: [
        "SERVERIZZ needed a single source of truth that read as developer-native, terminal-fluent, fast, and a little irreverent, while staying disciplined enough to ship real product. The system encodes that into tokens, components, and patterns.",
        "It is dark-first by default: a deep navy-black canvas, one electric-blue accent, and terminal-green signals, with the traffic-light terminal chip as the recurring motif across marketing and the dashboard.",
      ],
      contributions: [
        {
          title: "Token foundations",
          body: "Authored the full --szz-* palette, the Sora / Inter / JetBrains Mono type scale, 4px-grid spacing, and the radii, border, and shadow effects.",
        },
        {
          title: "Component library",
          body: "Built the React primitives, Button, Badge, Card, Input, and Stat, plus brand pieces: TerminalLogo, SectionEyebrow, and the animated Terminal.",
        },
        {
          title: "UI kits",
          body: "Recreated both product surfaces full-screen: the marketing website and the authenticated infrastructure portal.",
        },
        {
          title: "Brand voice",
          body: "Codified the triadic tagline cadence and terminal-as-language rules so copy stays on-brand everywhere.",
        },
      ],
      features: [
        "Dark-first color system",
        "Sora / Inter / JetBrains Mono scale",
        "Terminal-chip logo motif",
        "Lucide icon standard",
        "Button · Badge · Card · Input · Stat",
        "Animated terminal component",
        "Marketing + dashboard UI kits",
        "Traffic-light status vocabulary",
      ],
      stack: [
        { group: "Typefaces", items: ["Sora", "Inter", "JetBrains Mono"] },
        {
          group: "Palette",
          items: ["Midnight #0B0E18", "Navy #111827", "Electric #60A5FA", "Terminal #22C55E"],
        },
        { group: "Build", items: ["React", "Tailwind v4", "Lucide", "Design Tokens"] },
      ],
      timeline: [
        {
          phase: "Tokens",
          title: "Foundations",
          body: "Color, type, spacing, and effect tokens as the single source of truth.",
        },
        {
          phase: "Components",
          title: "Primitives",
          body: "Accessible React components built directly on the tokens.",
        },
        {
          phase: "Brand",
          title: "Terminal motif",
          body: "The terminal chip, code eyebrows, and animated terminal that carry the identity.",
        },
        {
          phase: "Kits",
          title: "Product surfaces",
          body: "Full-screen UI kits for the website and the infrastructure portal.",
        },
      ],
      outcomes: [
        { stat: "2", label: "product surfaces unified" },
        { stat: "120+", label: "design tokens" },
        { stat: "8", label: "core + brand components" },
      ],
      gallery: [
        { id: "detail-gal-serverizz-1", placeholder: "color tokens" },
        { id: "detail-gal-serverizz-2", placeholder: "component library" },
        { id: "detail-gal-serverizz-3", placeholder: "marketing UI kit" },
      ],
    },
  },
  {
    slug: "impeccabyte",
    title: "Impeccabyte",
    kicker: "design system",
    cats: ["design", "product"],
    tags: ["Design System", "Brand", "Fintech"],
    excerpt:
      "A warm, editorial brand and product system for Impeccabyte: merchant services for the next generation of founders. Clay and amber on cream, with a crafted serif voice.",
    cover: "/images/impeccabyte-cover.png",
    detail: {
      kicker: "design system · brand",
      role: "Brand & Design Systems",
      year: "2025",
      liveUrl: "https://impeccabyte.com?ref=rybealey.com",
      repoUrl: null,
      summary:
        "A warm, editorial design system for Impeccabyte, merchant services and payment processing for younger founders. Clay, amber, and warm browns on cream paper, paired with a crafted Newsreader serif voice: fintech clarity, made by hand rather than by committee.",
      overview: [
        "Impeccabyte helps freelancers, makers, and small storefronts get paid without corporate friction. The brand had to feel accepting and encouraging, yet genuinely professional, we take you seriously the day you start.",
        "The system answers that with a warm, earthy palette and rounded, paper-soft surfaces: like a modern fintech, but softer and more human. Reference vibe: Mercury, slightly less sterile.",
      ],
      contributions: [
        {
          title: "Warm palette & tokens",
          body: "Built the clay / amber / clove scale on warm cream paper, with earthy semantic hues and warm-tinted shadows. No pure black anywhere.",
        },
        {
          title: "Editorial type pairing",
          body: "Paired a Newsreader serif display, italic clay as the signature flourish, with Hanken Grotesk for UI and JetBrains Mono for figures.",
        },
        {
          title: "Rounded component set",
          body: "Authored pill buttons, soft cards, and friendly form controls; the roundness is core to the approachable, not-corporate feel.",
        },
        {
          title: "Marketing UI kit",
          body: "Assembled the landing and pricing surfaces that put plain, unburied pricing front and center.",
        },
      ],
      features: [
        "Clay / amber / clove palette",
        "Newsreader + Hanken pairing",
        "Full-pill buttons & badges",
        "Warm layered shadows",
        "Lucide icon standard",
        "Soft paper-card surfaces",
        "Landing + pricing UI kit",
        "Earthy semantic signals",
      ],
      stack: [
        { group: "Typefaces", items: ["Newsreader", "Hanken Grotesk", "JetBrains Mono"] },
        {
          group: "Palette",
          items: ["Clay #C0623E", "Amber #E0A04D", "Clove #7A5C42", "Paper #FAF6EF"],
        },
        { group: "Build", items: ["React", "Design Tokens", "Lucide"] },
      ],
      timeline: [
        {
          phase: "Brief",
          title: "Direction",
          body: "Warm, earthy palette; serif display; crafted, not corporate.",
        },
        {
          phase: "Tokens",
          title: "Foundations",
          body: "Color, type, spacing, radius, and motion tokens.",
        },
        {
          phase: "Components",
          title: "Rounded set",
          body: "Pill buttons, soft cards, and friendly forms.",
        },
        {
          phase: "Kit",
          title: "Marketing site",
          body: "Landing and pricing that put plain pricing first.",
        },
      ],
      outcomes: [
        { stat: "2.6%", label: "flat + 10¢, never buried" },
        { stat: "0", label: "monthly fees" },
        { stat: "Mins", label: "to first payout" },
      ],
      gallery: [
        { id: "detail-gal-impeccabyte-1", placeholder: "landing page" },
        { id: "detail-gal-impeccabyte-2", placeholder: "pricing" },
        { id: "detail-gal-impeccabyte-3", placeholder: "components" },
      ],
    },
  },
];

export function projectIndex(slug: string): number {
  return PROJECTS.findIndex((p) => p.slug === slug);
}
