"use client";

import { RotateCcw } from "lucide-react";
import { DroneIcon } from "@/components/icons";

export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <p className="eyebrow text-primary">Unexpected turbulence</p>
      <div className="mt-8 rotate-12">
        <DroneIcon size={96} className="text-text" />
      </div>
      <h1 className="mt-6 font-display text-4xl font-extrabold">Something crashed. Not the drone this time.</h1>
      <p className="mt-4 max-w-md text-lg text-muted">Try again, and if it keeps happening, the bug is on me.</p>
      <button type="button" onClick={() => retry()} className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white dark:text-bg">
        <RotateCcw size={18} aria-hidden /> Try again
      </button>
    </div>
  );
}
