"use client";

import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Boop } from "@/components/effects/Boop";
import { useSound } from "@/components/effects/SoundProvider";
import { SparkleStar } from "@/components/effects/Sparkles";
import type { Achievement } from "@/content";
import { cn } from "@/lib/utils";

const MEDAL_COLORS: Record<Achievement["medal"], { cup: string; shine: string }> = {
  gold: { cup: "#f5b82e", shine: "#ffe29a" },
  silver: { cup: "#b9c3d6", shine: "#eef2f8" },
  bronze: { cup: "#cd8b52", shine: "#f1c39a" },
  ribbon: { cup: "#6fd0ff", shine: "#c9eeff" },
};

function TrophyArt({ medal }: { medal: Achievement["medal"] }) {
  const c = MEDAL_COLORS[medal];
  if (medal === "ribbon") {
    return (
      <svg viewBox="0 0 80 100" className="h-24 w-20" aria-hidden>
        <path d="M28 52 18 96l16-8 8 12 6-46Z" fill="var(--primary)" />
        <path d="M52 52l10 44-16-8-8 12-6-46Z" fill="var(--sky-bright)" />
        <circle cx="40" cy="36" r="26" fill={c.cup} />
        <circle cx="40" cy="36" r="18" fill="none" stroke={c.shine} strokeWidth="3" strokeDasharray="4 4" />
        <text x="40" y="42" textAnchor="middle" fontSize="15" fontWeight="700" fontFamily="var(--font-code)" fill="#0a0f1f">URC</text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 80 100" className="h-24 w-20" aria-hidden>
      <path d="M18 14h44v18a22 22 0 0 1-44 0Z" fill={c.cup} />
      <path d="M18 20H8a12 12 0 0 0 12 16M62 20h10a12 12 0 0 1-12 16" fill="none" stroke={c.cup} strokeWidth="5" />
      <path d="M26 20v12a14 14 0 0 0 8 12" fill="none" stroke={c.shine} strokeWidth="4" strokeLinecap="round" />
      <rect x="35" y="54" width="10" height="16" fill={c.cup} />
      <rect x="22" y="70" width="36" height="10" rx="3" fill={c.cup} />
      <rect x="16" y="80" width="48" height="14" rx="3" fill="var(--text)" opacity="0.85" />
    </svg>
  );
}

export function TrophyShelf({ achievements }: { achievements: Achievement[] }) {
  const [selected, setSelected] = useState<string | null>(achievements[0]?.id ?? null);
  const { play } = useSound();
  const active = achievements.find((a) => a.id === selected);

  return (
    <div>
      <div className="relative rounded-3xl border border-border bg-surface px-4 pt-8 shadow-card">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4" aria-label="Achievements">
          {achievements.map((a) => {
            const isActive = a.id === selected;
            return (
              <li key={a.id} className="flex justify-center">
                <button
                  type="button"
                  aria-pressed={isActive}
                  aria-controls="trophy-plaque"
                  onClick={() => {
                    setSelected(a.id);
                    play("sparkle");
                  }}
                  className={cn(
                    "group relative flex flex-col items-center rounded-2xl px-3 pt-2 pb-3 transition-colors",
                    isActive ? "bg-primary-soft" : "hover:bg-surface-2",
                  )}
                >
                  <Boop y={-8} rotation={-6} timing={220}>
                    <TrophyArt medal={a.medal} />
                  </Boop>
                  {isActive && (
                    <>
                      <SparkleStar color="var(--gold-bright)" size={14} top="0%" left="10%" />
                      <SparkleStar color="var(--primary)" size={10} top="30%" left="85%" />
                    </>
                  )}
                  <span className="mt-2 font-mono text-sm font-bold">{a.eventShort}</span>
                  <span className="text-xs text-muted">{a.result}</span>
                </button>
              </li>
            );
          })}
        </ul>
        {/* The shelf */}
        <div className="mx-[-1rem] mt-2 h-4 rounded-b-3xl bg-gradient-to-b from-terrain/60 to-terrain/30" aria-hidden />
      </div>

      <div id="trophy-plaque" aria-live="polite" className="mt-5 min-h-[7.5rem]">
        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-dashed border-gold-bright/70 bg-bg-soft p-5"
            >
              <p className="eyebrow">{active.team ?? active.eventShort}</p>
              <p className="mt-1 font-display text-2xl font-bold">
                {active.result} <span className="text-muted">at the</span> {active.event}
              </p>
              {active.details.length > 0 && <p className="mt-1 text-muted">{active.details.join(" · ")}</p>}
              {active.projectSlug && (
                <Link href={`/projects/${active.projectSlug}`} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                  See the rover <ArrowRight size={15} aria-hidden />
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
