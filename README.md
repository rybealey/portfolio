# Portfolio Website

A modern, responsive portfolio website built with Next.js, Tailwind CSS, and Shadcn/ui.

## Features

- Full splash page with two-column layout (vertical split)
- Left column: Full-width image display
- Right column: Title with animated gradient and biography
- Responsive design that works on all devices
- Built with Next.js 14 (App Router)
- Styled with Tailwind CSS
- Shadcn/ui configured and ready to use

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/` - Next.js app directory with pages and layouts
- `components/` - Reusable React components (Shadcn/ui components can be added here)
- `lib/` - Utility functions
- `public/` - Static assets (images, etc.)

## Adding Your Image

Add your image to the `public/` directory as `placeholder-image.jpg` (or update the path in `app/page.tsx`). The image will automatically be displayed in the left column of the landing page.

Recommended image dimensions: 1200x1600px or similar portrait orientation for best results.

## Customization

- Update the title "Your Name" in `app/page.tsx`
- Modify the biography text in `app/page.tsx`
- Change gradient colors in the title by updating the `bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600` classes
- Modify colors and styling in `app/globals.css`
- Add Shadcn/ui components using: `npx shadcn-ui@latest add [component-name]`
- Add more sections to the landing page as needed
