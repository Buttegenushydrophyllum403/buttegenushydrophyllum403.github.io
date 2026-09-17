import { ArrowRight, Bot, Download } from "lucide-react";
import Link from "next/link";
import { ChatButton } from "@/components/chat/ChatButton";
import { Sparkles } from "@/components/effects/Sparkles";
import { SmartMedia } from "@/components/media/SmartMedia";
import { profile } from "@/content";
import { FuelGauge } from "./FuelGauge";
import { MascotDrone } from "./MascotDrone";

export function Hero() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
      <div className="grid-dots pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" aria-hidden />
      <div className="container-page relative grid items-center gap-14 pt-14 pb-20 md:grid-cols-[1.15fr_0.85fr] md:pt-24 md:pb-28">
        <div>
          <p className="eyebrow mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-mint" />
            </span>
            Systems online · {profile.location}
          </p>

          <h1 id="hero-title" className="font-display text-5xl leading-[1.02] font-extrabold sm:text-6xl lg:text-7xl">
            Hi, I&apos;m {profile.firstName}.
            <span className="mt-3 block text-3xl leading-tight font-bold text-muted sm:text-4xl lg:text-[2.6rem]">
              I build <span className="text-text">apps</span>, <span className="text-text">AI</span> and{" "}
              <Sparkles>
                <span className="text-gradient">robots that fly</span>
              </Sparkles>
              .
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-muted">
            {profile.title} · {profile.specialties}. {profile.intro[0]}
          </p>
          <p className="mt-3 max-w-xl font-mono text-sm text-muted">&ldquo;{profile.voice}&rdquo;</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ChatButton className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-white shadow-card transition-transform hover:-translate-y-0.5 dark:text-bg">
              <Bot size={19} aria-hidden /> Chat with my AI twin
            </ChatButton>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-3 font-semibold transition-colors hover:border-primary"
            >
              See projects <ArrowRight size={18} aria-hidden />
            </Link>
            <a href={profile.cvPath} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full px-4 py-3 font-semibold text-muted hover:text-text">
              <Download size={18} aria-hidden /> CV
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <MascotDrone />
          <div className="relative aspect-square overflow-hidden rounded-[2.5rem] border border-border bg-surface shadow-card [transform:rotate(2deg)]">
            <SmartMedia media={profile.headshot} priority sizes="(min-width: 768px) 384px, 90vw" />
          </div>
          <div className="absolute -bottom-10 -left-4 sm:-left-12">
            <FuelGauge />
          </div>
        </div>
      </div>
    </section>
  );
}
