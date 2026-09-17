import type { MetadataRoute } from "next";
import { profile } from "@/content";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} · ${profile.title}`,
    short_name: profile.firstName,
    description: `${profile.title} | ${profile.specialties}`,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0f1f",
    theme_color: "#ff5fa2",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
