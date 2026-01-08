import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { getCaseStudyBySlug } from '@/lib/db';
import { sanitizeHtmlContent } from '@/lib/html-utils';
import CaseStudyGallery from '@/components/CaseStudyGallery';

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div id="main-content" className="py-12 sm:py-16 px-4 sm:px-6 md:px-12 lg:px-16 max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          href="/case-studies"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground focus-visible-ring rounded transition-colors mb-8 min-h-[44px] px-2 -ml-2 touch-manipulation"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Case Studies
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-4 flex-1">
              {caseStudy.logo && (
                <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
                  <Image
                    src={caseStudy.logo}
                    alt={`${caseStudy.title} logo`}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <h1 className="text-4xl md:text-5xl font-bold">{caseStudy.title}</h1>
            </div>
            <span
              className={`text-xs font-medium px-3 py-1.5 rounded-full ml-4 ${
                caseStudy.status === 'Completed'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : caseStudy.status === 'Ongoing'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400'
              }`}
            >
              {caseStudy.status}
            </span>
          </div>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mb-6">
            {caseStudy.technologies.map((tech) => (
              <span
                key={tech}
                className="text-sm px-3 py-1.5 rounded-md bg-muted text-muted-foreground border border-border"
              >
                {tech}
              </span>
            ))}
          </div>
        </header>

        {/* Description */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <div
            className="text-base text-muted-foreground leading-relaxed prose prose-neutral dark:prose-invert max-w-none [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_a]:text-primary [&_a]:underline [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2"
            dangerouslySetInnerHTML={{ __html: sanitizeHtmlContent(caseStudy.description) }}
          />
        </section>

        {/* Links */}
        {(caseStudy.production_url || caseStudy.development_url) && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Links</h2>
            <div className="flex flex-wrap gap-4">
              {caseStudy.production_url && (
                <a
                  href={caseStudy.production_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-accent hover:border-accent-foreground/20 focus-visible-ring transition-colors min-h-[44px] touch-manipulation"
                >
                  Production Website
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              )}
              {caseStudy.development_url && (
                <a
                  href={caseStudy.development_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-accent hover:border-accent-foreground/20 focus-visible-ring transition-colors min-h-[44px] touch-manipulation"
                >
                  Development Website
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              )}
            </div>
          </section>
        )}

        {/* Gallery */}
        <CaseStudyGallery caseStudyId={caseStudy.id} images={caseStudy.images || []} />

        {/* Metadata */}
        <section className="pt-8 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">Created:</span>{' '}
              {new Date(caseStudy.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            {caseStudy.updated_at !== caseStudy.created_at && (
              <div>
                <span className="font-medium text-foreground">Updated:</span>{' '}
                {new Date(caseStudy.updated_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

