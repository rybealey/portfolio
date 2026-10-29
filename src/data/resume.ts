// Content for /resume. The source is docs/resume.md; edit that first, then
// mirror it here. The public page leaves the phone number off.

type Band = 'pink' | 'tangerine' | 'lime' | 'cyan' | 'violet';

/** When docs/resume.md last changed. Shown on the page. */
export const updated = new Date('2026-10-27T12:00:00-05:00');

/** Rendered from this page's print view by `npm run resume:pdf`. */
export const pdf = '/ry-bealey-resume.pdf';

export const lanes: { label: string; band: Band }[] = [
  { label: 'AI Systems & Implementation', band: 'pink' },
  { label: 'Product and Systems Design', band: 'lime' },
  { label: 'Support Operations', band: 'violet' },
];

export const summary =
  "Builder and operator who turns web, infrastructure and payments problems into specs, data models and working software, with AI as the build partner. Nearly twelve years running SERVERIZZ, an Austin hosting company, now leading its rebuild: a self-service customer portal, usage-based billing, a shared hosting line and an AI support agent, all shipping in phases since October 2026. Eight years on Apple's front line in technical support, knowledge management and sales bring a clear sense of what the person on the other end of a system actually needs.";

export const glance = [
  { label: 'Now', value: 'Product and Operations Lead, SERVERIZZ' },
  { label: 'Also', value: 'Sales Chat Specialist, Apple' },
  { label: 'Open to', value: 'AI systems, implementation and web roles, in any industry' },
];

interface Link {
  label: string;
  href: string;
}

/** Bullets may mark code with backticks, as in the Markdown. */
interface Group {
  label: string;
  band: Band;
  link?: Link;
  bullets: string[];
}

interface Role {
  title: string;
  team: string;
  dates: string;
  now?: boolean;
  bullets: string[];
}

interface Job {
  title: string;
  org: string;
  /** Shown after the org, muted. */
  detail: string;
  dates: string;
  now?: boolean;
  description?: string;
  groups?: Group[];
  roles?: Role[];
  bullets?: string[];
}

