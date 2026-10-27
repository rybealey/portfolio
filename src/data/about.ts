// Content for /about. Facts come from the résumé and the career notes; keep
// Apple entries to public role descriptions, no internal tool names.

export const glance = [
  { label: 'Now', value: 'Product and Operations Lead, SERVERIZZ', strong: true },
  { label: 'Also', value: 'Sales Chat Specialist, Apple' },
  { label: 'Looking for', value: 'AI systems and implementation roles in fintech' },
  { label: 'Studied', value: 'B.A. Digital Media, University of Central Florida' },
];

type Band = 'pink' | 'tangerine' | 'lime' | 'cyan' | 'violet';

export const toolkit: { label: string; band: Band; tools: string[] }[] = [
  { label: 'AI and support', band: 'pink', tools: ['Claude Code', 'Intercom Fin', 'Intercom Workflows', 'Intercom Help Center'] },
  { label: 'Payments', band: 'tangerine', tools: ['Authorize.Net', 'PayPal', 'Stripe', 'Maverick Payments', 'TSYS', 'Fiserv / Clover'] },
  { label: 'Data', band: 'lime', tools: ['PostgreSQL', 'Redis', 'MySQL'] },
  {
    label: 'Build and growth',
    band: 'cyan',
    tools: ['Laravel', 'Vue', 'Tailwind CSS', 'React', 'Drupal', 'WordPress', 'Astro', 'TypeScript', 'GTM and GA4', 'Search Atlas'],
  },
  { label: 'Infrastructure', band: 'violet', tools: ['Vultr API', 'cPanel / WHM', 'Linux', 'Cloudflare', 'Terraform', 'Git'] },
];

export const timeline: { year: number; title: string; body: string; now?: boolean; serverizz?: boolean; caseStudies?: boolean }[] = [
  {
    year: 2026,
    title: 'Rebuilding SERVERIZZ from the ledger up',
    body: 'Usage billing with an append-only ledger, a new website and design system, and an AI support agent that went live on Oct 19.',
    now: true,
    serverizz: true,
    caseStudies: true,
  },
  {
    year: 2023,
    title: 'Apple Support Community Moderator',
    body: 'A six-month career rotation reviewing posts against the terms of use, settling disputes, and helping the forum stay useful for the people who need answers.',
  },
  {
    year: 2022,
    title: 'Sales Chat Specialist, Apple Retail Customer Care',
    body: 'Guiding purchase decisions over chat, training new specialists, and leading testing of the tools the team works in, with structured feedback to the developers.',
    now: true,
  },
  {
    year: 2021,
    title: 'Knowledge Management at AppleCare BPR, then the retail floor',
    body: 'I rewrote and migrated more than 300 knowledge base pages to a new global platform and beta tested it before rollout. Then six months as a Product Zone Specialist at Apple Domain Northside.',
  },
  {
    year: 2019,
    title: 'B.A. in Digital Media, University of Central Florida',
    body: "Web design specialization, plus UCF's coding bootcamp certificate the same year.",
  },
  {
    year: 2018,
    title: 'Technical Support Advisor, AppleCare',
    body: 'Three years troubleshooting iPhone, iPad, Apple Watch and Mac in a high-volume contact center. This is where I learned what a stressed customer needs from a system.',
  },
  {
    year: 2016,
    title: 'Project Manager, UCF Center for Entrepreneurial Leadership',
    body: 'Led a team of four designers on digital and print work, and kept leadership current on milestones and roadblocks.',
  },
  {
    year: 2014,
    title: 'Started Ecobyte Web Services, now SERVERIZZ',
    body: 'Hosting, cloud and bare-metal servers for small and mid-sized businesses without in-house IT, including healthcare, education and legal clients, with on-call incident response.',
    serverizz: true,
  },
];

export const principles = [
  {
    title: 'Spec first',
    body: 'I write the plan down before anything gets built: the problem, the data, the edge cases, and what I chose not to do. Everyone works from it, the AI included.',
  },
  {
    title: 'Money gets a ledger',
    body: 'Anything that touches a balance is append-only and safe to rerun. A correction is a new entry, never an edit, so the history always adds up.',
  },
  {
    title: 'AI drafts, I decide',
    body: 'Claude Code writes a lot of first drafts. I review every change against the spec, and the spec is what catches it when the draft gets something wrong.',
  },
  {
    title: 'Ship in phases',
    body: 'Billing and the new website are live and rolling out in stages. Small, reversible steps beat one big launch day when real customers are on the other end.',
  },
];

export const ventures = [
  {
    label: 'Payments',
    name: 'Impeccabyte',
    body: "A merchant services agency I founded. As an authorized Maverick Payments sales agent, I set up merchant pre-screening and referrals on TSYS and Fiserv/Clover processing. It's how I learn payments from the side of the business taking the card.",
  },
  {
    label: 'Design',
    name: 'Ryvanse',
    body: 'My gaming and streaming brand. I built its identity and an animated broadcast package, with contrast ratios documented for every color. The look of this site started there.',
  },
];

export const causes: { title: string; body: string; band: Band }[] = [
  {
    title: 'Education and young builders',
    body: 'The next generation of builders deserves real problems to work on, patient answers, and room to try things.',
    band: 'pink',
  },
  {
    title: 'Local and small business',
    body: 'Most of my customers are small businesses. They deserve tools, service and care as good as the big companies get.',
    band: 'tangerine',
  },
  { title: 'Privacy and digital rights', body: 'Your data should belong to you. Collect less, explain what you keep, and make leaving easy.', band: 'lime' },
  { title: 'The environment', body: 'Waste less, in servers and everywhere else. Small choices add up when you make them every day.', band: 'cyan' },
];
