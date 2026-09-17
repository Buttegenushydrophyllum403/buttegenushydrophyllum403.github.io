import { Download, GraduationCap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChatButton } from "@/components/chat/ChatButton";
import { Reveal } from "@/components/effects/Reveal";
import { SectionHeading } from "@/components/home/SectionHeading";
import { SmartMedia } from "@/components/media/SmartMedia";
import { achievements, journey, profile, skillGroups } from "@/content";

export const metadata: Metadata = {
  title: "About",
  description: `About ${profile.name}: ${profile.title} working across AI & Robotics, CSE graduate of IUT.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="container-page pt-16">
      <div className="grid gap-12 md:grid-cols-[1fr_20rem] md:items-start">
        <div>
          <p className="eyebrow mb-3">About</p>
          <h1 className="font-display text-5xl font-extrabold sm:text-6xl">
            Serious about the work. <span className="text-gradient">Not about myself.</span>
          </h1>
          <div className="mt-8 space-y-5 text-lg">
            {profile.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p>
              Before that I was an LLM developer at Megamind Tech (remote, Canada), getting language models to run offline and fine-tuned for specific jobs. At university I
              wrote software for IUT&apos;s Mars rover, Project Altair, which placed 6th in the world at the International Rover Challenge, and later led Project Aero, a drone team.
            </p>
            <p className="text-muted">&ldquo;{profile.voice}&rdquo;</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={profile.cvPath} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-white dark:text-bg">
              <Download size={18} aria-hidden /> Download CV
            </a>
            <ChatButton className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-3 font-semibold hover:border-primary">
              Ask my AI twin
            </ChatButton>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold text-muted hover:text-text">
              Contact
            </Link>
          </div>
        </div>
        <div className="overflow-hidden rounded-[2rem] border border-border shadow-card">
          <SmartMedia media={profile.headshot} sizes="320px" />
        </div>
      </div>

      <Reveal>
        <section className="mt-24" aria-labelledby="education-title">
          <SectionHeading id="education-title" eyebrow="Education" title="Where I learned to break things properly" />
          <div className="flex items-start gap-4 rounded-3xl border border-border bg-surface p-6 shadow-card">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
              <GraduationCap size={24} aria-hidden />
            </span>
            <div>
              <p className="font-display text-xl font-bold">{profile.education.degree}</p>
              <p className="text-muted">
                {profile.education.school} ({profile.education.schoolShort}) · {profile.education.period}
              </p>
              <p className="mt-2 font-mono text-sm">CGPA {profile.education.cgpa}</p>
            </div>
          </div>
        </section>
      </Reveal>

      <section className="mt-20" aria-labelledby="timeline-title">
        <SectionHeading id="timeline-title" eyebrow="Timeline" title="The short version" />
        <ol className="space-y-4 border-l-2 border-border pl-6">
          {journey.map((stop) => (
            <li key={stop.id} className="relative">
              <span className="absolute top-2 -left-[1.95rem] size-3 rounded-full border-2 border-bg bg-primary" aria-hidden />
              <p className="font-mono text-sm text-muted">{stop.period}</p>
              <p className="font-semibold">
                {stop.role} · {stop.org}
              </p>
              <p className="text-muted">{stop.summary}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-20 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl font-bold">Achievements</h2>
          <ul className="mt-4 space-y-3">
            {achievements.map((a) => (
              <li key={a.id} className="rounded-2xl border border-border bg-surface p-4">
                <p className="font-semibold">
                  {a.result} · {a.event}
                </p>
                {a.details.length > 0 && <p className="text-sm text-muted">{a.details.join(" · ")}</p>}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold">Skills</h2>
          <dl className="mt-4 space-y-4">
            {skillGroups.map((g) => (
              <div key={g.id}>
                <dt className="font-semibold">{g.title}</dt>
                <dd className="text-muted">{g.skills.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mt-20 rounded-3xl border border-dashed border-border bg-bg-soft p-6" aria-labelledby="colophon-title">
        <h2 id="colophon-title" className="font-display text-xl font-bold">
          How this site works
        </h2>
        <p className="mt-2 text-muted">
          Built with Next.js, TypeScript, Tailwind CSS and Motion, deployed on Vercel. The sounds are synthesized in your browser. The AI twin runs on Claude by Anthropic and only
          knows what&apos;s on this site. Design inspired by the playful, interactive school of personal websites.
        </p>
      </section>
    </div>
  );
}
