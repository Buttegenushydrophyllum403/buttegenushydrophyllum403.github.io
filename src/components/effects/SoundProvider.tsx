"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { playSound, type SoundName } from "@/lib/sound";

const STORAGE_KEY = "rs-sound-muted";
const listeners = new Set<() => void>();

function readMuted() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

type SoundContextValue = {
  /** Muted by the visitor, or forced off by reduced-motion preference. */
  muted: boolean;
  forcedOff: boolean;
  toggleMuted: () => void;
  play: (name: SoundName) => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const userMuted = useSyncExternalStore(subscribe, readMuted, () => false);
  const forcedOff = usePrefersReducedMotion();
  const muted = userMuted || forcedOff;

  const toggleMuted = useCallback(() => {
    const next = !readMuted();
    try {
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      // Private mode or blocked storage: the toggle still works for this page view.
    }
    if (!next) playSound("toggleOn");
    listeners.forEach((l) => l());
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      if (!muted) playSound(name);
    },
    [muted],
  );

  const value = useMemo(() => ({ muted, forcedOff, toggleMuted, play }), [muted, forcedOff, toggleMuted, play]);
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used inside <SoundProvider>");
  return ctx;
}
