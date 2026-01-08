import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import PassionForm from '@/components/PassionForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function NewPassionPage() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/admin/passions"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Passions
        </Link>
        <h1 className="text-3xl font-bold mb-8">New Passion</h1>
        <PassionForm />
      </div>
    </div>
  );
}

