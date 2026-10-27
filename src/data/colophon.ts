// Content for /colophon. Facts come from the README, package.json, the token
// files and git history; check them there before changing a claim here.

type Band = 'pink' | 'tangerine' | 'lime' | 'cyan' | 'violet';

export const repo = 'https://github.com/rybealey/portfolio';

export const stack: { label: string; band: Band; lead: string; body: string }[] = [
  { label: 'Framework', band: 'pink', lead: 'Astro 7', body: 'in server mode with the Node adapter, TypeScript strict throughout.' },
  {
    label: 'Runtime',
    band: 'tangerine',
    lead: 'Node 24',
    body: "run by Phusion Passenger on SERVERIZZ Grid, my company's cPanel hosting. A small startup file, app.cjs, loads the built server.",
  },
  {
    label: 'Data',
    band: 'lime',
    lead: 'MariaDB 10.11',
    body: 'through mysql2. Case studies, notes, link previews and images live there, and lists are cached for 30 seconds.',
  },
  { label: 'Markdown', band: 'cyan', lead: 'marked', body: 'renders each body on request, and Shiki colors code with CSS variables, so code blocks follow the theme.' },
  {
    label: 'Images',
    band: 'violet',
    lead: 'sharp',
    body: 'makes the About headshot in three WebP sizes, saves link preview images and re-encodes uploads. Stored images are named by their SHA-256 hash and cached for a year.',
  },
  { label: 'Share cards', band: 'pink', lead: 'satori', body: 'lays out the 1200 by 630 card for each note, and resvg turns it into a PNG on first request.' },
  { label: 'Styling', band: 'tangerine', lead: 'Plain CSS', body: 'in cascade layers, with every color, size and radius coming from generated tokens. No CSS framework.' },
  {
    label: 'Motion',
    band: 'lime',
    lead: 'View Transitions',
    body: 'across pages for page changes and the theme fade, with no JavaScript router. Reduced motion is respected everywhere.',
  },
];

export const steps = [
  {
    label: 'Plan',
    title: 'A written plan first',
    body: 'I wrote the implementation plan in the Claude app: the pages, the stack, the design register and the launch date. Everything after it worked from that plan.',
  },
  {
    label: 'Design',
    title: 'Designed before it was coded',
    body: 'The home page, About and Writing were each laid out on a Claude Design canvas in the Ryvanse system, in both themes, before any markup existed.',
  },
  {
    label: 'Build',
    title: 'Drafted by AI, reviewed by me',
    body: 'Claude Code drafted the pages, the database layer, the publishing API and the deploy script. I checked each change against the plan and sent it back until it matched.',
  },
  {
    label: 'Memory',
    title: 'Rules that carry over',
    body: 'My house rules live in an Obsidian vault the AI reads before each session and adds to after: US English, nothing touches production without me, and nothing is committed until I say so.',
  },
];

// Times are commit times in Central Time, from this repo and Publisher's.
export const buildLog: { day: string; time: string; what: string; goal?: boolean }[] = [
  { day: 'Oct 26', time: 'Day 0', what: 'Implementation plan written. Home page and first case study designed on a canvas.' },
  { day: 'Oct 27', time: '12:49 AM', what: 'Home page, bento grid and deploy setup' },
  { day: 'Oct 27', time: '1:56 AM', what: 'About page and page transitions' },
  { day: 'Oct 27', time: '2:26 AM', what: 'Writing, the microblog, and the positioning opened to any industry' },
  { day: 'Oct 27', time: '2:43 AM', what: 'Case studies and notes move into MariaDB, read live' },
  { day: 'Oct 27', time: '3:11 AM', what: "Deploys from cPanel's Git copy of the repository" },
  { day: 'Oct 27', time: '4:32 AM', what: 'Publishing API for the companion apps' },
  { day: 'Oct 27', time: '4:59 AM', what: 'Publisher for macOS, first commit' },
  { day: 'Nov 9', time: 'Launch', what: 'MVP launch', goal: true },
];

