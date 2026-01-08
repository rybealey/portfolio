import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import CaseStudyForm from '@/components/CaseStudyForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function NewCaseStudyPage() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/admin/case-studies"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Case Studies
        </Link>
        <h1 className="text-3xl font-bold mb-8">New Case Study</h1>
        <CaseStudyForm />
      </div>
    </div>
  );
}

