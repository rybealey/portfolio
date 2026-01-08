'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CaseStudyImage } from '@/lib/db';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface CaseStudyImageManagerProps {
  caseStudyId: number;
  images: CaseStudyImage[];
}

export default function CaseStudyImageManager({
  caseStudyId,
  images: initialImages,
}: CaseStudyImageManagerProps) {
  const [images, setImages] = useState<CaseStudyImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch(`/api/case-studies/${caseStudyId}/images`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const updatedCaseStudy = await response.json();
        setImages(updatedCaseStudy.images);
        router.refresh();
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (imageId: string) => {
    try {
      const response = await fetch(
        `/api/case-studies/${caseStudyId}/images/${imageId}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        const updatedCaseStudy = await response.json();
        setImages(updatedCaseStudy.images);
        router.refresh();
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleReorder = async (newImages: CaseStudyImage[]) => {
    // Update order based on new array
    const reorderedImages = newImages.map((img, index) => ({
      ...img,
      order: index,
    }));

    try {
      const response = await fetch(`/api/case-studies/${caseStudyId}/images`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: reorderedImages }),
      });

      if (response.ok) {
        const updatedCaseStudy = await response.json();
        setImages(updatedCaseStudy.images);
        router.refresh();
      }
    } catch (error) {
      console.error('Error reordering images:', error);
    }
  };

  const sortedImages = [...images].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">Images</label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-md hover:bg-accent transition-colors disabled:opacity-50"
        >
          <Upload className="h-4 w-4" />
          {uploading ? 'Uploading...' : 'Upload Images'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {sortedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sortedImages.map((image, index) => (
            <div key={image.id} className="relative group">
              <div className="aspect-video relative bg-muted rounded-lg overflow-hidden border border-border">
                <Image
                  src={`/case-studies/${caseStudyId}/${image.filename}`}
                  alt={image.alt || `Case study image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleDelete(image.id)}
                  className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {sortedImages.length === 0 && (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground mb-4">
            No images uploaded yet
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-sm text-primary hover:underline"
          >
            Upload images
          </button>
        </div>
      )}
    </div>
  );
}

