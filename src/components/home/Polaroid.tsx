"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { useSound } from "@/components/effects/SoundProvider";
import { SmartMedia } from "@/components/media/SmartMedia";
import type { HomeCopy, Media, SiteCopy } from "@/content";
import { cn } from "@/lib/utils";

/** The headshot, taped into the notebook. Click it to read what's written on the back. */
export function Polaroid({
  media,
  copy,
  labels,
  className,
}: {
  media: Media;
  copy: HomeCopy["hero"]["photo"];
  labels: SiteCopy["photoHint"];
  className?: string;
}) {
  const [flipped, setFlipped] = useState(false);
  const { play } = useSound();
  const back = (
    <>
      {copy.back.map((line) => (
        <p key={line}>{line}</p>
      ))}
      <p className="text-[#b8321c]">{copy.punchline}</p>
    </>
  );

  return (
    <div className={cn("relative [perspective:1200px]", className)}>
      <span className="tape -top-3 left-1/2 z-10 -translate-x-1/2 -rotate-3" aria-hidden />
      <motion.button
        type="button"
        aria-pressed={flipped}
        aria-label={flipped ? labels.flipBack : labels.flip}
        onClick={() => {
          setFlipped((f) => !f);
          play("flip");
        }}
        className="relative block w-full cursor-pointer text-left [transform-style:preserve-3d]"
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 18 }}
      >
        {/* Front */}
        <div className="bg-surface p-3 pb-14 shadow-card [backface-visibility:hidden] dark:bg-[#f7f4ea]">
          <div className="overflow-hidden bg-surface-2">
            <SmartMedia media={media} preload sizes="(min-width: 768px) 360px, 85vw" className="aspect-[648/706]" />
          </div>
          <p className="absolute right-3 bottom-3 left-3 text-center font-hand text-xl text-[#1c2740]">{copy.caption}</p>
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col justify-center gap-3 bg-[#f7f4ea] p-7 font-hand text-xl leading-snug text-[#1c2740] shadow-card [backface-visibility:hidden] [transform:rotateY(180deg)]"
          aria-hidden
        >
          {back}
        </div>
      </motion.button>
      <div className="sr-only" aria-live="polite">
        {flipped ? back : null}
      </div>
      <p className="mt-3 text-center font-mono text-xs text-muted" aria-hidden>
        ↻ {flipped ? copy.hintFlipped : copy.hint}
      </p>
    </div>
  );
}
