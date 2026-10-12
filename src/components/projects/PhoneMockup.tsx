"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useSound } from "@/components/effects/SoundProvider";
import { SmartMedia } from "@/components/media/SmartMedia";
import type { Project } from "@/content";
import { cn } from "@/lib/utils";

/** Device frame with tabs per app (e.g. Citizen / Police) and a swipeable screen carousel. */
export function PhoneMockup({ groups, title }: { groups: Project["screenGroups"]; title: string }) {
  const [groupIndex, setGroupIndex] = useState(0);
  const [screenIndex, setScreenIndex] = useState(0);
  const { play } = useSound();
  const group = groups[groupIndex];
  const screens = group.screens;

  const go = (delta: number) => {
    play("click");
    setScreenIndex((i) => (i + delta + screens.length) % screens.length);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      {groups.length > 1 && (
        <div role="tablist" aria-label={`${title} apps`} className="inline-flex border-2 border-text bg-surface">
          {groups.map((g, i) => (
            <button
              key={g.label}
              role="tab"
              type="button"
              aria-selected={i === groupIndex}
              onClick={() => {
                play("click");
                setGroupIndex(i);
                setScreenIndex(0);
              }}
              className={cn(
                "px-4 py-1.5 font-mono text-sm transition-colors",
                i === groupIndex ? "bg-text text-bg" : "text-muted hover:text-text",
              )}
            >
              {g.label}
            </button>
          ))}
        </div>
      )}

      <div className="relative w-[15.5rem] rounded-[2.6rem] border-[10px] border-[#1c2135] bg-[#1c2135] shadow-2xl sm:w-[17rem]">
        <div className="absolute top-2 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-[#1c2135]" aria-hidden />
        <div className="relative aspect-[1080/2340] overflow-hidden rounded-[1.9rem] bg-surface">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={`${groupIndex}-${screenIndex}`}
              className="absolute inset-0"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              drag={screens.length > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x < -50) go(1);
                else if (info.offset.x > 50) go(-1);
              }}
            >
              <SmartMedia media={screens[screenIndex]} sizes="272px" className="h-full" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {screens.length > 1 && (
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => go(-1)} className="grid size-9 place-items-center border-2 border-text hover:text-primary" aria-label="Previous screenshot">
            <ChevronLeft size={18} />
          </button>
          <p className="font-mono text-xs text-muted" aria-live="polite">
            {screenIndex + 1} / {screens.length}
          </p>
          <button type="button" onClick={() => go(1)} className="grid size-9 place-items-center border-2 border-text hover:text-primary" aria-label="Next screenshot">
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
