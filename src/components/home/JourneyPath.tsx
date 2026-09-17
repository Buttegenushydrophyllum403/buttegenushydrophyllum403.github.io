"use client";

import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import Link from "next/link";
import { useRef, useState } from "react";
import { useSound } from "@/components/effects/SoundProvider";
import { DroneIcon, RoverIcon } from "@/components/icons";
import type { JourneyStop } from "@/content";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

/**
 * The career as a mission: a rover drives the early (ground) stops,
 * then takes off as a drone for everything after. Scroll to fly.
 */
export function JourneyPath({ stops }: { stops: JourneyStop[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = usePrefersReducedMotion();
  const { play } = useSound();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 65%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });
  const top = useTransform(progress, (p) => `${p * 100}%`);
  const clip = useTransform(progress, (p) => `inset(0 0 ${(1 - p) * 100}% 0)`);

  const takeoffIndex = Math.max(0, stops.findIndex((s) => s.terrain === "air"));
  // Takeoff happens halfway between the last ground stop and the first air stop.
  const takeoffAt = stops.length > 1 ? (takeoffIndex - 0.5) / (stops.length - 1) : 0;
  const [airborne, setAirborne] = useState(false);

  useMotionValueEvent(progress, "change", (p) => {
    const next = p >= takeoffAt;
    if (next !== airborne) {
      setAirborne(next);
      if (next) play("whoosh");
    }
  });

  return (
    <div className="relative">
      {!reduced && (
        <div className="pointer-events-none absolute top-0 bottom-0 left-5 w-10 -translate-x-1/2 md:left-1/2" aria-hidden>
          {/* Rail: terrain until takeoff, sky afterwards */}
          <div
            className="absolute top-0 bottom-0 left-1/2 w-1 -translate-x-1/2 rounded-full opacity-25"
            style={{ background: `linear-gradient(to bottom, var(--terrain) ${takeoffAt * 100}%, var(--sky-bright) ${takeoffAt * 100}%)` }}
          />
          <motion.div
            className="absolute top-0 bottom-0 left-1/2 w-1 -translate-x-1/2 rounded-full"
            style={{
              clipPath: clip,
              background: `linear-gradient(to bottom, var(--terrain) ${takeoffAt * 100}%, var(--sky-bright) ${takeoffAt * 100}%)`,
            }}
          />
          <motion.div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ top }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={airborne ? "drone" : "rover"}
                initial={{ scale: 0.3, opacity: 0, y: airborne ? 20 : -20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.3, opacity: 0, y: airborne ? -30 : 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className={cn("grid size-14 place-items-center rounded-full border-2 bg-surface shadow-card", airborne ? "border-sky-bright" : "border-terrain")}
              >
                {airborne ? <DroneIcon size={40} className="text-text" /> : <RoverIcon size={38} className="text-text" />}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      <ol ref={ref} className={cn("relative space-y-10 md:space-y-16", reduced && "list-decimal pl-6")}>
        {stops.map((stop, i) => {
          const left = i % 2 === 0;
          const isTakeoff = i === takeoffIndex;
          return (
            <li key={stop.id} className={cn("relative", !reduced && "pl-14 md:pl-0")}>
              {isTakeoff && !reduced && (
                <p className="eyebrow mb-6 text-sky md:text-center">
                  <span aria-hidden>▲▲ </span>Takeoff<span aria-hidden> ▲▲</span>
                </p>
              )}
              <div className={cn("md:grid md:grid-cols-2 md:gap-16", !reduced && (left ? "" : "md:[&>article]:col-start-2"))}>
                <motion.article
                  initial={reduced ? false : { opacity: 0, x: left ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ type: "spring", stiffness: 110, damping: 20 }}
                  className={cn(
                    "relative rounded-3xl border bg-surface p-5 shadow-card sm:p-6",
                    stop.terrain === "air" ? "border-sky-bright/40" : "border-terrain/50",
                    left ? "md:text-right" : "",
                  )}
                >
                  <p className={cn("eyebrow flex flex-wrap items-center gap-2", left && "md:justify-end")}>
                    <span className={stop.terrain === "air" ? "text-sky" : "text-terrain"}>{stop.terrain === "air" ? "Altitude" : "Ground"}</span>
                    <span>·</span>
                    <span>{stop.period}</span>
                    {stop.current && <span className="rounded-full bg-mint/15 px-2 py-0.5 text-mint">Now</span>}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-bold sm:text-2xl">{stop.role}</h3>
                  <p className="font-medium text-muted">
                    {stop.org}
                    {stop.orgNote && <span className="opacity-80"> · {stop.orgNote}</span>}
                  </p>
                  <p className="mt-3">{stop.summary}</p>
                  <ul className="mt-3 space-y-1 text-sm text-muted">
                    {stop.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                  {stop.projectSlug && (
                    <Link href={`/projects/${stop.projectSlug}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                      Mission log <ArrowRight size={15} aria-hidden />
                      <span className="sr-only">: {stop.org}</span>
                    </Link>
                  )}
                </motion.article>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
