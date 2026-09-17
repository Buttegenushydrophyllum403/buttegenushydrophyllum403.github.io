import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/effects/Reveal";
import { ChatTeaser } from "@/components/home/ChatTeaser";
import { Hero } from "@/components/home/Hero";
import { JourneyPath } from "@/components/home/JourneyPath";
import { SectionHeading } from "@/components/home/SectionHeading";
import { TelemetryStrip } from "@/components/home/TelemetryStrip";
import { Toolbox } from "@/components/home/Toolbox";
import { TrophyShelf } from "@/components/home/TrophyShelf";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { achievements, journey, projects, skillGroups } from "@/content";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TelemetryStrip />

      <section className="container-page scroll-mt-20 pt-24" id="journey" aria-labelledby="journey-title">
        <SectionHeading
          id="journey-title"
          eyebrow="Flight log · 2022 → now"
          title="From rovers to rotors"
          intro="My career started on the ground with a Mars rover and then, quite literally, took off. Scroll to fly the route."
        />
        <JourneyPath stops={journey} />
      </section>

      <section className="container-page pt-28" aria-labelledby="projects-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            id="projects-title"
            eyebrow="Missions"
            title="Things I've shipped (and flown)"
            intro="Apps in people's pockets, models running offline, and machines that move."
            className="mb-0"
          />
          <Link href="/projects" className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline">
            All projects <ArrowRight size={17} aria-hidden />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </section>

      <section className="container-page pt-28" aria-labelledby="trophies-title">
        <SectionHeading id="trophies-title" eyebrow="Trophy shelf" title="Scoreboard" intro="Mostly earned with a rover, some sleep deprivation, and a very patient team." />
        <TrophyShelf achievements={achievements} />
      </section>

      <section className="container-page pt-24" aria-labelledby="toolbox-title">
        <SectionHeading id="toolbox-title" eyebrow="Toolbox" title="What I work with" intro="Hover the chips. They like it." />
        <Toolbox groups={skillGroups} />
      </section>

      <section className="container-page pt-28" aria-label="Chat with my AI twin">
        <Reveal>
          <ChatTeaser />
        </Reveal>
      </section>

      <section className="container-page pt-24 text-center" aria-labelledby="contact-title">
        <Reveal>
          <p className="eyebrow mb-3">Mission control</p>
          <h2 id="contact-title" className="font-display text-4xl font-extrabold sm:text-5xl">
            Got something worth building?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
            Apps, AI, or anything with propellers. Send a message and the real Rifat (not the AI twin) will get back to you.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-lg font-semibold text-white shadow-card transition-transform hover:-translate-y-0.5 dark:text-bg"
          >
            <Mail size={20} aria-hidden /> Get in touch
          </Link>
        </Reveal>
      </section>
    </>
  );
}
