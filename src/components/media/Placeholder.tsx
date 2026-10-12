import type { Media } from "@/content";
import { cn } from "@/lib/utils";

const LABELS: Record<Media["placeholder"], string> = {
  phone: "screenshot pending",
  desktop: "screenshot pending",
  drone: "drone photo pending",
  rover: "rover photo pending",
  person: "headshot pending",
  trophy: "photo pending",
  brain: "diagram pending",
};

/**
 * The drafting convention for "an image goes here": a box with a cross through it.
 * Keeps the real media's aspect ratio, so swapping in the file causes no layout shift.
 */
export function Placeholder({ media, className, showLabel = true }: { media: Media; className?: string; showLabel?: boolean }) {
  return (
    <div
      role="img"
      aria-label={media.alt}
      className={cn("relative flex h-full w-full items-center justify-center overflow-hidden bg-surface-2 text-muted", className)}
      style={{ aspectRatio: `${media.width} / ${media.height}` }}
    >
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden>
        <path d="M0 0 100 100M100 0 0 100" stroke="var(--border)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <rect x="0" y="0" width="100" height="100" fill="none" stroke="var(--border)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      {showLabel && (
        <span className="relative bg-surface-2 px-2 py-0.5 font-mono text-[0.68rem] tracking-wider uppercase">
          fig. — {LABELS[media.placeholder]}
        </span>
      )}
    </div>
  );
}
