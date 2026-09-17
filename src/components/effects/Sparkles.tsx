"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { random } from "@/lib/utils";

type Sparkle = { id: string; createdAt: number; color: string; size: number; top: string; left: string };

const COLORS = ["var(--gold-bright)", "var(--primary)", "var(--sky-bright)"];

function generateSparkle(): Sparkle {
  return {
    id: String(random(10000, 99999)) + Date.now(),
    createdAt: Date.now(),
    color: COLORS[random(0, COLORS.length)],
    size: random(10, 20),
    top: random(-10, 90) + "%",
    left: random(-5, 100) + "%",
  };
}

/** Sprinkles little twinkling stars around its children. Decorative only. */
export function Sparkles({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduced = usePrefersReducedMotion();
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    if (reduced) return;
    let timeout: number;
    const tick = () => {
      const now = Date.now();
      setSparkles((current) => [...current.filter((s) => now - s.createdAt < 750), generateSparkle()]);
      timeout = window.setTimeout(tick, random(250, 550));
    };
    timeout = window.setTimeout(tick, 400);
    return () => window.clearTimeout(timeout);
  }, [reduced]);

  return (
    <span className={`relative inline-block ${className ?? ""}`}>
      {sparkles.map((s) => (
        <SparkleStar key={s.id} {...s} />
      ))}
      <span className="relative z-[1]">{children}</span>
    </span>
  );
}

export function SparkleStar({ color, size, top, left }: Pick<Sparkle, "color" | "size" | "top" | "left">) {
  return (
    <span aria-hidden className="pointer-events-none absolute z-[2] block" style={{ top, left, animation: "sparkle-grow 700ms forwards" }}>
      <svg width={size} height={size} viewBox="0 0 68 68" fill="none" style={{ animation: "sparkle-spin 1000ms linear" }}>
        <path
          d="M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z"
          fill={color}
        />
      </svg>
    </span>
  );
}
