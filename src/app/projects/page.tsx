import type { Metadata } from "next";
import { SectionHeading } from "@/components/home/SectionHeading";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { projects } from "@/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Case studies: GenieA, Health Star, Star Watch, Project Altair, Project Aero and offline LLM work.",
  alternates: { canonical: "/projects" },
};

const GROUPS = [
  { id: "app", title: "Apps", intro: "Shipped to real phones, used by real people." },
  { id: "ai", title: "AI", intro: "Language models that work without the cloud." },
  { id: "robotics", title: "Robotics", intro: "Rovers and drones. The fun kind of debugging." },
] as const;

export default function ProjectsPage() {
  return (
    <div className="container-page pt-16">
      <SectionHeading
        eyebrow="Mission archive"
        title={<span className="text-5xl sm:text-6xl">Projects</span>}
        intro="Every mission, with the brief, what I actually did, and how it turned out."
      />
      {GROUPS.map((group) => {
        const items = projects.filter((p) => p.category === group.id);
        if (!items.length) return null;
        return (
          <section key={group.id} className="mt-14" aria-labelledby={`group-${group.id}`}>
            <div className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h2 id={`group-${group.id}`} className="font-display text-2xl font-bold">
                {group.title}
              </h2>
              <p className="text-muted">{group.intro}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p, i) => (
                <ProjectCard key={p.slug} project={p} index={i} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
