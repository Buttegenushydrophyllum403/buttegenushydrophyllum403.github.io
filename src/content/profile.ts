import type { z } from "zod";
import type { profileSchema } from "./schema";

export const profile: z.input<typeof profileSchema> = {
  name: "Rifat Sarwar",
  firstName: "Rifat",
  title: "Full Stack Developer",
  specialties: "AI & Robotics",
  location: "Bangladesh",
  voice: "I try to take my work seriously, but not myself. Love to code. Fueled by curiosity and occasional panic.",
  intro: [
    "I build apps people actually use, AI that runs where the cloud can't reach, and robots that (mostly) go where they're told.",
    "Right now I'm a Senior Software Engineer at Star Technologies, shipping full-stack mobile apps and web platforms, and leading Star Watch, where we build drone systems from scratch.",
  ],
  email: "rifatsarwar17442@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/rifatsarwar",
    // github: "https://github.com/<username>",  // TODO(Rifat): add when ready
  },
  cvPath: "/cv/rifat-sarwar-cv.pdf",
  headshot: {
    // src: "/images/headshot/rifat-headshot.jpg",  // TODO(Rifat): drop the photo in and uncomment
    alt: "Rifat Sarwar smiling at the camera",
    width: 1200,
    height: 1200,
    placeholder: "person",
  },
  education: {
    degree: "BSc in Computer Science & Engineering",
    school: "Islamic University of Technology",
    schoolShort: "IUT",
    period: "2022 – 2026",
    cgpa: "3.78 / 4.00",
  },
};
