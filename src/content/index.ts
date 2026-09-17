import { z } from "zod";
import { achievements as rawAchievements, skillGroups as rawSkillGroups, stats as rawStats } from "./achievements";
import { journey as rawJourney } from "./journey";
import { profile as rawProfile } from "./profile";
import { projects as rawProjects } from "./projects";
import {
  achievementSchema,
  journeyStopSchema,
  profileSchema,
  projectSchema,
  skillGroupSchema,
  statSchema,
} from "./schema";

export type { Achievement, JourneyStop, Media, Profile, Project, SkillGroup, Stat } from "./schema";

// Parsed at import time: a typo in content fails the build instead of shipping.
export const profile = profileSchema.parse(rawProfile);
export const journey = z.array(journeyStopSchema).parse(rawJourney);
export const projects = z.array(projectSchema).parse(rawProjects);
export const achievements = z.array(achievementSchema).parse(rawAchievements);
export const skillGroups = z.array(skillGroupSchema).parse(rawSkillGroups);
export const stats = z.array(statSchema).parse(rawStats);

const slugs = new Set(projects.map((p) => p.slug));
if (slugs.size !== projects.length) throw new Error("Duplicate project slug in content/projects.ts");
for (const ref of [...journey, ...achievements]) {
  if (ref.projectSlug && !slugs.has(ref.projectSlug)) {
    throw new Error(`Unknown projectSlug "${ref.projectSlug}" in "${ref.id}"`);
  }
}

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
