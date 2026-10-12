import type { MetadataRoute } from "next";
import { profile } from "@/content";

// Generated once at build time (the site is a static export).
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} · ${profile.title}`,
    short_name: profile.firstName,
    description: `${profile.title} | ${profile.specialties}`,
    start_url: "/",
    display: "standalone",
    // Graph-paper cream and ballpoint ink, matching the light theme.
    background_color: "#f4f0e4",
    theme_color: "#1c2740",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
