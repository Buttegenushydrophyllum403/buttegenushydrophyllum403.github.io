import { Brain, Monitor, Smartphone, Trophy, UserRound } from "lucide-react";
import { DroneIcon, RoverIcon } from "@/components/icons";
import type { Media } from "@/content";
import { cn } from "@/lib/utils";

const LABELS: Record<Media["placeholder"], string> = {
  phone: "Screenshot incoming",
  desktop: "Screenshot incoming",
  drone: "Drone footage incoming",
  rover: "Rover photo incoming",
  person: "Headshot incoming",
  trophy: "Photo incoming",
  brain: "Diagram incoming",
};

function PlaceholderIcon({ kind }: { kind: Media["placeholder"] }) {
  const size = 44;
  switch (kind) {
    case "phone":
      return <Smartphone size={size} strokeWidth={1.5} />;
    case "drone":
      return <DroneIcon size={64} />;
    case "rover":
      return <RoverIcon size={64} />;
    case "person":
      return <UserRound size={size} strokeWidth={1.5} />;
    case "trophy":
      return <Trophy size={size} strokeWidth={1.5} />;
    case "brain":
      return <Brain size={size} strokeWidth={1.5} />;
    default:
      return <Monitor size={size} strokeWidth={1.5} />;
  }
}

/** Themed stand-in with the real media's aspect ratio, so swapping in the file causes no layout shift. */
export function Placeholder({ media, className, showLabel = true }: { media: Media; className?: string; showLabel?: boolean }) {
  return (
    <div
      role="img"
      aria-label={media.alt}
      className={cn(
        "grid-dots relative flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden bg-gradient-to-br from-primary-soft via-surface-2 to-surface text-muted",
        className,
      )}
      style={{ aspectRatio: `${media.width} / ${media.height}` }}
    >
      <span className="text-text/70 animate-float">
        <PlaceholderIcon kind={media.placeholder} />
      </span>
      {showLabel && <span className="px-3 text-center font-mono text-[0.7rem] tracking-widest uppercase">{LABELS[media.placeholder]}</span>}
    </div>
  );
}
