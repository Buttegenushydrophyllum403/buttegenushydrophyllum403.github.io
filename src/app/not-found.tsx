import { House } from "lucide-react";
import Link from "next/link";
import { RoverIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <p className="eyebrow text-primary">Error 404 · Signal lost</p>
      <div className="relative mt-8 grid h-40 w-72 place-items-center overflow-hidden rounded-3xl border border-border bg-surface-2 grid-dots">
        <div className="absolute inset-x-0 bottom-8 h-px bg-terrain/60" aria-hidden />
        <div className="animate-float">
          <RoverIcon size={88} className="text-text" />
        </div>
        <span className="absolute top-3 right-4 font-mono text-xs text-muted" aria-hidden>
          ??.??° N, ??.??° E
        </span>
      </div>
      <h1 className="mt-8 font-display text-4xl font-extrabold sm:text-5xl">The rover wandered off the map.</h1>
      <p className="mt-4 max-w-md text-lg text-muted">
        This page doesn&apos;t exist, or it drove itself into a crater. Autonomous navigation is hard, okay?
      </p>
      <Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white dark:text-bg">
        <House size={18} aria-hidden /> Return to base
      </Link>
    </div>
  );
}
