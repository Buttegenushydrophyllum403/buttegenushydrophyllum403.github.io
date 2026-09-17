"use client";

import { useEffect, useRef } from "react";
import type { Media } from "@/content";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

/** Muted looping video that only downloads and plays while on screen. Reduced motion: shows controls, no autoplay. */
export function LazyVideo({ media, className }: { media: Media & { src: string }; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video || reduced) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.4 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <video
      ref={ref}
      className={cn("h-full w-full object-cover", className)}
      src={media.src}
      poster={media.poster}
      width={media.width}
      height={media.height}
      aria-label={media.alt}
      preload="none"
      muted
      loop
      playsInline
      controls={reduced}
    />
  );
}
