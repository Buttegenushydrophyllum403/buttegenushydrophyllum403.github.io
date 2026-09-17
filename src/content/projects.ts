import type { z } from "zod";
import type { projectSchema } from "./schema";

/**
 * Case studies. Everything here is stated fact from Rifat's CV.
 * TODO(Rifat): add screenshots/photos (uncomment `src`), App Store links, and
 * richer detail (architecture specifics, measurable results, "what went sideways").
 * Set `detailsPending: false` once a case study is fleshed out.
 */
export const projects: z.input<typeof projectSchema>[] = [
  {
    slug: "genie-a",
    title: "GenieA",
    tagline: "A public-safety platform built with Sylhet Metropolitan Police: one app for citizens, one for police, and admin panels to run it all.",
    org: "Star Technologies",
    role: "Senior Software Engineer",
    period: "2025 – Present",
    category: "app",
    status: "Live",
    badges: ["10K+ downloads", "Play Store", "App Store"],
    accent: "primary",
    cover: { alt: "GenieA citizen app home screen", width: 1080, height: 2340, placeholder: "phone" },
    screenGroups: [
      {
        label: "Citizen app",
        screens: [
          { alt: "GenieA citizen app screen 1", width: 1080, height: 2340, placeholder: "phone" },
          { alt: "GenieA citizen app screen 2", width: 1080, height: 2340, placeholder: "phone" },
        ],
      },
      {
        label: "Police app",
        screens: [{ alt: "GenieA police app screen 1", width: 1080, height: 2340, placeholder: "phone" }],
      },
    ],
    gallery: [{ alt: "GenieA web admin panel", width: 1600, height: 1000, placeholder: "desktop", caption: "Admin panel" }],
    storeLinks: [
      { store: "play", href: "https://play.google.com/store/apps/details?id=com.startechnologies.genie_a&hl=en" },
      { store: "app" }, // TODO(Rifat): App Store URL
    ],
    brief: [
      "Built in collaboration with Sylhet Metropolitan Police in Bangladesh, GenieA connects citizens and police through dedicated apps.",
      "The platform has three parts: a citizen-side app, a police-side app, and web admin panels.",
    ],
    myRole: [
      "Developed the full-stack mobile applications and the web admin panels.",
      "Designed and ran the development workflow end to end, from visualization to production release.",
    ],
    architecture: {
      caption: "Three products, one platform.",
      stages: [
        { label: "People", nodes: ["Citizens", "Police officers", "Administrators"] },
        { label: "Apps", nodes: ["Citizen app", "Police app", "Web admin panels"] },
        { label: "Platform", nodes: ["Shared backend services"] },
      ],
    },
    stack: ["Mobile apps (Android & iOS)", "Web admin panels", "Backend services"],
    results: [
      "10K+ downloads on the Play Store.",
      "Live on both the Play Store and the App Store.",
    ],
    detailsPending: true,
  },
  {
    slug: "health-star",
    title: "Health Star",
    tagline: "An all-in-one healthcare app. I built the MVP from scratch, and it's still growing.",
    org: "Star Technologies",
    role: "Senior Software Engineer",
    period: "2025 – Present",
    category: "app",
    status: "MVP, in progress",
    badges: ["Built solo from scratch", "Play Store", "App Store"],
    accent: "mint",
    cover: { alt: "Health Star app home screen", width: 1080, height: 2340, placeholder: "phone" },
    screenGroups: [
      {
        label: "App",
        screens: [
          { alt: "Health Star app screen 1", width: 1080, height: 2340, placeholder: "phone" },
          { alt: "Health Star app screen 2", width: 1080, height: 2340, placeholder: "phone" },
        ],
      },
    ],
    storeLinks: [
      { store: "play", href: "https://play.google.com/store/apps/details?id=com.healthstarv3.app&hl=en" },
      { store: "app" }, // TODO(Rifat): App Store URL
    ],
    brief: ["Health Star is an all-in-one healthcare app, available on the Play Store and the App Store."],
    myRole: [
      "Built the MVP myself, from scratch.",
      "Development is ongoing.",
    ],
    stack: ["Mobile app (Android & iOS)", "Backend services"],
    results: ["MVP shipped to the Play Store and App Store.", "Currently under active development."],
    detailsPending: true,
  },
  {
    slug: "star-watch",
    title: "Star Watch",
    tagline: "Drone systems built from scratch, with sensors for autonomy and AI for mission planning.",
    org: "Star Technologies",
    role: "Project Manager / Developer",
    period: "Nov 2025 – Present",
    category: "robotics",
    status: "In progress",
    badges: ["Drones", "Autonomy", "AI mission planning"],
    accent: "sky",
    cover: { alt: "Star Watch drone in flight", width: 1600, height: 1000, placeholder: "drone" },
    gallery: [
      { alt: "Star Watch drone on the ground", width: 1600, height: 1000, placeholder: "drone" },
      { alt: "Star Watch live video stream", width: 1600, height: 1000, placeholder: "drone", kind: "video" },
    ],
    brief: [
      "Star Watch builds drone systems from scratch under Star Technologies.",
      "The goal is automation: drones that sense their surroundings and plan missions with AI.",
    ],
    myRole: [
      "Project manager and developer.",
      "Working hands-on with MAVLink, ROS, ArduPilot and WebRTC video streaming.",
    ],
    architecture: {
      caption: "From sensors to missions.",
      stages: [
        { label: "Sense", nodes: ["LiDAR", "Optical flow", "Sonar"] },
        { label: "Fly", nodes: ["ROS", "MAVLink", "ArduPilot"] },
        { label: "Plan & stream", nodes: ["AI mission planning", "WebRTC video"] },
      ],
    },
    stack: ["MAVLink", "ROS", "ArduPilot", "WebRTC", "LiDAR", "Optical flow", "Sonar"],
    results: ["Work in progress. Watch this space (and the sky)."],
    detailsPending: true,
  },
  {
    slug: "project-altair",
    title: "Project Altair",
    tagline: "IUT's Mars rover. I worked on the software that made it drive, see, grab and navigate on its own.",
    org: "Islamic University of Technology",
    role: "Software Sub-team Senior Developer",
    period: "2023 – 2024",
    category: "robotics",
    status: "6th globally at IRC",
    badges: ["IRC: 6th globally", "ERC: 16th globally", "URC competitor"],
    accent: "gold",
    cover: { alt: "The Altair Mars rover", width: 1600, height: 1000, placeholder: "rover" },
    gallery: [
      { alt: "Altair rover robotic arm grasping an object", width: 1600, height: 1000, placeholder: "rover", kind: "video" },
      { alt: "Team Altair at competition", width: 1600, height: 1000, placeholder: "rover" },
    ],
    brief: [
      "Project Altair is IUT's Mars rover team, competing in international rover challenges.",
      "The rover needed four-wheel drive, a six-joint robotic arm, vision to recognise objects, and autonomous navigation.",
    ],
    myRole: [
      "Senior developer on the software sub-team.",
      "Implemented the four-wheel drive and 6-joint arm control systems.",
      "Built inverse kinematics for precise arm manipulation.",
      "Trained object recognition models on a custom dataset and used them to drive grasping.",
      "Built autonomous navigation with real-time obstacle avoidance.",
    ],
    architecture: {
      caption: "See it, reach it, grab it, drive on.",
      stages: [
        { label: "Perceive", nodes: ["Object recognition (custom dataset)", "Obstacle detection"] },
        { label: "Decide", nodes: ["Inverse kinematics", "Autonomous navigation"] },
        { label: "Act", nodes: ["6-joint arm & grasping", "Four-wheel drive"] },
      ],
    },
    stack: ["Robot control", "Inverse kinematics", "Computer vision", "Autonomous navigation"],
    results: [
      "International Rover Challenge: 6th globally, 1st in Bangladesh, 1st in the Science Task.",
      "European Rover Challenge: 16th globally.",
      "Competed at the University Rover Challenge.",
    ],
    detailsPending: true,
  },
  {
    slug: "project-aero",
    title: "Project Aero",
    tagline: "A drone team I led: flight control, real-time computer vision, and 3D maps built from footage.",
    org: "Project Aero",
    role: "Team Lead",
    period: "2024 – 2025",
    category: "robotics",
    badges: ["Team lead", "Computer vision", "3D mapping"],
    accent: "sky",
    cover: { alt: "Project Aero drone", width: 1600, height: 1000, placeholder: "drone" },
    gallery: [
      { alt: "Real-time object detection from the drone camera", width: 1600, height: 1000, placeholder: "drone", kind: "video" },
      { alt: "3D map reconstructed from drone footage", width: 1600, height: 1000, placeholder: "drone" },
    ],
    brief: ["Project Aero is a drone team working on flight control, navigation and aerial computer vision."],
    myRole: [
      "Led the team.",
      "Worked on flight control and navigation.",
      "Built CV pipelines for real-time object detection and tracking.",
      "Created 3D maps of environments from drone footage.",
    ],
    architecture: {
      caption: "Fly, see, map.",
      stages: [
        { label: "Fly", nodes: ["Flight control", "Navigation"] },
        { label: "See", nodes: ["Real-time detection", "Tracking"] },
        { label: "Map", nodes: ["3D mapping from footage"] },
      ],
    },
    stack: ["Flight control", "Navigation", "Computer vision", "Object tracking", "3D mapping"],
    results: ["Real-time detection and tracking pipelines, plus 3D environment maps from drone footage."],
    detailsPending: true,
  },
  {
    slug: "megamind-llm",
    title: "Offline LLMs at Megamind",
    tagline: "Making large language models run offline, fine-tuned for specific tasks, on hardware that isn't a data centre.",
    org: "Megamind Tech (Remote, Canada)",
    role: "LLM Developer / ML Engineer",
    period: "Feb 2024 – Jul 2024",
    category: "ai",
    badges: ["LLMs", "Fine-tuning", "Edge deployment"],
    accent: "primary",
    cover: { alt: "Diagram of an offline LLM pipeline", width: 1600, height: 1000, placeholder: "brain" },
    brief: [
      "Megamind Tech needed large language models that work offline and fit task-specific applications.",
      "That meant fine-tuning models and squeezing inference into resource-constrained environments.",
    ],
    myRole: [
      "Ran offline inference and fine-tuning of large language models.",
      "Optimized deployment pipelines for resource-constrained environments.",
      "Contributed to custom fine-tuning workflows for task-specific applications.",
    ],
    architecture: {
      caption: "From general model to task-specific, offline assistant.",
      stages: [
        { label: "Adapt", nodes: ["Base LLM", "Custom fine-tuning"] },
        { label: "Optimize", nodes: ["Deployment pipeline for constrained hardware"] },
        { label: "Run", nodes: ["Offline inference"] },
      ],
    },
    stack: ["Large language models", "Fine-tuning", "Offline inference", "Deployment pipelines"],
    results: ["Delivered fine-tuning and offline inference workflows for task-specific applications."],
    detailsPending: true,
  },
];
