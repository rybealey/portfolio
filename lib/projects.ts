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
    kicker: "agency",
    cats: ["infrastructure", "engineering"],
    tags: ["Hosting", "WordPress", "Agency"],
    excerpt:
      "A full-service web-hosting and digital agency built from the ground up: cPanel/WHM and CloudLinux infrastructure, a custom WordPress delivery pipeline, and AI-assisted content and support.",
    detail: {
      kicker: "web hosting · agency",
      role: "Founder & Lead Engineer",
      year: "2014 — Present",
      liveUrl: "https://serverizz.com",
      repoUrl: null,
      summary:
        "A full-service web-hosting company and digital agency I founded at sixteen and scaled from a single reseller plan into managed infrastructure, custom WordPress builds, and AI-assisted operations.",
      overview: [
        "SERVERIZZ began as a teenage side project reselling shared hosting and grew into a managed-hosting provider and digital agency. The brief I set myself: make professional hosting and a polished web presence accessible to small businesses without the enterprise price tag.",
        "Today it runs production WordPress sites on tuned cPanel/WHM infrastructure, pairs that with custom design and build work, and leans on AI to keep content and support fast and consistent.",
      ],
      contributions: [
        {
          title: "Hosting infrastructure",
          body: "Architected and operate cPanel/WHM on CloudLinux with LiteSpeed, tuned for WordPress performance, isolation, and uptime.",
        },
        {
          title: "WordPress delivery pipeline",
          body: "Built a repeatable theme-and-plugin pipeline for fast, maintainable client site launches and handoffs.",
        },
        {
          title: "AI-assisted operations",
          body: "Introduced AI into content drafting and first-line support, cutting turnaround while keeping a human in the loop.",
        },
        {
          title: "Brand & client work",
          body: "Led design, build, and ongoing maintenance across a roster of small-business clients.",
        },
      ],
      features: [
        "Managed cPanel/WHM hosting",
        "CloudLinux resource isolation",
        "LiteSpeed + caching tuned for WP",
        "Custom WordPress builds",
        "AI content & support automation",
        "Client billing & onboarding",
      ],
      stack: [
        { group: "Infrastructure", items: ["cPanel/WHM", "CloudLinux", "LiteSpeed", "Cloudflare"] },
        { group: "Development", items: ["WordPress", "PHP", "Node.js"] },
        { group: "Operations", items: ["WHMCS", "AI Automation"] },
      ],
      timeline: [
        { phase: "2014", title: "Founded", body: "Started reselling shared hosting as a teenager." },
        { phase: "2017", title: "Managed hosting", body: "Moved to owned cPanel/WHM infrastructure on CloudLinux." },
        { phase: "2021", title: "Agency services", body: "Added design and custom WordPress build work for clients." },
        { phase: "2024", title: "AI operations", body: "Wired AI into content and support workflows." },
      ],
      outcomes: [
        { stat: "10+ yrs", label: "in continuous operation" },
        { stat: "99.9%", label: "hosting uptime" },
        { stat: "Dozens", label: "of client sites shipped" },
      ],
      gallery: [
        { id: "serverizz-1", placeholder: "hosting dashboard" },
        { id: "serverizz-2", placeholder: "client site" },
        { id: "serverizz-3", placeholder: "WHM panel" },
      ],
    },
  },
  {
    slug: "impeccabyte",
    title: "Impeccabyte",
    kicker: "saas",
    cats: ["product", "engineering"],
    tags: ["SaaS", "Next.js", "Formation"],
    excerpt:
      "A business-formation SaaS that walks founders through the entire LLC and corporation setup: naming, registered agent, EIN filing, and member management in one streamlined flow.",
    detail: {
      kicker: "business-formation saas",
      role: "Founder & Full-Stack Engineer",
      year: "2023",
      liveUrl: "https://impeccabyte.com",
      repoUrl: null,
      summary:
        "A business-formation SaaS that walks founders through standing up an LLC or corporation, from naming and registered agent to EIN and member management, in one streamlined flow.",
      overview: [
        "Forming a company is full of disconnected steps and jargon. Impeccabyte collapses that into a guided, single-session workflow so a founder can go from idea to filed entity without juggling portals.",
      ],
      contributions: [
        {
          title: "Guided formation flow",
          body: "Designed and built the end-to-end wizard covering naming through member management.",
        },
        {
          title: "Filing integrations",
          body: "Connected EIN and registered-agent steps into one coherent pipeline.",
        },
      ],
      features: [
        "Entity naming & availability",
        "Registered agent setup",
        "EIN filing",
        "Member management",
        "Document storage",
      ],
      stack: [
        { group: "Development", items: ["Next.js", "TypeScript", "Tailwind CSS"] },
        { group: "Backend", items: ["Node.js", "Supabase"] },
      ],
      timeline: [
        { phase: "01", title: "Discovery", body: "Mapped the full formation journey and its pain points." },
        { phase: "02", title: "Build", body: "Shipped the guided flow and filing integrations." },
        { phase: "03", title: "Launch", body: "Opened the product to early founders." },
      ],
      outcomes: [
        { stat: "1", label: "guided flow, end to end" },
        { stat: "<10 min", label: "idea to filed entity" },
      ],
      gallery: [
        { id: "impeccabyte-1", placeholder: "wizard step" },
        { id: "impeccabyte-2", placeholder: "dashboard" },
      ],
    },
  },
  {
    slug: "portfolio-cms",
    title: "Portfolio CMS",
    kicker: "web app",
    cats: ["engineering"],
    tags: ["Next.js", "Supabase", "CMS"],
    excerpt:
      "A full-stack portfolio platform with a purpose-built admin CMS: public site and admin unified in one Next.js app, backed by Supabase for auth, data, and storage.",
    detail: {
      kicker: "full-stack web app",
      role: "Designer & Engineer",
      year: "2025",
      liveUrl: null,
      repoUrl: "https://github.com/rybealey",
      summary:
        "A full-stack portfolio platform with a purpose-built admin CMS, where public site and admin live in one Next.js app, backed by Supabase for auth, data, and storage.",
      overview: [
        "I wanted a portfolio I could update like a product, not a static file. This unifies a public site and a custom admin CMS in one codebase so content, projects, and media stay editable without a deploy.",
      ],
      contributions: [
        {
          title: "Unified architecture",
          body: "Built public and admin surfaces in a single Next.js app sharing types and data.",
        },
        {
          title: "Content model & CMS",
          body: "Designed the schema and admin UI for projects, media, and copy.",
        },
      ],
      features: [
        "Custom admin CMS",
        "Auth & roles",
        "Media storage",
        "Live content editing",
        "Type-safe data layer",
      ],
      stack: [
        { group: "Development", items: ["Next.js", "TypeScript", "Tailwind CSS"] },
        { group: "Backend", items: ["Supabase", "PostgreSQL"] },
      ],
      timeline: [
        { phase: "01", title: "Schema", body: "Modeled projects, media, and content." },
        { phase: "02", title: "Admin", body: "Built the CMS surface and auth." },
        { phase: "03", title: "Public site", body: "Wired the public views to live data." },
      ],
      outcomes: [
        { stat: "1", label: "app, public + admin" },
        { stat: "0", label: "deploys to edit content" },
      ],
      gallery: [
        { id: "portfolio-cms-1", placeholder: "admin CMS" },
        { id: "portfolio-cms-2", placeholder: "public site" },
      ],
    },
  },
  {
    slug: "plasm",
    title: "Plasm",
    kicker: "design system",
    cats: ["design"],
    tags: ["Design System", "UI Kit"],
    excerpt:
      "A comprehensive design system and full-screen UI kit reimagining Agar.io, bridging game identity with a polished web app, authored with shadcn/ui handoff in mind.",
    detail: {
      kicker: "design system · ui kit",
      role: "Design Systems Lead",
      year: "2025",
      liveUrl: null,
      repoUrl: null,
      summary:
        "A comprehensive design system and full-screen UI kit reimagining Agar.io, bridging the game’s identity with a polished web app and authored with shadcn/ui handoff in mind.",
      overview: [
        "Plasm explores what a beloved browser game looks like as a real product. It pairs a complete design system, tokens, components, and patterns, with a full-screen UI kit that keeps the game’s identity while feeling like software you’d trust.",
      ],
      contributions: [
        {
          title: "Design tokens & system",
          body: "Authored color, type, spacing, and component foundations.",
        },
        {
          title: "Full-screen UI kit",
          body: "Designed the in-app surfaces and handoff-ready components.",
        },
      ],
      features: [
        "Token foundations",
        "Component library",
        "Full-screen UI kit",
        "shadcn/ui handoff",
        "Game-to-product identity",
      ],
      stack: [
        { group: "Design", items: ["Design Tokens", "Component Library"] },
        { group: "Handoff", items: ["shadcn/ui", "React"] },
      ],
      timeline: [
        { phase: "01", title: "Foundations", body: "Defined tokens and primitives." },
        { phase: "02", title: "Components", body: "Built the component and pattern library." },
        { phase: "03", title: "UI kit", body: "Assembled the full-screen kit." },
      ],
      outcomes: [
        { stat: "Full", label: "token + component system" },
        { stat: "1", label: "cohesive game-to-app identity" },
      ],
      gallery: [
        { id: "plasm-1", placeholder: "components" },
        { id: "plasm-2", placeholder: "UI kit screen" },
      ],
    },
  },
];

export function projectIndex(slug: string): number {
  return PROJECTS.findIndex((p) => p.slug === slug);
}
