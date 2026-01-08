'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { CaseStudyImage } from '@/lib/db';

interface CaseStudyGalleryProps {
  caseStudyId: number;
  images: CaseStudyImage[];
}

export default function CaseStudyGallery({
  caseStudyId,
  images,
}: CaseStudyGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  const sortedImages = [...images].sort((a, b) => a.order - b.order);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const nextImage = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      return (prev + 1) % sortedImages.length;
    });
  }, [sortedImages.length]);

  const previousImage = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      return prev === 0 ? sortedImages.length - 1 : prev - 1;
    });
  }, [sortedImages.length]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [selectedIndex]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        previousImage();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, closeLightbox, previousImage, nextImage]);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <>
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => openLightbox(index)}
              className="relative aspect-video bg-muted rounded-lg overflow-hidden border border-border hover:border-accent-foreground/20 focus-visible-ring transition-all group touch-manipulation"
              aria-label={`View ${image.alt || `gallery image ${index + 1}`} in full size`}
            >
              <Image
                src={`/case-studies/${caseStudyId}/${image.filename}`}
                alt={image.alt || `Gallery image ${index + 1} of ${sortedImages.length}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
                loading={index < 6 ? 'eager' : 'lazy'}
                priority={index < 3}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          style={{
            paddingLeft: 'max(1rem, env(safe-area-inset-left))',
            paddingRight: 'max(1rem, env(safe-area-inset-right))',
            paddingTop: 'max(1rem, env(safe-area-inset-top))',
            paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
          }}
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery lightbox"
        >
          <button
            onClick={closeLightbox}
            className="absolute p-3 text-white hover:bg-white/10 focus-visible:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/50 rounded-md transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation z-10"
            style={{
              top: 'max(1rem, env(safe-area-inset-top))',
              right: 'max(1rem, env(safe-area-inset-right))',
            }}
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>

          {sortedImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  previousImage();
                }}
                className="absolute p-3 text-white hover:bg-white/10 focus-visible:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/50 rounded-md transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation z-10"
                style={{
                  left: 'max(1rem, env(safe-area-inset-left))',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-8 w-8" aria-hidden="true" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute p-3 text-white hover:bg-white/10 focus-visible:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/50 rounded-md transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation z-10"
                style={{
                  right: 'max(1rem, env(safe-area-inset-right))',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
                aria-label="Next image"
              >
                <ChevronRight className="h-8 w-8" aria-hidden="true" />
              </button>
            </>
          )}

          <div
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full max-w-7xl max-h-full flex items-center justify-center">
              <Image
                src={`/case-studies/${caseStudyId}/${sortedImages[selectedIndex].filename}`}
                alt={sortedImages[selectedIndex].alt || `Gallery image ${selectedIndex + 1} of ${sortedImages.length}`}
                fill
                sizes="100vw"
                className="object-contain"
                priority
                quality={90}
              />
            </div>
            <div 
              className="absolute text-white text-sm bg-black/50 px-4 py-2 rounded backdrop-blur-sm" 
              aria-live="polite" 
              aria-atomic="true"
              style={{
                bottom: 'max(1rem, env(safe-area-inset-bottom))',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              Image {selectedIndex + 1} of {sortedImages.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

