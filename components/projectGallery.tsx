"use client";

import { useState } from "react";
import { Lightbox } from "@/components/lightbox";

type Props = {
  images: string[];
  projectName: string;
};

export function ProjectGallery({ images, projectName }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4 lg:gap-6">
        {images.map((url, i) => (
          <button
            key={url}
            type="button"
            onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
            className="group h-[200px] overflow-hidden rounded-lg md:h-[240px] lg:h-[320px] cursor-pointer"
          >
            <img
              src={url}
              alt={`${projectName} gallery ${i + 1}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      <Lightbox
        images={images}
        alt={`${projectName} gallery`}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
