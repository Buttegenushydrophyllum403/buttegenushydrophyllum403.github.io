import { profile, projects, siteUrl, skillGroups } from "@/content";

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: siteUrl,
    jobTitle: profile.title,
    email: `mailto:${profile.email}`,
    alumniOf: { "@type": "CollegeOrUniversity", name: profile.education.school },
    worksFor: { "@type": "Organization", name: "Star Technologies" },
    sameAs: [profile.links.linkedin, profile.links.github].filter(Boolean),
    knowsAbout: skillGroups.flatMap((g) => g.skills),
  };
}

export function projectJsonLd(slug: string) {
  const p = projects.find((x) => x.slug === slug);
  if (!p) return null;
  const store = p.storeLinks.find((s) => s.href);
  if (p.category === "app") {
    return {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: p.title,
      description: p.tagline,
      applicationCategory: "MobileApplication",
      operatingSystem: "Android, iOS",
      url: store?.href ?? `${siteUrl}/projects/${p.slug}/`,
      creator: { "@type": "Person", name: profile.name },
    };
  }
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.title,
    description: p.tagline,
    url: `${siteUrl}/projects/${p.slug}/`,
    creator: { "@type": "Person", name: profile.name },
  };
}
