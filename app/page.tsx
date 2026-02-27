import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-page text-text-primary font-sans">
      {/* ===== 1. HEADER ===== */}
      <header className="flex items-center justify-between border-b border-border-light px-6 py-4 md:px-10 lg:px-[120px] lg:py-6">
        <span className="font-mono text-base font-bold">ry.bealey</span>

        {/* Mobile hamburger */}
        <button className="flex flex-col gap-1.5 md:hidden" aria-label="Menu">
          <span className="block h-0.5 w-6 bg-text-primary" />
          <span className="block h-0.5 w-6 bg-text-primary" />
          <span className="block h-0.5 w-6 bg-text-primary" />
        </button>

        {/* Desktop/tablet nav */}
        <nav className="hidden items-center gap-6 md:flex md:gap-6 lg:gap-10">
          <a href="#about" className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors">about</a>
          <a href="#experience" className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors">experience</a>
          <a href="#skills" className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors">skills</a>
          <a href="#projects" className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors">projects</a>
          <a href="#contact" className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors">contact</a>
        </nav>

        <Button asChild size="lg" className="hidden md:inline-flex font-mono text-sm">
          <a href="#contact">get in touch</a>
        </Button>
      </header>

      <main>
        {/* ===== 2. HERO ===== */}
        <section className="px-6 py-14 md:px-12 md:py-[72px] lg:px-[120px] lg:py-[100px]">
          <div className="flex flex-col gap-5 md:gap-6 lg:gap-8">
            {/* Status badge */}
            <Badge variant="outline" className="w-fit gap-2 border-border-light bg-transparent px-3 py-1.5 font-mono text-xs text-text-secondary md:text-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
              status: available_for_work
            </Badge>

            <h1 className="text-[48px] font-bold leading-[1.05] tracking-tight md:text-[64px] lg:text-[88px]">
              Product Designer<br />
              <span className="text-brand">&amp; Developer</span>
            </h1>

            <p className="font-mono text-sm text-text-secondary md:text-base lg:text-xl">
              Crafting digital experiences that matter
            </p>

            <p className="text-sm leading-relaxed text-text-secondary md:text-base lg:max-w-[560px]">
              I design and build thoughtful, user-centered products that blend
              clean aesthetics with solid engineering. Currently focused on
              design systems and interactive web experiences.
            </p>

            <div className="flex flex-col gap-3 md:flex-row md:gap-4">
              <Button asChild size="lg" className="font-mono text-sm">
                <a href="#contact">get in touch</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-mono text-sm border-border-light text-text-primary hover:bg-bg-card">
                <a href="#projects">view projects</a>
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
                A bit about me
              </h2>
              {/* Portrait placeholder */}
              <div className="h-60 w-full overflow-hidden rounded-xl bg-gradient-to-br from-bg-card to-bg-card-alt md:h-72 lg:h-80">
                <div className="flex h-full items-center justify-center text-text-muted font-mono text-sm">
                  portrait.jpg
                </div>
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
                  { value: "8+", label: "Years Experience" },
                  { value: "50+", label: "Projects Completed" },
                  { value: "30+", label: "Happy Clients" },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-1">
                    <span className="text-2xl font-bold text-brand lg:text-3xl">
                      {stat.value}
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
            Where I&apos;ve worked
          </h2>

          <div className="flex flex-col">
            {[
              {
                date: "2022 — Present",
                role: "Senior Product Designer",
                company: "Stripe",
                description:
                  "Leading design for the payments dashboard, improving merchant onboarding flows, and building internal design system components.",
              },
              {
                date: "2019 — 2022",
                role: "Product Designer",
                company: "Figma",
                description:
                  "Designed core collaboration features including multiplayer cursors, commenting system, and component library management.",
              },
              {
                date: "2017 — 2019",
                role: "UI/UX Designer",
                company: "Spotify",
                description:
                  "Worked on the mobile listening experience, playlist creation flows, and artist profile pages.",
              },
            ].map((exp, i, arr) => (
              <div key={exp.company}>
                <div className="flex flex-col gap-2 py-6 lg:flex-row lg:items-start lg:gap-0 lg:py-8">
                  <span className="font-mono text-sm text-text-muted lg:w-[180px] lg:shrink-0 lg:pt-1">
                    {exp.date}
                  </span>
                  <div className="flex flex-1 flex-col gap-1">
                    <h3 className="text-lg font-semibold lg:text-xl">
                      {exp.role}
                    </h3>
                    <span className="font-mono text-sm text-brand">
                      {exp.company}
                    </span>
                    <p className="mt-1 text-sm leading-relaxed text-text-secondary lg:text-base">
                      {exp.description}
                    </p>
                  </div>
                  <a
                    href="#"
                    className="hidden text-text-muted transition-colors hover:text-brand lg:block lg:pl-4 lg:pt-1"
                    aria-label={`View ${exp.company}`}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 17L17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  </a>
                </div>
                {i < arr.length - 1 && <Separator className="bg-border-light" />}
              </div>
            ))}
          </div>
        </section>

        {/* ===== 5. SKILLS ===== */}
        <section id="skills" className="bg-bg-dark px-6 py-14 md:px-12 md:py-[72px] lg:px-[120px] lg:py-[100px]">
          <span className="font-mono text-sm text-brand">// skills</span>
          <h2 className="mt-4 mb-10 text-[32px] font-bold leading-tight md:text-[40px] md:mb-12 lg:text-[48px] lg:mb-16">
            What I do
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-4 lg:gap-6">
            {[
              {
                title: "Design",
                items: [
                  "UI/UX Design",
                  "Design Systems",
                  "Prototyping",
                  "User Research",
                  "Visual Design",
                ],
              },
              {
                title: "Development",
                items: [
                  "React / Next.js",
                  "TypeScript",
                  "Tailwind CSS",
                  "Node.js",
                  "REST & GraphQL",
                ],
              },
              {
                title: "Tools",
                items: ["Figma", "VS Code", "Git & GitHub", "Vercel", "Notion"],
              },
            ].map((skill) => (
              <Card key={skill.title} className="border-border-light bg-bg-card-alt py-0 shadow-none">
                <CardHeader className="p-6 pb-0 lg:p-8 lg:pb-0">
                  <CardTitle className="font-mono text-lg font-semibold text-brand">
                    {skill.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-4 lg:p-8 lg:pt-4">
                  <ul className="flex flex-col gap-3">
                    {skill.items.map((item) => (
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
            Selected work
          </h2>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
            {[
              {
                tag: "Web App",
                title: "Pulse Analytics",
                description:
                  "A real-time analytics dashboard for monitoring user engagement and product metrics.",
                gradient: "from-cyan-500/20 to-blue-600/20",
              },
              {
                tag: "Mobile App",
                title: "Mindful",
                description:
                  "A meditation and mindfulness app with guided sessions and progress tracking.",
                gradient: "from-emerald-500/20 to-teal-600/20",
              },
              {
                tag: "Branding",
                title: "Nomad Studio",
                description:
                  "Brand identity and website design for a creative agency focused on remote work.",
                gradient: "from-purple-500/20 to-pink-600/20",
              },
              {
                tag: "SaaS",
                title: "Aura",
                description:
                  "A project management tool designed for small creative teams and freelancers.",
                gradient: "from-orange-500/20 to-red-600/20",
              },
            ].map((project) => (
              <Card key={project.title} className="overflow-hidden border-border-light bg-bg-card-alt py-0 shadow-none">
                {/* Image placeholder */}
                <div
                  className={`h-[200px] bg-gradient-to-br ${project.gradient} md:h-[280px]`}
                >
                  <div className="flex h-full items-center justify-center font-mono text-sm text-text-muted">
                    {project.title.toLowerCase().replace(" ", "-")}.png
                  </div>
                </div>
                <CardContent className="flex flex-col gap-2 p-5 lg:p-7">
                  <span className="font-mono text-xs text-brand">
                    {project.tag}
                  </span>
                  <h3 className="text-lg font-semibold lg:text-xl">
                    {project.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {project.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ===== 7. CONTACT CTA ===== */}
        <section id="contact" className="bg-bg-dark px-6 py-14 md:px-12 md:py-[72px] lg:px-[120px] lg:py-[120px]">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <span className="font-mono text-sm text-brand">// contact</span>
            <h2 className="mt-4 text-[36px] font-bold leading-tight md:text-[44px] lg:text-[56px]">
              Let&apos;s work together
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-text-secondary md:text-base lg:max-w-[560px] lg:text-lg">
              Have a project in mind or just want to chat? I&apos;m always open
              to discussing new opportunities and ideas.
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 md:w-auto md:flex-row md:gap-4">
              <Button asChild size="lg" className="font-mono text-sm">
                <a href="mailto:hello@rybealey.com">send an email</a>
              </Button>
              <Button variant="outline" size="lg" className="font-mono text-sm border-border-light text-text-primary hover:bg-bg-card">
                copy email
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* ===== 8. FOOTER ===== */}
      <footer className="border-t border-border-light px-6 py-8 md:px-12 md:py-10 lg:px-[120px] lg:py-12">
        {/* Top row */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-base font-bold">ry.bealey</span>
            <span className="text-sm text-text-muted">
              Designer &amp; Developer
            </span>
          </div>

          <div className="flex gap-4 lg:gap-10">
            {["GitHub", "LinkedIn", "Twitter", "Dribbble"].map((social) => (
              <a
                key={social}
                href="#"
                className="font-mono text-sm text-text-secondary transition-colors hover:text-brand"
              >
                {social}
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
