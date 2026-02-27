import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import { CountUp } from "@/components/count-up";
import { Typewriter } from "@/components/typewriter";
import { MobileNav } from "@/components/mobile-nav";
import { ContactModal } from "@/components/contact-modal";


export default async function Home() {
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profile").select().single();
  const { data: skills } = await supabase.from("skills").select().order("sort_order");
  const { data: workHistory } = await supabase.from("work_history").select().order("sort_order");
  const { data: socials } = await supabase.from("socials").select().order("sort_order");
  const { data: projects } = await supabase.from("projects").select().order("sort_order");

  const skillsByType = (skills ?? []).reduce<Record<string, string[]>>((acc, s) => {
    (acc[s.type] ??= []).push(s.skill);
    return acc;
  }, {});
  return (
    <div className="min-h-screen bg-bg-page text-text-primary font-sans">
      {/* ===== 1. HEADER ===== */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border-light bg-bg-page/80 backdrop-blur-md px-6 py-4 md:px-10 lg:px-[120px] lg:py-6">
        <span className="font-mono text-base font-bold">ry.bealey</span>

        {/* Mobile nav sheet */}
        <MobileNav />

        {/* Desktop/tablet nav */}
        <nav className="hidden items-center gap-6 md:flex md:gap-6 lg:gap-10">
          <a href="#about" className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors">about</a>
          <a href="#experience" className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors">experience</a>
          <a href="#skills" className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors">skills</a>
          <a href="#projects" className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors">projects</a>
        </nav>

        <ContactModal>
          <Button size="lg" className="hidden md:inline-flex font-mono text-sm">
            get in touch
          </Button>
        </ContactModal>
      </header>

      <main>
        {/* ===== 2. HERO ===== */}
        <section className="px-6 py-14 md:px-12 md:py-[72px] lg:px-[120px] lg:py-[100px]">
          <div className="flex flex-col gap-5 md:gap-6 lg:gap-8">
            {/* Status badge */}
            <Badge variant="outline" className="w-fit gap-2 border-border-light bg-transparent px-3 py-1.5 font-mono text-xs text-text-secondary md:text-sm">
              <span className={`h-2.5 w-2.5 rounded-full ${profile?.looking_for_work ? "bg-green-400" : "bg-yellow-400"}`} />
              {profile?.looking_for_work ? "status: available_for_work" : "status: not_available"}
            </Badge>

            <h1 className="text-[48px] font-bold leading-[1.05] tracking-tight md:text-[64px] lg:text-[88px]">
              {profile?.first_name ?? "First"}<br />
              <span className="text-brand">{profile?.last_name ?? "Last"}</span>
            </h1>

            <Typewriter
              text="Crafting digital experiences that matter"
              className="font-mono text-sm text-text-secondary md:text-base lg:text-xl"
            />

            <p className="text-sm leading-relaxed text-text-secondary md:text-base lg:max-w-[560px]">
              I design and build thoughtful, user-centered products that blend
              clean aesthetics with solid engineering. Currently focused on
              design systems and interactive web experiences.
            </p>

            <div className="flex flex-col gap-3 md:flex-row md:gap-4">
              <Button asChild size="lg" className="font-mono text-sm">
                <a href="#projects">view projects</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-mono text-sm border-border-light text-text-primary hover:bg-bg-card">
                <a href="/cv.pdf" target="_blank" rel="noopener noreferrer">download cv</a>
              </Button>
            </div>
          </div>
        </section>

        {/* ===== 3. ABOUT ===== */}
        <section id="about" className="bg-bg-dark px-6 py-14 md:px-12 md:py-[72px] lg:px-[120px] lg:py-[100px]">
          <div className="flex flex-col gap-10 md:gap-12 lg:flex-row lg:gap-20">
            {/* Left column */}
            <div className="flex flex-col gap-6 lg:w-[400px] lg:shrink-0">
              <span className="font-mono text-sm text-brand">// about</span>
              <h2 className="text-[32px] font-bold leading-tight md:text-[40px] lg:text-[48px]">
                A bit about me.
              </h2>
              {/* Portrait */}
              <div className="aspect-square w-full overflow-hidden rounded-xl">
                <img src="/ryan_bealey.jpeg" alt="Portrait" className="h-full w-full object-cover" />
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col justify-center gap-6">
              <p className="text-base leading-relaxed text-text-secondary lg:text-lg">
                I&apos;m a product designer and developer with over 8 years of
                experience building digital products. I started my career in
                graphic design before transitioning into UI/UX, and eventually
                fell in love with front-end development.
              </p>
              <p className="text-base leading-relaxed text-text-secondary lg:text-lg">
                My sweet spot is the intersection of design and engineering —
                where pixel-perfect interfaces meet clean, maintainable code. I
                believe the best products come from understanding both sides of
                the equation.
              </p>

              {/* Stats */}
              <div className="flex gap-6 pt-4 lg:gap-12">
                {[
                  { value: profile?.years_exp ?? 0, label: "Years Experience" },
                  { value: profile?.project_count ?? 0, label: "Recent Projects" },
                  { value: profile?.client_count ?? 0, label: "Ongoing Partnerships" },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-1">
                    <span className="text-2xl font-bold text-brand lg:text-3xl">
                      <CountUp value={stat.value} suffix="+" />
                    </span>
                    <span className="font-mono text-xs text-text-muted">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== 4. EXPERIENCE ===== */}
        <section id="experience" className="px-6 py-14 md:px-12 md:py-[72px] lg:px-[120px] lg:py-[100px]">
          <span className="font-mono text-sm text-brand">// experience</span>
          <h2 className="mt-4 mb-10 text-[32px] font-bold leading-tight md:text-[40px] md:mb-12 lg:text-[48px] lg:mb-16">
            Where I&apos;ve worked.
          </h2>

          <div className="flex flex-col">
            {(workHistory ?? []).map((job, i, arr) => {
              const startYear = new Date(job.start_date).getFullYear();
              const endLabel = job.end_date ? new Date(job.end_date).getFullYear().toString() : "Present";
              const dateRange = startYear === Number(endLabel) ? `${startYear}` : `${startYear} — ${endLabel}`;

              return (
              <div key={job.id}>
                <div className="flex flex-col gap-2 py-6 lg:flex-row lg:items-start lg:gap-0 lg:py-8">
                  <span className="font-mono text-sm text-text-muted lg:w-[180px] lg:shrink-0 lg:pt-1">
                    {dateRange}
                  </span>
                  <div className="flex flex-1 flex-col gap-1">
                    <h3 className="text-lg font-semibold lg:text-xl">
                      {job.job_title}
                    </h3>
                    <span className="font-mono text-sm text-brand">
                      {job.employer}
                    </span>
                    <p className="mt-1 text-sm leading-relaxed text-text-secondary lg:text-base">
                      {job.job_description}
                    </p>
                  </div>
                </div>
                {i < arr.length - 1 && <Separator className="bg-border-light" />}
              </div>
              );
            })}
          </div>
        </section>

        {/* ===== 5. SKILLS ===== */}
        <section id="skills" className="bg-bg-dark px-6 py-14 md:px-12 md:py-[72px] lg:px-[120px] lg:py-[100px]">
          <span className="font-mono text-sm text-brand">// skills</span>
          <h2 className="mt-4 mb-10 text-[32px] font-bold leading-tight md:text-[40px] md:mb-12 lg:text-[48px] lg:mb-16">
            What I do.
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-4 lg:gap-6">
            {Object.entries(skillsByType).map(([type, items]) => (
              <Card key={type} className="border-border-light bg-bg-card-alt py-0 shadow-none">
                <CardHeader className="p-6 pb-0 lg:p-8 lg:pb-0">
                  <CardTitle className="font-mono text-lg font-semibold text-brand">
                    {type}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-4 lg:p-8 lg:pt-4">
                  <ul className="flex flex-col gap-3">
                    {items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-sm text-text-secondary"
                      >
                        <span className="h-1 w-1 rounded-full bg-brand" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ===== 6. PROJECTS ===== */}
        <section id="projects" className="px-6 py-14 md:px-12 md:py-[72px] lg:px-[120px] lg:py-[100px]">
          <span className="font-mono text-sm text-brand">// projects</span>
          <h2 className="mt-4 mb-10 text-[32px] font-bold leading-tight md:text-[40px] md:mb-12 lg:text-[48px] lg:mb-16">
            Selected work.
          </h2>

          {(projects ?? []).length > 0 ? (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
              {(projects ?? []).map((project) => (
                <Card key={project.id} className="overflow-hidden border-border-light bg-bg-card-alt py-0 shadow-none">
                  <div className="h-[200px] bg-gradient-to-br from-cyan-500/20 to-blue-600/20 md:h-[280px]">
                    <div className="flex h-full items-center justify-center font-mono text-sm text-text-muted">
                      {project.slug}.png
                    </div>
                  </div>
                  <CardContent className="flex flex-col gap-2 p-5 lg:p-7">
                    <span className="font-mono text-xs text-brand">
                      {project.type}
                    </span>
                    <h3 className="text-lg font-semibold lg:text-xl">
                      {project.name}
                    </h3>
                    <p className="text-sm leading-relaxed text-text-secondary">
                      {project.excerpt}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-border-light bg-bg-card-alt py-0 shadow-none">
              <CardContent className="flex flex-col items-center justify-center gap-3 py-16">
                <span className="text-2xl">🔧</span>
                <p className="font-mono text-sm text-text-secondary">
                  Currently revamping this section — check back soon for the good stuff.
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* ===== 7. CONTACT CTA ===== */}
        <section id="contact" className="bg-bg-dark px-6 py-14 md:px-12 md:py-[72px] lg:px-[120px] lg:py-[120px]">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <span className="font-mono text-sm text-brand">// contact</span>
            <h2 className="mt-4 text-[36px] font-bold leading-tight md:text-[44px] lg:text-[56px]">
              Let&apos;s work together.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-text-secondary md:text-base lg:max-w-[560px] lg:text-lg">
              Have a project in mind or just want to chat? I&apos;m always open
              to discussing new opportunities and ideas.
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 md:w-auto md:flex-row md:gap-4">
              <ContactModal>
                <Button size="lg" className="font-mono text-sm">
                  send an email
                </Button>
              </ContactModal>
            </div>
          </div>
        </section>
      </main>

      {/* ===== 8. FOOTER ===== */}
      <footer className="border-t border-border-light px-6 py-8 md:px-12 md:py-10 lg:px-[120px] lg:py-12">
        {/* Top row */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <img src="/icon.png" alt="" className="h-9 w-9 rounded-full" />
            <div className="flex flex-col gap-1">
              <span className="font-mono text-base font-bold">ry.bealey</span>
              <span className="text-sm text-text-muted">
                Designer &amp; Developer
              </span>
            </div>
          </div>

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

        {/* Bottom row */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <span className="text-sm text-text-muted">
            &copy; 2026 Ry Bealey. All rights reserved.
          </span>
          <a
            href="#"
            className="font-mono text-sm text-text-secondary transition-colors hover:text-brand"
          >
            back to top &uarr;
          </a>
        </div>
      </footer>
    </div>
  );
}
