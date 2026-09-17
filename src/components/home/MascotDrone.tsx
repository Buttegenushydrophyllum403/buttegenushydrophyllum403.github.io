"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { useSound } from "@/components/effects/SoundProvider";
import { SparkleStar } from "@/components/effects/Sparkles";
import { DroneIcon } from "@/components/icons";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

/** A tiny drone that lazily follows the cursor. Click it. Or try the Konami code. */
export function MascotDrone() {
  const reduced = usePrefersReducedMotion();
  const { play } = useSound();
  const pointerX = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 40, damping: 12 });
  const tilt = useTransform(() => Math.max(-18, Math.min(18, (pointerX.get() - x.get()) / 8)));
  const [rolls, setRolls] = useState(0);
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => pointerX.set((e.clientX / window.innerWidth - 0.5) * 160);
    let progress = 0;
    const onKey = (e: KeyboardEvent) => {
      progress = e.key === KONAMI[progress] ? progress + 1 : e.key === KONAMI[0] ? 1 : 0;
      if (progress === KONAMI.length) {
        progress = 0;
        setRolls((r) => r + 1);
        play("sparkle");
      }
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("keydown", onKey);
    };
  }, [reduced, pointerX, play]);

  if (reduced) return null;

  return (
    <motion.div style={{ x }} className="pointer-events-none absolute -top-6 right-6 z-10 sm:right-10">
      <motion.button
        type="button"
        aria-label="Mascot drone. Beep boop."
        title="Beep boop"
        className="pointer-events-auto relative text-text"
        style={{ rotate: tilt }}
        animate={{ y: [0, -10, 0], rotateZ: rolls * 360 }}
        transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" }, rotateZ: { type: "spring", stiffness: 60, damping: 12 } }}
        whileTap={{ scale: 0.85 }}
        onClick={() => {
          play("beep");
          setBurst((b) => b + 1);
        }}
      >
        <DroneIcon size={56} />
        {burst > 0 && (
          <span key={burst} aria-hidden>
            <SparkleStar color="var(--gold-bright)" size={16} top="-20%" left="-20%" />
            <SparkleStar color="var(--primary)" size={12} top="70%" left="90%" />
            <SparkleStar color="var(--sky-bright)" size={14} top="-30%" left="80%" />
          </span>
        )}
      </motion.button>
    </motion.div>
  );
}
