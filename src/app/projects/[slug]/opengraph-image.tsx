import { ImageResponse } from "next/og";
import { getProject, projects, siteCopy } from "@/content";
import { OG_SIZE, OgCard } from "@/lib/og";

export const alt = "Project case study by Rifat Sarwar";
export const size = OG_SIZE;
export const contentType = "image/png";
// Rendered once at build time (the site is a static export).
export const dynamic = "force-static";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  return new ImageResponse(
    (
      <OgCard
        eyebrow={`${siteCopy.ogImage.projectEyebrow} · ${project?.period ?? ""}`}
        title={project?.title ?? "Project"}
        subtitle={project?.tagline ?? ""}
        footer={siteCopy.ogImage.projectFooter}
      />
    ),
    size,
  );
}
