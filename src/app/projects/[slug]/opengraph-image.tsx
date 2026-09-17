import { ImageResponse } from "next/og";
import { getProject, projects } from "@/content";
import { OG_SIZE, OgCard } from "@/lib/og";

export const alt = "Project case study by Rifat Sarwar";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  return new ImageResponse(
    (
      <OgCard
        eyebrow={`Mission log · ${project?.period ?? ""}`}
        title={project?.title ?? "Project"}
        subtitle={project?.tagline ?? ""}
        footer="Rifat Sarwar · Full Stack Developer | AI & Robotics"
      />
    ),
    size,
  );
}
