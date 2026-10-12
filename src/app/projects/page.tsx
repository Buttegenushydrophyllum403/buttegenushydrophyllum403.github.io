import type { Metadata } from "next";
import { SectionHeading } from "@/components/home/SectionHeading";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { projects, projectsPageCopy as copy } from "@/content";

export const metadata: Metadata = {
  title: "Projects",
  description: copy.metaDescription,
  alternates: { canonical: "/projects" },
};

const GROUPS = (["app", "ai", "robotics"] as const).map((id) => ({ id, ...copy.groups[id] }));

export default function ProjectsPage() {
  return (
    <div className="container-page pt-16">
      <SectionHeading
        eyebrow={copy.eyebrow}
        title={<span className="text-6xl sm:text-7xl">{copy.title}</span>}
        intro={copy.intro}
        aside={copy.aside}
      />
      {GROUPS.map((group) => {
        const items = projects.filter((p) => p.category === group.id);
        if (!items.length) return null;
        return (
          <section key={group.id} className="mt-14" aria-labelledby={`group-${group.id}`}>
            <div className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h2 id={`group-${group.id}`} className="font-display text-3xl">
                {group.title}
              </h2>
              <p className="font-hand text-lg text-primary">{group.intro}</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p, i) => (
                <ProjectCard key={p.slug} project={p} index={i} copy={copy.card} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
