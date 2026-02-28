<div align="center">

# ry.bealey

**A modern, dark-themed developer portfolio with a full admin CMS — built with Next.js 16 and Supabase.**

[![Next.js](https://img.shields.io/badge/Next.js-16.1-000000?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3FCF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![License](https://img.shields.io/badge/License-MIT-22D3EE?style=flat-square)](#license)

</div>

---

## Overview

A single-page portfolio site paired with a full-featured admin dashboard. Content — profile, work history, skills, projects, and social links — is managed through a built-in CMS backed by Supabase, so the site stays current without redeploying. Visitors can reach out via a contact form powered by Resend.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router, Server Components) |
| **Language** | [TypeScript 5](https://typescriptlang.org) (strict mode) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) + CSS variables |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://radix-ui.com) |
| **Rich Text** | [Tiptap](https://tiptap.dev) WYSIWYG editor |
| **Icons** | [Lucide](https://lucide.dev) |
| **Database** | [Supabase](https://supabase.com) (Postgres + Row Level Security) |
| **Auth** | Supabase Auth (magic link) |
| **Storage** | Supabase Storage (project media, WebP conversion) |
| **Email** | [Resend](https://resend.com) |
| **Fonts** | Inter (sans) &middot; JetBrains Mono (mono) |

## Features

### Public Portfolio
- **Dark theme** with cyan (`#22D3EE`) accent and custom design tokens
- **CMS-driven content** — profile, work history, skills, projects, and social links from Supabase
- **Contact form** with server action validation and branded HTML email template
- **Responsive** — mobile sheet navigation, adaptive layouts across breakpoints
- **Micro-interactions** — typewriter hero text, count-up statistics, pulsing status badge
- **Sticky header** with frosted glass backdrop blur
- **Project detail pages** with cover images, gallery, and external website links
- **Two-column experience section** — skills sidebar + work history timeline

### Admin Dashboard (`/admin`)
- **Magic link authentication** — passwordless login via Supabase Auth
- **Single-user registration** — registration closes after one account is created
- **Projects CRUD** — create, edit, publish/unpublish, delete projects with rich text descriptions
- **Media management** — cover image and gallery uploads with automatic WebP conversion
- **Work History CRUD** — manage employment entries with date ranges and current-role toggle
- **Skills management** — add/delete skills grouped by category with modal form
- **Settings** — edit profile (name, avatar placeholder, bio via WYSIWYG editor), availability toggle, portfolio stats
- **Analytics** — deployment stats pulled from Vercel API
- **Sidebar navigation** with active state highlighting and user display name

## Project Structure

```
├── app/
│   ├── actions/              # Server actions (auth, contact, projects, skills, work history, profile)
│   ├── admin/
│   │   ├── (protected)/      # Authenticated admin routes
│   │   │   ├── dashboard/    # Admin dashboard
│   │   │   ├── analytics/    # Vercel deployment analytics
│   │   │   ├── projects/     # Projects CRUD (list, new, [id]/edit)
│   │   │   ├── work-history/ # Work history CRUD (list, new, [id]/edit)
│   │   │   ├── skills/       # Skills management
│   │   │   └── settings/     # Profile & portfolio settings
│   │   ├── page.tsx          # Login page
│   │   └── register/         # Registration page
│   ├── projects/[slug]/      # Public project detail page
│   ├── globals.css           # Tailwind v4 theme & design tokens
│   ├── layout.tsx            # Root layout with font loading
│   └── page.tsx              # Main portfolio page
├── components/
│   ├── admin/                # Admin components (sidebar, forms, modals, rich text editor)
│   ├── ui/                   # shadcn/ui primitives (Button, Card, Dialog, Sheet, Switch…)
│   ├── contactModal.tsx      # Contact form dialog
│   ├── countUp.tsx           # Animated counter
│   ├── mobileNav.tsx         # Mobile navigation sheet
│   └── typewriter.tsx        # Typewriter text effect
├── lib/
│   ├── auth/                 # Auth proxy (requireAuth helper)
│   ├── email/                # HTML email template
│   ├── supabase/             # Supabase client, types, storage helpers
│   ├── vercel/               # Vercel API client
│   └── utils.ts              # Utility helpers
├── public/                   # Static assets
└── supabase/
    └── migrations/           # Single consolidated SQL migration
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

Run the single migration against your Supabase project (via the SQL editor or CLI):

```
supabase/migrations/00001_full_schema.sql
```

This creates all tables, indexes, RLS policies, and the storage bucket in one go.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.
Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the admin dashboard.

### Production Build

```bash
npm run build
npm start
```

## Database Schema

| Table | Purpose |
|-------|---------|
| `profile` | Name, bio, availability status, portfolio stats (years exp, projects, clients) |
| `skills` | Skill name and category type (Design, Development, Tools, etc.) |
| `projects` | Name, type, excerpt, description, slug, status, media, website, metadata |
| `work_history` | Job title, employer, description, date range |
| `socials` | Platform name and URL for footer links |

All tables use **Row Level Security**: public read access, authenticated write access.

## Deployment

Deploy to [Vercel](https://vercel.com) for the best Next.js experience:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rybealey/portfolio)

Set the environment variables in your Vercel project settings before deploying.

## License

MIT &copy; 2026 Ry Bealey