export const experience: Job[] = [
  {
    title: 'Product and Operations Lead',
    org: 'SERVERIZZ',
    detail: 'Formerly Ecobyte Web Services · Austin, TX',
    dates: 'Dec 2014 – Present',
    now: true,
    description: 'Hosting, cloud and bare-metal infrastructure for small and mid-sized businesses without in-house IT.',
    groups: [
      {
        label: 'Portal and billing',
        band: 'lime',
        link: { label: 'Billing case study', href: '/work/serverizz-billing' },
        bullets: [
          'Shipped a self-service customer portal (Laravel 12, Inertia, Vue, PostgreSQL) in October 2026 where customers deploy and manage their own Vultr servers, backups, snapshots, private networks, load balancers and firewalls, with a staff admin console and pull-based deploys from `main`.',
          'Leading the replacement of a legacy billing system (ClientExec) with usage-based billing: hourly metering, prepaid balances, auto top-up and self-service deployment, on a 12-month, five-phase roadmap.',
          "Designed a 42-table PostgreSQL data model for the first release around an append-only ledger, rerun-safe hourly billing, plugin-based payment, provisioning and tax integrations, and cost reconciliation that flags servers we pay for but don't bill.",
          'Specified payment flows that keep card data off our servers (Authorize.Net Accept.js, PayPal) and apply Texas sales tax to every charge.',
        ],
      },
      {
        label: 'Support AI',
        band: 'violet',
        link: { label: 'Fin case study', href: '/work/fin-support-ops' },
        bullets: [
          'Launched an AI support agent (Intercom Fin) with eight guidance rules, escalation and routing for Support, Sales and Billing inboxes, a help center synced to the website, and response targets of one and four business hours.',
        ],
      },
      {
        label: 'Web and brand',
        band: 'cyan',
        link: { label: 'Website case study', href: '/work/serverizz-web' },
        bullets: [
          "Directed the website and brand rebuild: a 35-page Drupal information architecture, a design system with 29 components, 44 email templates and WCAG AA themes, and analytics through Google Tag Manager, GA4 and Meta's Conversions API. Rebuilt the product line from market and vendor research into eight plans across three tiers, six add-ons and remote IT support.",
          'Design and build WordPress sites for clients, including a rebuild for URChoices, a Florida continuing education provider, on its own design system.',
        ],
      },
      {
        label: 'Hosting',
        band: 'tangerine',
        bullets: [
          'Launched Grid Hosting, a shared hosting line on CloudLinux and cPanel/WHM bare metal built from an idempotent provisioning script; migrated 13 customer accounts, audited each, and found and contained malware two of them brought from the previous host.',
          'Run hosting for around 15 clients across the United States, including healthcare, education and legal: a shared hosting environment, two DNS servers clustered through cPanel/WHM, and single-purpose virtual machines secured on a private VPC, with on-call incident response.',
        ],
      },
    ],
  },
  {
    title: 'Apple',
    org: 'Five roles',
    detail: 'Austin, TX',
    dates: 'Jul 2018 – Present',
    now: true,
    roles: [
      {
        title: 'Sales Chat Specialist',
        team: 'Retail Customer Care',
        dates: 'Mar 2022 – Present',
        now: true,
        bullets: [
          'Guide customers through purchase decisions over chat, driving close rates and AppleCare+ attach on flagship products.',
          "Train new specialists through shadowing, and lead testing of the team's contact center tools with structured feedback to the developers.",
          "Started the team's intranet space for tool updates, campus news and performance incentives.",
        ],
      },
      {
        title: 'Apple Support Community Moderator',
        team: 'Six-month career rotation',
        dates: 'Aug 2023 – Feb 2024',
        bullets: [
          'Reviewed posts against the Terms of Use, resolved conflicts, and partnered with Community Managers to grow healthy participation.',
        ],
      },
      {
        title: 'Product Zone Specialist',
        team: 'Apple Domain Northside',
        dates: 'Sep 2021 – Mar 2022',
        bullets: ['Delivered technical and product support on a high-traffic retail floor.'],
      },
      {
        title: 'Knowledge Management Specialist',
        team: 'AppleCare BPR',
        dates: 'Mar 2021 – Sep 2021',
        bullets: [
          'Rewrote and migrated 300+ knowledge base pages to a new global platform, improving readability and accessibility, and beta tested it with feedback to the product owners ahead of global rollout.',
          'Built process flows that helped AppleCare employees and partners worldwide understand SAP operations.',
        ],
      },
      {
        title: 'Technical Support Advisor',
        team: 'AppleCare',
        dates: 'Jul 2018 – Sep 2021',
        bullets: ['Troubleshot iOS, iPadOS, watchOS and macOS issues in a high-volume contact center and recommended hardware service.'],
      },
    ],
  },
  {
    title: 'Project Manager',
    org: 'University of Central Florida',
    detail: 'Center for Entrepreneurial Leadership · Orlando, FL',
    dates: 'Aug 2016 – Nov 2017',
    bullets: ['Led a team of four designers producing digital and print work, and kept leadership informed on milestones and roadblocks.'],
  },
];

