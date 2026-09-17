import { ImageResponse } from "next/og";
import { profile } from "@/content";
import { OG_SIZE, OgCard } from "@/lib/og";

export const alt = `${profile.name}: ${profile.title} | ${profile.specialties}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="Systems online"
        title={profile.name}
        subtitle={`${profile.title} · ${profile.specialties}. Apps with 10K+ downloads, a Mars rover ranked 6th globally, and drones built from scratch.`}
        footer="Chat with my AI twin →"
      />
    ),
    size,
  );
}
