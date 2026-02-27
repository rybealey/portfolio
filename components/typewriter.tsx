"use client";

import { useEffect, useRef, useState } from "react";

export function Typewriter({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [displayed, setDisplayed] = useState("");
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let i = 0;
          const interval = setInterval(() => {
            i++;
            setDisplayed(text.slice(0, i));
            if (i >= text.length) clearInterval(interval);
          }, 40);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [text, hasAnimated]);

  return (
    <p ref={ref} className={className}>
      {displayed}
      {hasAnimated && (
        <span
          className="inline-block w-[2px] h-[1em] bg-brand align-middle ml-2"
          style={{ animation: "blink 1.2s step-start infinite" }}
        />
      )}
    </p>
  );
}
