import { ImageResponse } from "next/og";
import { profile, siteCopy } from "@/content";
import { OG_SIZE, OgCard } from "@/lib/og";

export const alt = `${profile.name}: ${profile.title} | ${profile.specialties}`;
export const size = OG_SIZE;
export const contentType = "image/png";
// Rendered once at build time (the site is a static export).
export const dynamic = "force-static";

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow={siteCopy.ogImage.eyebrow}
        title={profile.name}
        subtitle={siteCopy.ogImage.subtitle}
        footer={siteCopy.ogImage.footer}
      />
    ),
    size,
  );
}