export const projects: { name: string; label: string; tagline: string; band: Band; link?: Link; bullets: string[] }[] = [
  {
    name: 'ryanbealey.com and Publisher',
    label: 'Portfolio and app',
    tagline: 'Portfolio site and its companion macOS app',
    band: 'pink',
    link: { label: 'How this site is built', href: '/colophon' },
    bullets: [
      'Built a server-rendered Astro site on Node and Passenger that reads case studies and a microblog from MariaDB live, with link previews, generated share cards and a design token pipeline from the Ryvanse design system.',
      'Designed a publishing API with per-device hashed tokens, version-checked edits that stop one device overwriting another, and image uploads stripped of location data; built Publisher, a native SwiftUI macOS app, on top of it.',
    ],
  },
  {
    name: 'PixelRP',
    label: 'Game design · passion project',
    tagline: 'Browser-based city roleplay game (passion project)',
    band: 'cyan',
    bullets: [
      'Designed a token-based design system and 15+ game features for a Habbo-style roleplay city: an in-game phone OS with social, banking and app store apps, trading, police dispatch, turf control and staff admin tools.',
      'Wrote implementation-ready specs that pull values from the production source and cover every UI state, plus economy rules such as savings limits, transfer caps and all-or-nothing trades.',
      'Designed a fair round-robin support routing model so every player request reaches a staff member quickly.',
    ],
  },
  {
    name: 'Ryvanse',
    label: 'Brand',
    tagline: 'Gaming and streaming brand',
    band: 'violet',
    link: { label: 'More on About', href: '/about' },
    bullets: [
      'Built the brand identity and an animated broadcast package for landscape and vertical formats, with documented contrast ratios for every color.',
    ],
  },
  {
    name: 'Impeccabyte, LLC',
    label: 'Payments · Founder',
    tagline: 'Founder',
    band: 'tangerine',
    link: { label: 'More on About', href: '/about' },
    bullets: [
      'Founded a merchant services agency as an authorized Maverick Payments sales agent, with processing on TSYS and Fiserv/Clover. Set up merchant pre-screening and referrals, and use the business to learn payments technology hands-on.',
    ],
  },
];

export const skills: { label: string; band: Band; items: string }[] = [
  {
    label: 'AI implementation',
    band: 'pink',
    items: 'Spec-driven development with Claude Code, AI-assisted prototyping, Intercom Fin setup (guidance, escalation, routing workflows, knowledge sync)',
  },
  {
    label: 'Payments',
    band: 'tangerine',
    items: 'Ledger and billing design, Authorize.Net, PayPal, Stripe, Maverick Payments (TSYS, Fiserv/Clover), PCI-conscious checkout flows, sales tax',
  },
  {
    label: 'Systems design',
    band: 'lime',
    items: 'Data modeling, migration planning, plugin architectures, API design, API integrations (Vultr, Authorize.Net, Intercom)',
  },
  {
    label: 'Product and design',
    band: 'cyan',
    items:
      'Information architecture, design systems and tokens, UX for web, mobile, desktop and game clients, WCAG AA accessibility, pricing and packaging',
  },
  {
    label: 'Technology',
    band: 'violet',
    items:
      'Laravel, PHP, Vue, React, Astro, TypeScript, Swift and SwiftUI, Tailwind CSS, Drupal, WordPress, PostgreSQL, MySQL and MariaDB, Redis, Docker, Terraform, Cloudflare, Linux, CloudLinux, cPanel/WHM, Git',
  },
  { label: 'Growth and analytics', band: 'pink', items: 'Google Tag Manager, GA4, Meta Conversions API, Search Atlas' },
  {
    label: 'Support operations',
    band: 'tangerine',
    items: 'Knowledge management, help center architecture, SLAs and escalation design, agent training',
  },
];

export const education = [
  { credential: 'B.A. Digital Media', detail: 'Web Design specialization', school: 'University of Central Florida', year: 2019 },
  { credential: 'Coding Bootcamp Certificate', school: 'University of Central Florida', year: 2019 },
];

/**
 * The one-page cut that /resume/print lays out for the PDF. The source is
 * docs/resume-one-page.md; edit that first, then mirror it here. The PDF is
 * public, so it leaves the phone number off like the page. It must stay one
 * page and readable by applicant tracking systems: trim here when it
 * overflows rather than going below 9.5pt type, and keep every job's title,
 * employer and dates on one line.
 */
