'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { CaseStudy } from '@/lib/db';
import CaseStudyImageManager from './CaseStudyImageManager';
import CaseStudyLogoUpload from './CaseStudyLogoUpload';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface CaseStudyFormProps {
  caseStudy?: CaseStudy;
}

export default function CaseStudyForm({ caseStudy }: CaseStudyFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(caseStudy?.title || '');
  const [description, setDescription] = useState(caseStudy?.description || '');
  const [status, setStatus] = useState<
    'Completed' | 'Ongoing' | 'Planned'
  >(caseStudy?.status || 'Completed');
  const [technologies, setTechnologies] = useState(
    caseStudy?.technologies.join(', ') || ''
  );
  const [productionUrl, setProductionUrl] = useState(
    caseStudy?.production_url || ''
  );
  const [developmentUrl, setDevelopmentUrl] = useState(
    caseStudy?.development_url || ''
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const techArray = technologies
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      const url = caseStudy
        ? `/api/case-studies/${caseStudy.id}`
        : '/api/case-studies';
      const method = caseStudy ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          status,
          technologies: techArray,
          production_url: productionUrl || undefined,
          development_url: developmentUrl || undefined,
        }),
      });

      if (response.ok) {
        router.push('/admin/case-studies');
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save case study');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      ['link'],
      ['clean'],
    ],
  };

  const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'indent',
    'link',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium mb-2"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium mb-2"
        >
          Description
        </label>
        <div className="[&_.ql-container]:min-h-[200px] [&_.ql-container]:bg-background [&_.ql-container]:text-foreground [&_.ql-container]:border-border [&_.ql-container]:rounded-b-md [&_.ql-toolbar]:bg-muted [&_.ql-toolbar]:border-border [&_.ql-toolbar]:rounded-t-md [&_.ql-stroke]:stroke-foreground [&_.ql-fill]:fill-foreground [&_.ql-picker-label]:text-foreground [&_.ql-picker-options]:bg-background [&_.ql-picker-options]:border-border">
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
            modules={quillModules}
            formats={quillFormats}
            placeholder="Enter case study description..."
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium mb-2"
        >
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as 'Completed' | 'Ongoing' | 'Planned')
          }
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="Completed">Completed</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Planned">Planned</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="technologies"
          className="block text-sm font-medium mb-2"
        >
          Technologies (comma-separated)
        </label>
        <input
          type="text"
          id="technologies"
          value={technologies}
          onChange={(e) => setTechnologies(e.target.value)}
          placeholder="React, TypeScript, Next.js"
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div>
        <label
          htmlFor="production_url"
          className="block text-sm font-medium mb-2"
        >
          Production Website URL (optional)
        </label>
        <input
          type="url"
          id="production_url"
          value={productionUrl}
          onChange={(e) => setProductionUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div>
        <label
          htmlFor="development_url"
          className="block text-sm font-medium mb-2"
        >
          Development Website URL (optional)
        </label>
        <input
          type="url"
          id="development_url"
          value={developmentUrl}
          onChange={(e) => setDevelopmentUrl(e.target.value)}
          placeholder="https://dev.example.com"
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {caseStudy && (
        <>
          <div className="pt-4 border-t border-border">
            <CaseStudyLogoUpload
              caseStudyId={caseStudy.id}
              logo={caseStudy.logo}
            />
          </div>
          <div className="pt-4 border-t border-border">
            <CaseStudyImageManager
              caseStudyId={caseStudy.id}
              images={caseStudy.images || []}
            />
          </div>
        </>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : caseStudy ? 'Update' : 'Create'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-border rounded-md hover:bg-accent transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
