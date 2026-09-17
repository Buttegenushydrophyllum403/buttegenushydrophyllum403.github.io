import { z } from "zod";

/**
 * Every image/video on the site. `src` is optional: leave it out and the site
 * renders a themed placeholder of the same size until the real file is added
 * under /public (see public/images/README.md).
 */
export const mediaSchema = z.object({
  src: z.string().startsWith("/").optional(),
  alt: z.string().min(3),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  kind: z.enum(["image", "video"]).default("image"),
  /** Poster frame for videos. */
  poster: z.string().startsWith("/").optional(),
  caption: z.string().optional(),
  /** Placeholder icon while `src` is missing. */
  placeholder: z.enum(["phone", "desktop", "drone", "rover", "person", "trophy", "brain"]).default("desktop"),
});
export type Media = z.infer<typeof mediaSchema>;

export const linkSchema = z.object({
  label: z.string(),
  href: z.url(),
});

export const profileSchema = z.object({
  name: z.string(),
  firstName: z.string(),
  title: z.string(),
  specialties: z.string(),
  location: z.string(),
  voice: z.string(),
  intro: z.array(z.string()).min(1),
  email: z.email(),
  links: z.object({
    linkedin: z.url(),
    github: z.url().optional(),
  }),
  cvPath: z.string().startsWith("/"),
  headshot: mediaSchema,
  education: z.object({
    degree: z.string(),
    school: z.string(),
    schoolShort: z.string(),
    period: z.string(),
    cgpa: z.string(),
  }),
});
export type Profile = z.infer<typeof profileSchema>;

export const journeyStopSchema = z.object({
  id: z.string(),
  period: z.string(),
  org: z.string(),
  orgNote: z.string().optional(),
  role: z.string(),
  kind: z.enum(["education", "work", "team"]),
  /** Ground stops are driven by the rover, air stops by the drone. */
  terrain: z.enum(["ground", "air"]),
  summary: z.string(),
  highlights: z.array(z.string()).min(1),
  projectSlug: z.string().optional(),
  current: z.boolean().default(false),
});
export type JourneyStop = z.infer<typeof journeyStopSchema>;

export const storeLinkSchema = z.object({
  store: z.enum(["play", "app"]),
  href: z.url().optional(),
});

export const screenGroupSchema = z.object({
  label: z.string(),
  screens: z.array(mediaSchema).min(1),
});

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  tagline: z.string(),
  org: z.string(),
  role: z.string(),
  period: z.string(),
  category: z.enum(["app", "ai", "robotics"]),
  status: z.string().optional(),
  badges: z.array(z.string()).default([]),
  accent: z.enum(["primary", "gold", "sky", "mint"]),
  cover: mediaSchema,
  /** Phone-style app screens (rendered in a device frame). */
  screenGroups: z.array(screenGroupSchema).default([]),
  /** Photos/videos rendered as a gallery. */
  gallery: z.array(mediaSchema).default([]),
  storeLinks: z.array(storeLinkSchema).default([]),
  brief: z.array(z.string()).min(1),
  myRole: z.array(z.string()).min(1),
  architecture: z
    .object({
      caption: z.string(),
      stages: z.array(z.object({ label: z.string(), nodes: z.array(z.string()).min(1) })).min(2),
    })
    .optional(),
  stack: z.array(z.string()).min(1),
  results: z.array(z.string()).min(1),
  sideways: z.array(z.string()).optional(),
  /** Shown as "more details coming soon" until Rifat fills the case study in. */
  detailsPending: z.boolean().default(false),
});
export type Project = z.infer<typeof projectSchema>;

export const achievementSchema = z.object({
  id: z.string(),
  result: z.string(),
  event: z.string(),
  eventShort: z.string(),
  team: z.string().optional(),
  details: z.array(z.string()).default([]),
  medal: z.enum(["gold", "silver", "bronze", "ribbon"]),
  projectSlug: z.string().optional(),
});
export type Achievement = z.infer<typeof achievementSchema>;

export const skillGroupSchema = z.object({
  id: z.string(),
  title: z.string(),
  blurb: z.string(),
  accent: z.enum(["primary", "gold", "sky", "mint"]),
  skills: z.array(z.string()).min(1),
});
export type SkillGroup = z.infer<typeof skillGroupSchema>;

export const statSchema = z.object({
  label: z.string(),
  value: z.number(),
  prefix: z.string().default(""),
  suffix: z.string().default(""),
  decimals: z.number().int().default(0),
  note: z.string(),
});
export type Stat = z.infer<typeof statSchema>;
