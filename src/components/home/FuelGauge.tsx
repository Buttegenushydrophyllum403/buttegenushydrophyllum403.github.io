"use client";

import { animate, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useSound } from "@/components/effects/SoundProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** The profile line, as an instrument: a needle drifting between CURIOSITY and PANIC. */
export function FuelGauge() {
  const reduced = usePrefersReducedMotion();
  const { play } = useSound();
  const [panicking, setPanicking] = useState(false);
  const target = useMotionValue(-30);
  const angle = useSpring(target, { stiffness: 90, damping: 6 });

  useEffect(() => {
    if (reduced || panicking) return;
    const controls = animate(target, [-45, 10, -25, 25, -40], { duration: 9, repeat: Infinity, ease: "easeInOut" });
    return () => controls.stop();
  }, [reduced, panicking, target]);

  const panic = () => {
    setPanicking(true);
    target.set(68);
    play("beep");
  };
  const calm = () => {
    setPanicking(false);
    target.set(-30);
  };

  return (
    <div
      className="w-56 rounded-2xl border border-border bg-surface/95 p-3 shadow-card backdrop-blur"
      onMouseEnter={panic}
      onMouseLeave={calm}
      onFocus={panic}
      onBlur={calm}
      tabIndex={0}
      role="img"
      aria-label="Fuel gauge: running on curiosity and occasional panic"
    >
      <p className="eyebrow mb-1 flex justify-between text-[0.62rem]">
        <span>Fuel</span>
        <span className={panicking ? "text-primary" : "text-mint"}>{panicking ? "● Panic" : "● Nominal"}</span>
      </p>
      <svg viewBox="0 0 200 118" className="w-full" aria-hidden>
        <defs>
          <linearGradient id="gauge" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="var(--sky-bright)" />
            <stop offset="55%" stopColor="var(--gold-bright)" />
            <stop offset="100%" stopColor="var(--primary)" />
          </linearGradient>
        </defs>
        <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="url(#gauge)" strokeWidth="14" strokeLinecap="round" />
        {[-60, -30, 0, 30, 60].map((a) => (
          <line key={a} x1="100" y1="32" x2="100" y2="40" stroke="var(--text-muted)" strokeWidth="2" transform={`rotate(${a} 100 100)`} />
        ))}
        <motion.line
          x1="100"
          y1="100"
          x2="100"
          y2="34"
          stroke="var(--text)"
          strokeWidth="4"
          strokeLinecap="round"
          style={{ rotate: angle, originX: 0.5, originY: 1 }}
        />
        <circle cx="100" cy="100" r="8" fill="var(--text)" />
        <text x="16" y="116" fontSize="10" fontFamily="var(--font-code)" fill="var(--text-muted)">CURIOSITY</text>
        <text x="184" y="116" fontSize="10" fontFamily="var(--font-code)" fill="var(--text-muted)" textAnchor="end">PANIC</text>
      </svg>
    </div>
  );
}