export const onePage = {
  summary:
    "I turn web, infrastructure and payments problems into specs, data models and working software, with AI as the build partner. Nearly twelve years running SERVERIZZ, now leading its rebuild; eight years on Apple's front line.",
  experience: [
    {
      title: 'Product and Operations Lead',
      org: 'SERVERIZZ',
      location: 'Austin, TX',
      dates: 'Dec 2014 – Present',
      bullets: [
        'Shipped a self-service customer portal (Laravel, Vue, PostgreSQL) where customers deploy and manage their own Vultr servers, networks, load balancers and firewalls, with a staff admin console.',
        'Leading the move from ClientExec to usage-based billing: a 42-table data model around an append-only ledger, rerun-safe hourly metering, prepaid balances and card data kept off our servers.',
        'Launched an AI support agent (Intercom Fin) with guidance, escalation and routing rules, and response targets of one and four business hours.',
        'Launched Grid Hosting on CloudLinux and cPanel/WHM; migrated and audited 13 accounts and contained malware two of them brought from the previous host.',
        'Directed the website rebuild: a 35-page Drupal information architecture, a 29-component design system with WCAG AA themes, and GTM and GA4 analytics.',
        'Host around 15 clients across the United States on shared hosting, clustered DNS and VPC-secured virtual machines, and build WordPress sites for clients such as URChoices.',
      ],
    },
    {
      org: 'Apple',
      location: 'Austin, TX',
      dates: 'Jul 2018 – Present',
      roles: [
        {
          title: 'Sales Chat Specialist, Retail Customer Care',
          dates: 'Mar 2022 – Present',
          bullet: "Guide purchase decisions over chat, train new specialists, and lead testing of the team's contact center tools with feedback to developers.",
        },
        {
          title: 'Apple Support Community Moderator, six-month rotation',
          dates: 'Aug 2023 – Feb 2024',
          bullet: 'Moderated community content and resolved conflicts.',
        },
        { title: 'Product Zone Specialist, Apple Domain Northside', dates: 'Sep 2021 – Mar 2022' },
        {
          title: 'Knowledge Management Specialist, AppleCare BPR',
          dates: 'Mar 2021 – Sep 2021',
          bullet: 'Rewrote and migrated 300+ knowledge base pages to a new global platform and beta tested it before rollout.',
        },
        { title: 'Technical Support Advisor, AppleCare', dates: 'Jul 2018 – Sep 2021' },
      ],
    },
    {
      title: 'Project Manager',
      org: 'UCF Center for Entrepreneurial Leadership',
      location: 'Orlando, FL',
      dates: 'Aug 2016 – Nov 2017',
      bullets: ['Led a team of four designers producing digital and print work.'],
    },
  ] as { title?: string; org: string; location: string; dates: string; bullets?: string[]; roles?: { title: string; dates: string; bullet?: string }[] }[],
  projects: [
    {
      name: 'ryanbealey.com and Publisher',
      text: 'A server-rendered Astro site reading MariaDB live, with a token-authenticated publishing API and a native SwiftUI macOS app that posts to it.',
    },
    { name: 'PixelRP', text: 'A design system, 15+ game features and implementation-ready specs for a browser-based roleplay game.' },
    { name: 'Impeccabyte, LLC', text: 'A merchant services agency on Maverick Payments, with TSYS and Fiserv/Clover processing.' },
    { name: 'Ryvanse', text: 'Brand identity and an animated broadcast package for a gaming and streaming brand.' },
  ],
  skills: [
    { label: 'AI implementation', items: 'Spec-driven development with Claude Code, Intercom Fin setup and routing' },
    {
      label: 'Payments and systems',
      items: 'Ledger and billing design, Authorize.Net, PayPal, Stripe, data modeling, API design and integrations',
    },
    { label: 'Product and design', items: 'Information architecture, design systems and tokens, WCAG AA accessibility, pricing' },
    {
      label: 'Technology',
      items:
        'Laravel, PHP, Vue, React, Astro, TypeScript, Swift, Drupal, WordPress, PostgreSQL, MySQL, Redis, Docker, Linux, cPanel/WHM, Cloudflare, GTM and GA4',
    },
  ],
  education: [
    { credential: 'B.A. Digital Media, Web Design specialization', school: 'University of Central Florida', year: 2019 },
    { credential: 'Coding Bootcamp Certificate', school: 'University of Central Florida', year: 2019 },
  ],
};
