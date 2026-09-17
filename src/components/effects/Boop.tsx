"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { SoundName } from "@/lib/sound";
import { useSound } from "./SoundProvider";

type BoopProps = {
  children: React.ReactNode;
  x?: number;
  y?: number;
  rotation?: number;
  scale?: number;
  /** How long the boop holds before springing back. */
  timing?: number;
  sound?: SoundName;
  className?: string;
  /** Controlled trigger, e.g. when a parent card is hovered. Omit to boop on own hover. */
  active?: boolean;
};

/**
 * A springy nudge on hover: the element pops out of place, then bounces back.
 */
export function Boop({ children, x = 0, y = 0, rotation = 0, scale = 1, timing = 150, sound, className, active }: BoopProps) {
  const [booped, setBooped] = useState(false);
  const [prevActive, setPrevActive] = useState(active);
  const { play } = useSound();

  // Parent-controlled trigger: boop each time `active` flips on.
  if (active !== prevActive) {
    setPrevActive(active);
    if (active) setBooped(true);
  }

  useEffect(() => {
    if (!booped) return;
    const timer = window.setTimeout(() => setBooped(false), timing);
    return () => window.clearTimeout(timer);
  }, [booped, timing]);

  return (
    <motion.span
      className={className ?? "inline-block"}
      onMouseEnter={
        active === undefined
          ? () => {
              setBooped(true);
              if (sound) play(sound);
            }
          : undefined
      }
      animate={booped ? { x, y, rotate: rotation, scale } : { x: 0, y: 0, rotate: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      {children}
    </motion.span>
  );
}
