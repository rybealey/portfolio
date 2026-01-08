'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface CaseStudyLogoUploadProps {
  caseStudyId: number;
  logo?: string;
}

export default function CaseStudyLogoUpload({
  caseStudyId,
  logo: initialLogo,
}: CaseStudyLogoUploadProps) {
  const [logo, setLogo] = useState<string | undefined>(initialLogo);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/case-studies/${caseStudyId}/logo`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const updatedCaseStudy = await response.json();
        setLogo(updatedCaseStudy.logo);
        router.refresh();
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/case-studies/${caseStudyId}/logo`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setLogo(undefined);
        router.refresh();
      }
    } catch (error) {
      console.error('Error deleting logo:', error);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium">Logo (1:1 ratio recommended)</label>
      
      {logo ? (
        <div className="flex items-start gap-4">
          <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-border bg-muted flex-shrink-0">
            <Image
              src={logo}
              alt="Case study logo"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-md hover:bg-accent transition-colors disabled:opacity-50"
              >
                <Upload className="h-4 w-4" />
                {uploading ? 'Uploading...' : 'Replace Logo'}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-md hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                <X className="h-4 w-4" />
                Remove
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Recommended: Square image (1:1 aspect ratio)
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg hover:border-accent-foreground/20 transition-colors disabled:opacity-50"
          >
            <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground">
              {uploading ? 'Uploading...' : 'Click to upload logo'}
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              Square image (1:1) recommended
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}

