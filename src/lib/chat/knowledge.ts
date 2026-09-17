import { achievements, journey, profile, projects, skillGroups } from "@/content";

/**
 * Turns the site content into the AI twin's knowledge base.
 * Must be deterministic (no dates, no randomness, stable order) so the system
 * prompt is byte-identical between requests and prompt caching keeps working.
 */
export function buildKnowledge(): string {
  const lines: string[] = [];
  const push = (...l: string[]) => lines.push(...l);

  push(
    "## Profile",
    `Name: ${profile.name}`,
    `Title: ${profile.title} | ${profile.specialties}`,
    `Based in: ${profile.location}`,
    `In my own words: "${profile.voice}"`,
    ...profile.intro.map((p) => `- ${p}`),
    `Contact: the contact form at /contact, email ${profile.email}, LinkedIn ${profile.links.linkedin}`,
    ...(profile.links.github ? [`GitHub: ${profile.links.github}`] : []),
    `CV: /cv`,
    "",
    "## Education",
    `${profile.education.degree}, ${profile.education.school} (${profile.education.schoolShort}), ${profile.education.period}, CGPA ${profile.education.cgpa}. Graduated in 2026.`,
    "",
    "## Career journey (chronological)",
  );

  for (const stop of journey) {
    push(
      `### ${stop.period}: ${stop.role}, ${stop.org}${stop.orgNote ? ` (${stop.orgNote})` : ""}${stop.current ? " [current]" : ""}`,
      stop.summary,
      ...stop.highlights.map((h) => `- ${h}`),
      ...(stop.projectSlug ? [`Case study: /projects/${stop.projectSlug}`] : []),
      "",
    );
  }

  push("## Projects (case studies)");
  for (const p of projects) {
    push(
      `### ${p.title} (/projects/${p.slug})`,
      `${p.tagline}`,
      `Organisation: ${p.org}. Role: ${p.role}. Period: ${p.period}.${p.status ? ` Status: ${p.status}.` : ""}`,
      "Brief:",
      ...p.brief.map((b) => `- ${b}`),
      "What I did:",
      ...p.myRole.map((r) => `- ${r}`),
      ...(p.architecture
        ? [`Architecture: ${p.architecture.stages.map((s) => `${s.label} (${s.nodes.join(", ")})`).join(" -> ")}`]
        : []),
      `Tech / areas: ${p.stack.join(", ")}`,
      "Results:",
      ...p.results.map((r) => `- ${r}`),
      ...(p.sideways?.length ? ["What went sideways:", ...p.sideways.map((s) => `- ${s}`)] : []),
      ...p.storeLinks.filter((s) => s.href).map((s) => `${s.store === "play" ? "Google Play" : "App Store"}: ${s.href}`),
      ...(p.storeLinks.some((s) => !s.href) ? ["Also on the App Store (link not listed here yet)."] : []),
      "",
    );
  }

  push("## Achievements");
  for (const a of achievements) {
    push(`- ${a.event} (${a.eventShort}): ${a.result}${a.details.length ? `; ${a.details.join("; ")}` : ""}${a.team ? ` (with ${a.team})` : ""}`);
  }
  push("", "## Skills");
  for (const g of skillGroups) {
    push(`- ${g.title}: ${g.skills.join(", ")}`);
  }

  return lines.join("\n");
}
