import type { MetadataRoute } from "next";
import { projects, siteUrl } from "@/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/projects", "/about", "/contact"].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  const caseStudies = projects.map((p) => ({
    url: `${siteUrl}/projects/${p.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  return [...pages, ...caseStudies];
}
