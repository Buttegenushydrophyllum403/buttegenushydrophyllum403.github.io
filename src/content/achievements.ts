import type { z } from "zod";
import type { achievementSchema, skillGroupSchema, statSchema } from "./schema";

export const achievements: z.input<typeof achievementSchema>[] = [
  {
    id: "irc",
    result: "6th globally",
    event: "International Rover Challenge",
    eventShort: "IRC",
    team: "Team Altair",
    details: ["1st in Bangladesh", "1st in the Science Task"],
    medal: "gold",
    projectSlug: "project-altair",
  },
  {
    id: "erc",
    result: "16th globally",
    event: "European Rover Challenge",
    eventShort: "ERC",
    team: "Team Altair",
    medal: "silver",
    projectSlug: "project-altair",
  },
  {
    id: "coderush",
    result: "2nd place",
    event: "CodeRush Hackathon",
    eventShort: "CodeRush",
    medal: "bronze",
  },
  {
    id: "urc",
    result: "Competed",
    event: "University Rover Challenge",
    eventShort: "URC",
    team: "Team Altair",
    medal: "ribbon",
    projectSlug: "project-altair",
  },
];

export const skillGroups: z.input<typeof skillGroupSchema>[] = [
  {
    id: "apps",
    title: "Ships apps",
    blurb: "Mobile and web, from sketch to store listing.",
    accent: "primary",
    skills: ["Flutter", "Next.js", "React", "Play Store", "App Store"],
  },
  {
    id: "servers",
    title: "Ships servers",
    blurb: "The unglamorous part that keeps the glamorous part alive.",
    accent: "gold",
    skills: ["FastAPI", "Spring Boot", "PostgreSQL", "MySQL", "MongoDB", "GitHub Actions", "AWS", "DigitalOcean", "Vercel"],
  },
  {
    id: "thinks",
    title: "Thinks",
    blurb: "Models that see, read, listen and answer.",
    accent: "sky",
    skills: ["Computer Vision", "NLP", "LLM fine-tuning", "RAG", "Voice assistants"],
  },
  {
    id: "flies",
    title: "Flies things",
    blurb: "Rovers, arms, drones. Occasionally on purpose.",
    accent: "mint",
    skills: ["MAVLink", "ROS", "ArduPilot", "WebRTC", "Inverse kinematics", "LiDAR"],
  },
];

export const stats: z.input<typeof statSchema>[] = [
  { label: "Downloads", value: 10, suffix: "K+", note: "GenieA on the Play Store" },
  { label: "IRC rank", value: 6, prefix: "#", note: "Globally, and #1 in Bangladesh" },
  { label: "ERC rank", value: 16, prefix: "#", note: "European Rover Challenge" },
  { label: "CodeRush", value: 2, prefix: "#", note: "Hackathon placing" },
  { label: "CGPA", value: 3.78, decimals: 2, note: "BSc CSE, IUT" },
];
