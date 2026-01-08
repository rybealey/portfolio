import { getAllCaseStudies } from '@/lib/db';
import { stripHtmlTags } from '@/lib/html-utils';
import Link from 'next/link';
import { Plus, Edit } from 'lucide-react';
import DeleteCaseStudyButton from '@/components/DeleteCaseStudyButton';

async function CaseStudyList() {
  const caseStudies = getAllCaseStudies();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Case Studies</h1>
            <p className="text-muted-foreground mt-1">
              Manage your case studies
            </p>
          </div>
          <Link
            href="/admin/case-studies/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Case Study
          </Link>
        </div>

        {/* Case Studies List */}
        {caseStudies.length === 0 ? (
          <div className="text-center py-16 border border-border rounded-lg">
            <p className="text-muted-foreground mb-4">No case studies yet.</p>
            <Link
              href="/admin/case-studies/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create your first case study
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((study) => (
              <div
                key={study.id}
                className="group relative border border-border rounded-lg bg-card hover:border-accent-foreground/20 transition-all duration-200 hover:shadow-md overflow-hidden"
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      study.status === 'Completed'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : study.status === 'Ongoing'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400'
                    }`}
                  >
                    {study.status}
                  </span>
                </div>

                <div className="p-6">
                  {/* Title */}
                  <h2 className="text-xl font-semibold mb-3 pr-16 group-hover:text-primary transition-colors line-clamp-2">
                    {study.title}
                  </h2>

                  {/* Description Preview */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {stripHtmlTags(study.description)}
                  </p>

                  {/* Technologies */}
                  {study.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {study.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                      {study.technologies.length > 4 && (
                        <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
                          +{study.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="text-xs text-muted-foreground">
                      {new Date(study.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/case-studies/${study.id}/edit`}
                        className="p-2 hover:bg-accent rounded-md transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <DeleteCaseStudyButton id={study.id} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

export default function CaseStudiesAdminPage() {
  return <CaseStudyList />;
}

