<div align="center">

# ry.bealey

**A modern, dark-themed developer portfolio built with Next.js 16 and Supabase.**

[![Next.js](https://img.shields.io/badge/Next.js-16.1-000000?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3FCF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![License](https://img.shields.io/badge/License-MIT-22D3EE?style=flat-square)](#license)

</div>

---

## Overview

A single-page portfolio site with a CMS-driven backend. Content — profile info, work history, skills, projects, and social links — is managed entirely through Supabase, so the site stays up to date without redeploying. Visitors can reach out via a contact form powered by Resend.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router, Server Components) |
| **Language** | [TypeScript 5](https://typescriptlang.org) (strict mode) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) + CSS variables |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com) (New York style) + [Radix UI](https://radix-ui.com) |
| **Icons** | [Lucide](https://lucide.dev) |
| **Database** | [Supabase](https://supabase.com) (Postgres + Row Level Security) |
| **Email** | [Resend](https://resend.com) |
| **Fonts** | Inter (sans) &middot; JetBrains Mono (mono) |

## Features

- **Dark theme** with cyan (`#22D3EE`) accent and custom design tokens
- **CMS-driven content** — profile, experience, skills, projects, and social links pulled from Supabase
- **Contact form** with server action validation and a branded HTML email template
- **Responsive** — mobile sheet navigation, adaptive layouts across breakpoints
- **Micro-interactions** — typewriter hero text, count-up statistics, pulsing status indicator
- **Sticky header** with frosted glass backdrop blur
- **RLS-secured** public read-only database access

## Project Structure

```
├── app/
│   ├── actions/          # Server actions (contact form)
│   ├── globals.css       # Tailwind v4 theme & design tokens
│   ├── layout.tsx        # Root layout with font loading
│   └── page.tsx          # Main portfolio page (async Server Component)
├── components/
│   ├── ui/               # shadcn/ui primitives (Button, Card, Dialog, Sheet…)
│   ├── contact-modal.tsx # Contact form dialog
│   ├── count-up.tsx      # Animated counter
│   ├── mobile-nav.tsx    # Mobile navigation sheet
│   └── typewriter.tsx    # Typewriter text effect
├── lib/
│   ├── email/            # HTML email template
│   ├── supabase/         # Supabase client & Database types
│   └── utils.ts          # Utility helpers
├── public/               # Static assets (images, CV)
└── supabase/
    └── migrations/       # SQL migrations for all tables
```

## Getting Started

### Prerequisites

- **Node.js** 18+
- A [Supabase](https://supabase.com) project
- A [Resend](https://resend.com) API key

### Installation

```bash
# Clone the repo
git clone https://github.com/rybealey/portfolio.git
cd portfolio

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
```

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Resend
RESEND_API_KEY=your-resend-api-key
```

### Database Setup

Run the migrations in order against your Supabase project (via the SQL editor or CLI):

```
supabase/migrations/00002_replace_profile_table.sql
supabase/migrations/00003_create_work_history.sql
supabase/migrations/00004_replace_skills_tables.sql
supabase/migrations/00005_seed_work_history.sql
supabase/migrations/00006_create_socials.sql
supabase/migrations/00007_create_projects.sql
```

All tables use **Row Level Security** with public read-only access policies.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Production Build

```bash
npm run build
npm start
```

## Database Schema

| Table | Purpose |
|-------|---------|
| `profile` | Name, bio, availability status, stats (years exp, project count, clients) |
| `work_history` | Job title, employer, description, date range |
| `skills` | Skill name and category type |
| `projects` | Name, type, excerpt, slug, role, timeline, tools, team size |
| `socials` | Platform name and URL for footer links |

## Deployment

Deploy to [Vercel](https://vercel.com) for the best Next.js experience:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rybealey/portfolio)

Set the three environment variables in your Vercel project settings before deploying.

## License

MIT &copy; 2026 Ry Bealey
