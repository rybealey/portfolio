import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4">Case Study Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The case study you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/case-studies"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Case Studies
        </Link>
      </div>
    </div>
  );
}

