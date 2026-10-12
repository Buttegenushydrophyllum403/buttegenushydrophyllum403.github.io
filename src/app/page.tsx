import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/effects/Reveal";
import { Changelog } from "@/components/home/Changelog";
import { ChatTeaser } from "@/components/home/ChatTeaser";
import { Hero } from "@/components/home/Hero";
import { ManPage } from "@/components/home/ManPage";
import { Postcard } from "@/components/home/Postcard";
import { Receipt } from "@/components/home/Receipt";
import { ResearchPapers } from "@/components/home/ResearchPapers";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Ticker } from "@/components/home/Ticker";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { achievements, homeCopy, journey, projects, projectsPageCopy, research, skillGroups } from "@/content";

export default function HomePage() {
  const { sections } = homeCopy;
  return (
    <>
      <Hero />
      <Ticker />

      <section className="container-page scroll-mt-20 pt-24" id="changelog" aria-labelledby="changelog-title">
        <SectionHeading id="changelog-title" {...sections.changelog} />
        <Changelog stops={journey} copy={homeCopy.changelog} />
      </section>

      <section className="container-page pt-28" aria-labelledby="projects-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading id="projects-title" {...sections.shipped} className="mb-0" />
          <Link href="/projects" className="inline-flex items-center gap-1.5 font-mono text-sm underline decoration-primary decoration-2 underline-offset-4 hover:text-primary">
            {sections.shipped.allLink} <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} copy={projectsPageCopy.card} />
          ))}
        </div>
      </section>

      <section className="container-page scroll-mt-20 pt-28" id="research" aria-labelledby="research-title">
        <SectionHeading id="research-title" {...sections.research} />
        <ResearchPapers papers={research} copy={homeCopy.research} />
      </section>

      <section className="container-page pt-36" aria-labelledby="receipts-title">
        <SectionHeading id="receipts-title" {...sections.awards} />
        <Receipt achievements={achievements} copy={homeCopy.receipt} />
      </section>

      <section className="container-page pt-28" aria-labelledby="toolbox-title">
        <SectionHeading id="toolbox-title" {...sections.toolbox} />
        <ManPage groups={skillGroups} copy={homeCopy.manPage} />
      </section>

      <section className="container-page pt-28" aria-label={homeCopy.interview.title}>
        <Reveal>
          <ChatTeaser copy={homeCopy.interview} />
        </Reveal>
      </section>

      <section className="container-page pt-28" aria-label={homeCopy.postcard.heading}>
        <Reveal>
          <Postcard copy={homeCopy.postcard} />
        </Reveal>
      </section>
    </>
  );
}