export const swatches: { band: Band; name: string; hex: string; role: string }[] = [
  { band: 'pink', name: 'Pink', hex: '#ff3d9a', role: 'Primary action' },
  { band: 'tangerine', name: 'Tangerine', hex: '#ff8f2e', role: 'Warnings' },
  { band: 'lime', name: 'Lime', hex: '#c8ff3c', role: 'HUD and billing' },
  { band: 'cyan', name: 'Cyan', hex: '#33e3e8', role: 'Links and web' },
  { band: 'violet', name: 'Violet', hex: '#a77bff', role: 'Support and AI' },
];

export const typefaces: { role: string; name: string; face: 'display' | 'body' | 'mono'; body: string; copyright: string }[] = [
  {
    role: 'Display',
    name: 'Unbounded',
    face: 'display',
    body: 'Headlines and my name on the home page. Bold and Black.',
    copyright: '© 2022 The Unbounded Project Authors',
  },
  {
    role: 'Text',
    name: 'Atkinson Hyperlegible',
    face: 'body',
    body: 'Everything you read. Drawn by the Braille Institute so letters stay distinct at small sizes. Regular, Italic and Bold.',
    copyright: '© 2020 Braille Institute of America',
  },
  {
    role: 'HUD and code',
    name: 'JetBrains Mono',
    face: 'mono',
    body: 'Labels, readouts and code blocks. Medium and Bold.',
    copyright: '© 2020 The JetBrains Mono Project Authors',
  },
];

export const lanes: { label: string; time: string; steps: string[]; outcome: { chip: string; body: string } }[] = [
  {
    label: 'Code · Deploy',
    time: 'A few minutes',
    steps: [
      'I push to GitHub.',
      "cPanel's Git Version Control pulls the change and runs the deploy script.",
      'The script installs with Node 24 and builds a copy of the site in a staging folder.',
      'It swaps the new build in and restarts Passenger.',
    ],
    outcome: { chip: 'Safe', body: 'A failed build stops before the swap, so the live site stays as it was.' },
  },
  {
    label: 'Words · Publish',
    time: 'Under 30 seconds',
    steps: [
      'I write a note or case study in Publisher on my Mac.',
      "Publisher sends it to the site's API with that device's own token.",
      'The API checks every field, saves to MariaDB, and unfurls any link.',
      'The next visitor sees it. The content cache only lasts 30 seconds.',
    ],
    outcome: { chip: 'No deploy', body: 'Nothing in the repository changes when I post.' },
  },
];

export const publisher: { band: Band; body: string }[] = [
  {
    band: 'pink',
    body: 'Each device has its own token, kept in the Keychain. The server stores only a hash, and one device can be cut off without touching the others.',
  },
  {
    band: 'lime',
    body: 'Every edit carries a version. If my other device changed the same note first, nothing is overwritten, and Publisher asks whether to apply my changes or reload.',
  },
  { band: 'cyan', body: 'Photos are re-encoded on upload, which strips location data.' },
  { band: 'violet', body: "Its icon is the site's spectrum chevron, one layer per band." },
];

export const credits: { label: string; band: Band; items: { name: string; note?: string }[] }[] = [
  {
    label: 'Typefaces',
    band: 'pink',
    items: [
      { name: 'Unbounded', note: 'by the Unbounded Project Authors' },
      { name: 'Atkinson Hyperlegible', note: 'by the Braille Institute' },
      { name: 'JetBrains Mono', note: 'by JetBrains' },
      { name: 'Fontsource', note: 'for the packages' },
    ],
  },
  {
    label: 'Open source',
    band: 'tangerine',
    items: [{ name: 'Astro, Node.js and MariaDB' }, { name: 'Shiki, marked and mysql2' }, { name: 'satori, resvg and sharp' }],
  },
  {
    label: 'Hosting',
    band: 'lime',
    items: [{ name: 'SERVERIZZ Grid', note: 'my company' }, { name: 'cPanel and WHM' }, { name: 'Phusion Passenger' }, { name: 'CloudLinux' }],
  },
  {
    label: 'Built with',
    band: 'cyan',
    items: [
      { name: 'Claude Code', note: 'for drafting code' },
      { name: 'Claude Design', note: 'for the page canvases' },
      { name: 'Obsidian', note: 'for the notes vault' },
      { name: 'Ryvanse', note: 'my own design system' },
    ],
  },
];
