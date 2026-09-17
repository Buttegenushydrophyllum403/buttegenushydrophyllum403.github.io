import { ArrowLeft, ArrowRight, Bot } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChatButton } from "@/components/chat/ChatButton";
import { Reveal } from "@/components/effects/Reveal";
import { SmartMedia } from "@/components/media/SmartMedia";
import { ArchitectureDiagram } from "@/components/projects/ArchitectureDiagram";
import { PhoneMockup } from "@/components/projects/PhoneMockup";
import { StoreBadges } from "@/components/projects/StoreBadges";
import { getProject, projects } from "@/content";
import { projectJsonLd } from "@/lib/seo";
import { accentVar } from "@/lib/utils";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.tagline,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title: `${project.title} · Rifat Sarwar`, description: project.tagline, url: `/projects/${project.slug}` },
  };
}

function Section({ n, title, children, color }: { n: number; title: string; children: React.ReactNode; color: string }) {
  return (
    <Reveal>
      <section className="grid gap-4 border-t border-border py-10 md:grid-cols-[14rem_1fr]" aria-labelledby={`section-${n}`}>
        <h2 id={`section-${n}`} className="font-display text-xl font-bold">
          <span className="mb-1 block font-mono text-xs tracking-widest" style={{ color }}>
            {String(n).padStart(2, "0")}
          </span>
          {title}
        </h2>
        <div className="space-y-3 text-lg">{children}</div>
      </section>
    </Reveal>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const color = accentVar[project.accent];
  const jsonLd = projectJsonLd(slug);
  let n = 0;

  return (
    <article className="container-page pt-12">
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}

      <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-text">
        <ArrowLeft size={16} aria-hidden /> All projects
      </Link>

      <header className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="eyebrow">
            <span style={{ color }}>Mission log</span> · {project.period}
          </p>
          <h1 className="mt-3 font-display text-5xl font-extrabold sm:text-6xl">{project.title}</h1>
          <p className="mt-4 text-xl text-muted">{project.tagline}</p>
          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:max-w-md">
            <div>
              <dt className="eyebrow">Role</dt>
              <dd className="mt-1 font-semibold">{project.role}</dd>
            </div>
            <div>
              <dt className="eyebrow">Where</dt>
              <dd className="mt-1 font-semibold">{project.org}</dd>
            </div>
            {project.status && (
              <div>
                <dt className="eyebrow">Status</dt>
                <dd className="mt-1 font-semibold" style={{ color }}>
                  {project.status}
                </dd>
              </div>
            )}
          </dl>
          <ul className="mt-6 flex flex-wrap gap-2">
            {project.badges.map((b) => (
              <li key={b} className="rounded-full border px-3 py-1 text-sm font-medium" style={{ borderColor: color }}>
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <StoreBadges links={project.storeLinks} />
          </div>
        </div>

        <div className="flex justify-center">
          {project.screenGroups.length > 0 ? (
            <PhoneMockup groups={project.screenGroups} title={project.title} />
          ) : (
            <div className="w-full overflow-hidden rounded-3xl border border-border shadow-card">
              <SmartMedia media={project.cover} priority sizes="(min-width: 1024px) 45vw, 100vw" />
            </div>
          )}
        </div>
      </header>

      {project.detailsPending && (
        <div className="mt-12 flex flex-col gap-3 rounded-2xl border border-dashed border-border bg-bg-soft p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted">
            <span className="font-semibold text-text">Full write-up in progress.</span> Want the details now? Ask the AI twin, or the real Rifat.
          </p>
          <ChatButton
            question={`Tell me more about ${project.title}.`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 font-semibold hover:border-primary"
          >
            <Bot size={17} className="text-primary" aria-hidden /> Ask about {project.title}
          </ChatButton>
        </div>
      )}

      <div className="mt-10">
        <Section n={++n} title="Mission brief" color={color}>
          {project.brief.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Section>
        <Section n={++n} title="My role" color={color}>
          <Bullets items={project.myRole} />
        </Section>
        {project.architecture && (
          <Section n={++n} title="Architecture" color={color}>
            <ArchitectureDiagram architecture={project.architecture} accent={project.accent} />
          </Section>
        )}
        <Section n={++n} title="Stack" color={color}>
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <li key={s} className="rounded-full bg-surface-2 px-3 py-1.5 text-base font-medium">
                {s}
              </li>
            ))}
          </ul>
        </Section>
        <Section n={++n} title="Results" color={color}>
          <Bullets items={project.results} />
        </Section>
        {project.sideways && project.sideways.length > 0 && (
          <Section n={++n} title="What went sideways" color={color}>
            <Bullets items={project.sideways} />
          </Section>
        )}
        {project.gallery.length > 0 && (
          <Section n={++n} title="Gallery" color={color}>
            <div className="grid gap-4 sm:grid-cols-2">
              {project.gallery.map((m) => (
                <figure key={m.alt} className="overflow-hidden rounded-2xl border border-border">
                  <SmartMedia media={m} sizes="(min-width: 640px) 40vw, 100vw" />
                  {m.caption && <figcaption className="px-3 py-2 text-sm text-muted">{m.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </Section>
        )}
      </div>

      <nav aria-label="More projects" className="mt-8 grid gap-4 border-t border-border pt-10 sm:grid-cols-2">
        <Link href={`/projects/${prev.slug}`} className="group rounded-2xl border border-border p-5 hover:border-primary">
          <span className="eyebrow inline-flex items-center gap-1">
            <ArrowLeft size={14} aria-hidden /> Previous mission
          </span>
          <span className="mt-1 block font-display text-xl font-bold group-hover:text-primary">{prev.title}</span>
        </Link>
        <Link href={`/projects/${next.slug}`} className="group rounded-2xl border border-border p-5 text-right hover:border-primary">
          <span className="eyebrow inline-flex items-center gap-1">
            Next mission <ArrowRight size={14} aria-hidden />
          </span>
          <span className="mt-1 block font-display text-xl font-bold group-hover:text-primary">{next.title}</span>
        </Link>
      </nav>
    </article>
  );
}
