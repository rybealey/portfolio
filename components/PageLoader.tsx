'use client';

import { useState, useEffect } from 'react';

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Function to check if all images are loaded
    const checkImagesLoaded = () => {
      const images = document.querySelectorAll('img');
      if (images.length === 0) return Promise.resolve();
      
      const imagePromises = Array.from(images).map((img) => {
        // Check if image is already loaded
        if (img.complete && (img as HTMLImageElement).naturalWidth > 0) {
          return Promise.resolve();
        }
        // Wait for image to load
        return new Promise<void>((resolve) => {
          const onLoad = () => {
            img.removeEventListener('load', onLoad);
            img.removeEventListener('error', onError);
            resolve();
          };
          const onError = () => {
            img.removeEventListener('load', onLoad);
            img.removeEventListener('error', onError);
            resolve(); // Resolve even on error to not block
          };
          img.addEventListener('load', onLoad);
          img.addEventListener('error', onError);
        });
      });
      return Promise.all(imagePromises);
    };

    // Check if page is fully loaded
    const handleLoad = async () => {
      try {
        // Wait for all images to load
        await checkImagesLoaded();
        // Small delay to ensure smooth transition and let Next.js hydration complete
        await new Promise((resolve) => setTimeout(resolve, 400));
        if (mounted) {
          // Start fade-out animation
          setIsFadingOut(true);
          // Remove from DOM after fade-out completes
          setTimeout(() => {
            if (mounted) {
              setIsLoading(false);
            }
          }, 500); // Match transition duration
        }
      } catch (error) {
        // Even if there's an error, hide loader after a timeout
        if (mounted) {
          setIsFadingOut(true);
          setTimeout(() => {
            if (mounted) {
              setIsLoading(false);
            }
          }, 500);
        }
      }
    };

    // Start checking immediately
    const startCheck = () => {
      if (document.readyState === 'complete') {
        handleLoad();
      } else {
        window.addEventListener('load', handleLoad);
      }
    };

    startCheck();

    // Fallback timeout to ensure loader doesn't stay forever
    const timeout = setTimeout(() => {
      if (mounted) {
        setIsFadingOut(true);
        setTimeout(() => {
          if (mounted) {
            setIsLoading(false);
          }
        }, 500);
      }
    }, 5000);

    return () => {
      mounted = false;
      window.removeEventListener('load', handleLoad);
      clearTimeout(timeout);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-[#0f172a] transition-opacity duration-500 ease-out ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
      {/* Apple-style spinner with gray/silver tones */}
      <div className="relative w-16 h-16">
        {/* Outer ring - lighter gray/silver */}
        <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full opacity-40"></div>
        
        {/* Animated spinner ring - medium gray/silver */}
        <div className="absolute inset-0 border-4 border-transparent border-t-gray-400 dark:border-t-gray-500 rounded-full animate-spin" style={{ animationDuration: '0.8s' }}></div>
        
        {/* Inner accent ring - darker gray for depth, reverse spin */}
        <div className="absolute inset-2 border-2 border-transparent border-r-gray-300 dark:border-r-gray-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}></div>
        
        {/* Center dot - subtle accent */}
        <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
      </div>
    </div>
  );
}