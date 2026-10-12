"use client";

import { motion, useAnimationControls, useInView } from "motion/react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useSound } from "@/components/effects/SoundProvider";
import type { Achievement, HomeCopy } from "@/content";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const PRINT = { clipPath: ["inset(0 0 100% 0)", "inset(0 0 0% 0)"], transition: { duration: 1.4, ease: "linear" as const } };

const Rule = () => (
  <p className="overflow-hidden whitespace-nowrap select-none" aria-hidden>
    {"-".repeat(60)}
  </p>
);

function Row({ left, right, strong }: { left: React.ReactNode; right: React.ReactNode; strong?: boolean }) {
  return (
    <p className={`flex items-baseline gap-2 ${strong ? "font-semibold" : ""}`}>
      <span>{left}</span>
      <span className="flex-1 translate-y-[-0.2em] border-b border-dotted border-current opacity-40" aria-hidden />
      <span className="text-right">{right}</span>
    </p>
  );
}

/** Achievements, printed on thermal paper. Prints itself when scrolled into view; the button reprints (with sound). */
export function Receipt({ achievements, copy }: { achievements: Achievement[]; copy: HomeCopy["receipt"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const reduced = usePrefersReducedMotion();
  const controls = useAnimationControls();
  const { play } = useSound();

  useEffect(() => {
    if (inView && !reduced) void controls.start(PRINT);
  }, [inView, reduced, controls]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center lg:gap-14">
      <div className="relative w-full max-w-[22rem]">
        {/* The printer slot */}
        <div className="relative z-10 mx-[-0.75rem] h-3 rounded-sm bg-text shadow-card" aria-hidden />
        <motion.div
          initial={reduced ? false : { clipPath: "inset(0 0 100% 0)" }}
          animate={controls}
          className="receipt-edges -mt-1 bg-[var(--receipt)] px-6 pt-6 pb-8 font-mono text-[0.8rem] leading-relaxed text-[var(--receipt-ink)] drop-shadow-md"
        >
          <div className="text-center">
            <p className="text-base font-semibold tracking-widest">{copy.store}</p>
            {copy.storeLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <Rule />
          <Row left={copy.cashier} right={copy.date} />
          <Rule />
          <ul aria-label="Competition results">
            {achievements.map((a) => (
              <li key={a.id} className="py-1">
                <Row
                  left={
                    <>
                      1× {a.event}
                      {a.team && <span className="opacity-60"> /{a.team.toLowerCase().replace(/\s+/g, "-")}</span>}
                    </>
                  }
                  right={a.result.toUpperCase()}
                  strong
                />
                {a.details.map((d) => (
                  <p key={d} className="pl-5">
                    + {d}
                  </p>
                ))}
              </li>
            ))}
          </ul>
          <Rule />
          <Row left={copy.subtotal} right={`${achievements.length} ${copy.eventsUnit}`} />
          {copy.extras.map((e) => (
            <Row key={e.label} left={e.label} right={e.value} />
          ))}
          <Rule />
          <Row left={copy.total} right={copy.totalValue} strong />
          <p className="mt-1 opacity-70">{copy.footnote}</p>
          <p className="mt-4 text-center tracking-widest">{copy.thanks}</p>
          {/* Barcode */}
          <div
            className="mx-auto mt-3 h-12 w-56"
            style={{
              background:
                "repeating-linear-gradient(90deg, currentColor 0 2px, transparent 2px 4px, currentColor 4px 5px, transparent 5px 8px, currentColor 8px 11px, transparent 11px 12px, currentColor 12px 13px, transparent 13px 16px)",
            }}
            aria-hidden
          />
          <p className="mt-1 text-center text-[0.7rem] tracking-[0.3em]" aria-hidden>
            {copy.barcode}
          </p>
        </motion.div>
      </div>

      <div className="max-w-xs text-center lg:mt-16 lg:-rotate-2 lg:text-left">
        <p className="font-hand text-2xl leading-snug text-primary">{copy.note}</p>
        <p className="mt-3 text-muted">{copy.credit}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-4 lg:justify-start">
          <button
            type="button"
            onClick={() => {
              play("print");
              if (!reduced) void controls.start(PRINT);
            }}
            className="font-mono text-sm underline decoration-primary decoration-2 underline-offset-4 hover:text-primary"
          >
            {copy.reprint}
          </button>
          <Link href={copy.link.href} className="font-mono text-sm underline decoration-primary decoration-2 underline-offset-4 hover:text-primary">
            {copy.link.label}
          </Link>
        </div>
      </div>
    </div>
  );
}
