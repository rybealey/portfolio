export const site = {
  name: 'Ry Bealey',
  url: 'https://ryanbealey.com',
  lane: 'AI systems and implementation',
  location: 'Austin, TX',
  timeZone: 'America/Chicago',
  coordinates: '30.27°N 97.74°W',
  description:
    'Ry Bealey turns billing, payments and support problems into specs, data models and working software, with AI as the build partner.',
  email: 'hello@ryanbealey.com',
  linkedin: 'https://www.linkedin.com/in/ryanbealey',
  // Set once known. Null hides the link rather than shipping a placeholder.
  github: null as string | null,
  resumePdf: null as string | null,
  spotifyProfile: 'https://open.spotify.com',
};

export const nav = [
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/about' },
  { label: 'Writing', href: '/writing' },
] as const;
