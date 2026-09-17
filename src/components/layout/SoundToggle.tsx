"use client";

import { Volume2, VolumeX } from "lucide-react";
import { Boop } from "@/components/effects/Boop";
import { useSound } from "@/components/effects/SoundProvider";
import { useIsClient } from "@/hooks/useIsClient";

export function SoundToggle() {
  const { muted, forcedOff, toggleMuted } = useSound();
  const isClient = useIsClient();
  const showMuted = isClient && muted;

  return (
    <button
      type="button"
      onClick={toggleMuted}
      disabled={forcedOff}
      className="grid size-10 place-items-center rounded-full text-text transition-colors hover:bg-surface-2 disabled:opacity-50"
      aria-label={forcedOff ? "Sounds are off because reduced motion is on" : showMuted ? "Turn sounds on" : "Mute sounds"}
      aria-pressed={!showMuted}
      title={forcedOff ? "Sounds off (reduced motion)" : showMuted ? "Sounds off" : "Sounds on"}
    >
      <Boop scale={1.15} timing={180}>
        {showMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </Boop>
    </button>
  );
}
