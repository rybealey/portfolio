import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import { MobileNav } from "@/components/mobileNav";
import { ContactModal } from "@/components/contactModal";
import { ProjectGallery } from "@/components/projectGallery";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select()
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!project) {
    notFound();
  }

  const { data: socials } = await supabase
    .from("socials")
    .select()
    .order("sort_order");

  // Get the next project for the "Next Project" CTA
  const { data: nextProject } = await supabase
    .from("projects")
    .select("name, slug, excerpt")
    .eq("status", "published")
    .gt("sort_order", project.sort_order)
    .order("sort_order", { ascending: true })
    .limit(1)
    .single();

  // If no next project, wrap around to the first one
  const { data: firstProject } = !nextProject
    ? await supabase
        .from("projects")
        .select("name, slug, excerpt")
        .eq("status", "published")
        .neq("id", project.id)
        .order("sort_order", { ascending: true })
        .limit(1)
        .single()
    : { data: null };

  const next = nextProject ?? firstProject;

  const completedYear = new Date(project.date_completed).getFullYear();
  const hasDescription = !!project.description?.trim();

  return (
    <div className="min-h-screen bg-bg-page text-text-primary font-sans">
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border-light bg-bg-page/80 backdrop-blur-md px-6 py-4 md:px-10 lg:px-[120px] lg:py-6">
        <Link
          href="/#projects"
          className="flex items-center gap-2 transition-colors hover:text-text-secondary"
        >
          <span className="text-sm text-text-muted">&larr;</span>
          <span className="font-mono text-base font-bold">ry.bealey</span>
        </Link>

        {/* Mobile nav */}
        <MobileNav socials={socials ?? []} />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex md:gap-6 lg:gap-10">
          <Link href="/#about" className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors">about</Link>
          <Link href="/#experience" className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors">experience</Link>
          <Link href="/#skills" className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors">skills</Link>
          <Link href="/#projects" className="font-mono text-sm font-semibold text-text-primary transition-colors">projects</Link>
        </nav>

        <ContactModal>
          <Button size="lg" className="hidden md:inline-flex font-mono text-sm">
            get in touch
          </Button>
        </ContactModal>
      </header>

      <main>
        {/* ===== PROJECT HERO ===== */}
        <section className="flex flex-col gap-7 bg-bg-dark px-6 pb-0 pt-12 md:gap-9 md:px-12 md:pt-[60px] lg:gap-12 lg:px-[120px] lg:pt-20">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2">
            <Link href="/#projects" className="font-mono text-[11px] font-medium tracking-[1px] text-text-muted hover:text-text-secondary transition-colors">
              Projects
            </Link>
            <span className="font-mono text-[11px] text-text-muted">/</span>
            <span className="font-mono text-[11px] font-semibold tracking-[1px] text-brand">
              {project.name}
            </span>
          </div>

          {/* Hero Content */}
          <div className="flex flex-col gap-4 md:gap-5 lg:gap-6">
            <span className="font-mono text-[11px] font-semibold tracking-[2px] text-brand">
              {project.type.toUpperCase()} &mdash; {completedYear}
            </span>
            <h1 className="text-4xl font-bold leading-none md:text-5xl lg:text-[64px]">
              {project.name}
            </h1>
            <p className="text-[15px] leading-relaxed text-text-secondary md:text-base lg:max-w-[640px] lg:text-lg lg:leading-[1.6]">
              {project.excerpt}
            </p>
          </div>

          {/* Meta Row */}
          <div className="grid grid-cols-2 gap-6 md:flex md:gap-12 lg:gap-16">
            <div className="flex flex-col gap-1.5 md:gap-2">
              <span className="font-mono text-[10px] font-semibold tracking-[1.5px] text-text-muted">
                ROLE
              </span>
              <span className="text-sm font-medium text-text-primary md:text-[14px]">
                {project.role || "—"}
              </span>
            </div>
            <div className="flex flex-col gap-1.5 md:gap-2">
              <span className="font-mono text-[10px] font-semibold tracking-[1.5px] text-text-muted">
                TIMELINE
              </span>
              <span className="text-sm font-medium text-text-primary md:text-[14px]">
                {project.timeline || "—"}
              </span>
            </div>
            <div className="flex flex-col gap-1.5 md:gap-2">
              <span className="font-mono text-[10px] font-semibold tracking-[1.5px] text-text-muted">
                TOOLS
              </span>
              <span className="text-sm font-medium text-text-primary md:text-[14px]">
                {project.tools || "—"}
              </span>
            </div>
            <div className="flex flex-col gap-1.5 md:gap-2">
              <span className="font-mono text-[10px] font-semibold tracking-[1.5px] text-text-muted">
                TEAM
              </span>
              <span className="text-sm font-medium text-text-primary md:text-[14px]">
                {project.team} {project.team === 1 ? "person" : "people"}
              </span>
            </div>
          </div>

          {/* Cover Image */}
          {project.cover_image ? (
            <div className="h-[220px] overflow-hidden rounded-t-lg md:h-[380px] lg:h-[520px]">
              <img
                src={project.cover_image}
                alt={`${project.name} cover`}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-[220px] rounded-t-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 md:h-[380px] lg:h-[520px]">
              <div className="flex h-full items-center justify-center font-mono text-sm text-text-muted">
                {project.slug}-cover.png
              </div>
            </div>
          )}
        </section>

        {/* ===== OVERVIEW ===== */}
        {hasDescription && (
          <section className="flex flex-col gap-8 bg-bg-page px-6 py-14 md:gap-12 md:px-12 md:py-[72px] lg:flex-row lg:gap-20 lg:px-[120px] lg:py-[100px]">
            {/* Left — section heading */}
            <div className="flex flex-col gap-3 lg:w-[320px] lg:shrink-0 lg:gap-4">
              <span className="font-mono text-[11px] font-semibold tracking-[2px] text-brand">
                01 &mdash; OVERVIEW
              </span>
              <h2 className="text-2xl font-bold leading-tight md:text-[28px] lg:text-[32px]">
                The final product.
              </h2>
            </div>

            {/* Right — HTML body */}
            <div className="flex flex-1 flex-col gap-8">
              <div
                className="max-w-none text-sm leading-[1.8] text-text-secondary md:text-[15px] lg:text-base [&>p]:mb-6 [&>p:last-child]:mb-0 [&>h2]:mt-8 [&>h2]:mb-4 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-text-primary [&>h3]:mt-6 [&>h3]:mb-3 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-text-primary [&>ul]:mb-6 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:mb-6 [&>ol]:list-decimal [&>ol]:pl-5 [&>li]:mb-2 [&>blockquote]:border-l-2 [&>blockquote]:border-brand [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-text-muted [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2 [&_code]:rounded [&_code]:bg-bg-card [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px] [&>pre]:mb-6 [&>pre]:overflow-x-auto [&>pre]:rounded-lg [&>pre]:bg-bg-card [&>pre]:p-4 [&>hr]:my-8 [&>hr]:border-border-light [&_strong]:font-semibold [&_strong]:text-text-primary"
                dangerouslySetInnerHTML={{ __html: project.description }}
              />

              {project.website && (
                <a
                  href={project.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-fit items-center gap-2 rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-bg-dark transition-opacity hover:opacity-90"
                >
                  Visit Website
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </section>
        )}

        {/* ===== GALLERY ===== */}
        {project.gallery_images.length > 0 && (
          <section className="flex flex-col gap-8 bg-bg-card px-6 py-14 md:gap-10 md:px-12 md:py-[72px] lg:gap-14 lg:px-[120px] lg:py-[100px]">
            <div className="flex flex-col gap-3 lg:gap-4">
              <span className="font-mono text-[11px] font-semibold tracking-[2px] text-brand">
                02 &mdash; GALLERY
              </span>
              <h2 className="text-2xl font-bold leading-tight md:text-[28px] lg:text-[32px]">
                Key screens.
              </h2>
              <p className="text-sm leading-relaxed text-text-secondary md:text-[15px] lg:max-w-[560px] lg:text-base lg:leading-[1.6]">
                A walkthrough of the core screens and interactions that define the
                product experience.
              </p>
            </div>

            <ProjectGallery images={project.gallery_images} projectName={project.name} />
          </section>
        )}

        {/* ===== NEXT PROJECT ===== */}
        {next && (
          <Link
            href={`/projects/${next.slug}`}
            className="group flex flex-col items-center gap-6 bg-bg-page px-6 py-12 text-center transition-colors md:gap-8 md:px-12 md:py-[60px] lg:gap-10 lg:px-[120px] lg:py-20"
          >
            <span className="font-mono text-[11px] font-semibold tracking-[2px] text-text-muted">
              NEXT PROJECT
            </span>
            <span className="text-3xl font-bold leading-none text-text-primary transition-colors group-hover:text-brand md:text-[40px] lg:text-5xl">
              {next.name} &rarr;
            </span>
            <span className="text-sm text-text-secondary md:text-[15px] lg:text-base">
              {next.excerpt}
            </span>
          </Link>
        )}
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-border-light px-6 py-8 md:px-12 md:py-10 lg:px-[120px] lg:py-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/icon.png" alt="" className="h-9 w-9 rounded-full" />
            <div className="flex flex-col gap-1">
              <span className="font-mono text-base font-bold">ry.bealey</span>
              <span className="text-sm text-text-muted">
                Designer &amp; Developer
              </span>
            </div>
          </Link>

          <div className="flex gap-4 lg:gap-10">
            {(socials ?? []).map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-text-secondary transition-colors hover:text-brand"
              >
                {social.platform}
              </a>
            ))}
          </div>
        </div>

        <Separator className="my-6 bg-border-light lg:my-8" />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <span className="text-sm text-text-muted">
            &copy; 2026 Ry Bealey. All rights reserved.
          </span>
          <Link
            href="/"
            className="font-mono text-sm text-text-secondary transition-colors hover:text-brand"
          >
            back to top &uarr;
          </Link>
        </div>
      </footer>
    </div>
  );
}
