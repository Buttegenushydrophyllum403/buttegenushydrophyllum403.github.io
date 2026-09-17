"use client";

import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { Boop } from "@/components/effects/Boop";
import { useSound } from "@/components/effects/SoundProvider";
import { useIsClient } from "@/hooks/useIsClient";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { play } = useSound();
  const isClient = useIsClient();
  const isDark = isClient && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => {
        setTheme(isDark ? "light" : "dark");
        play(isDark ? "toggleOn" : "toggleOff");
      }}
      className="grid size-10 place-items-center rounded-full text-text transition-colors hover:bg-surface-2"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <Boop rotation={isDark ? -25 : 25} timing={200}>
        {!isClient ? (
          <span className="block size-5" />
        ) : (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "moon" : "sun"}
            className="block"
            initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            {isDark ? <Moon size={20} /> : <Sun size={20} />}
          </motion.span>
        </AnimatePresence>
        )}
      </Boop>
    </button>
  );
}
