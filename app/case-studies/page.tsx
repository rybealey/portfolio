import Link from 'next/link';
import Image from 'next/image';
import { getAllCaseStudies } from '@/lib/db';
import { stripHtmlTags } from '@/lib/html-utils';

export default function CaseStudiesPage() {
  const caseStudies = getAllCaseStudies();

  return (
    <div className="min-h-screen bg-background">
      <div id="main-content" className="py-12 sm:py-16 px-4 sm:px-6 md:px-12 lg:px-16 max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Case Studies</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            A collection of prominent projects I&apos;ve worked on, showcasing my experience in web development, server administration, and digital solutions.
          </p>
        </header>

        {/* Case Studies Grid */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {caseStudies.map((study) => (
            <Link
              key={study.id}
              href={`/case-studies/${study.slug}`}
              className="group relative p-6 rounded-lg border border-border bg-card hover:border-accent-foreground/20 focus-visible-ring transition-all duration-300 hover:shadow-lg block"
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    study.status === "Completed"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : study.status === "Ongoing"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                      : "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400"
                  }`}
                >
                  {study.status}
                </span>
              </div>

              {/* Content */}
              <div className="pr-20">
                <div className="flex items-center gap-4 mb-3">
                  {study.logo && (
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={study.logo}
                        alt={`${study.title} logo`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <h2 className="text-2xl font-bold group-hover:text-primary transition-colors flex-1">
                    {study.title}
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                  {stripHtmlTags(study.description)}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {study.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-3 py-1 rounded-md bg-muted text-muted-foreground border border-border"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State Message (when no case studies) */}
        {caseStudies.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Case studies coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
