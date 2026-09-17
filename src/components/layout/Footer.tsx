import Link from "next/link";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { profile } from "@/content";
import { CopyEmail } from "./CopyEmail";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-bg-soft">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-3">
          <p className="font-display text-xl font-bold">{profile.name}</p>
          <p className="max-w-sm text-muted">
            {profile.title} · {profile.specialties}. Built with Next.js, curiosity and occasional panic.
          </p>
          <CopyEmail email={profile.email} />
        </div>

        <nav aria-label="Footer" className="space-y-2">
          <p className="eyebrow">Explore</p>
          <ul className="space-y-1.5">
            <li><Link className="hover:text-primary" href="/projects">Projects</Link></li>
            <li><Link className="hover:text-primary" href="/#journey">Journey</Link></li>
            <li><Link className="hover:text-primary" href="/about">About</Link></li>
            <li><Link className="hover:text-primary" href="/contact">Contact</Link></li>
            <li><a className="hover:text-primary" href={profile.cvPath} target="_blank" rel="noopener">Download CV</a></li>
          </ul>
        </nav>

        <div className="space-y-2">
          <p className="eyebrow">Elsewhere</p>
          <ul className="space-y-1.5">
            <li>
              <a className="inline-flex items-center gap-2 hover:text-primary" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
                <LinkedInIcon size={16} /> LinkedIn
              </a>
            </li>
            {profile.links.github && (
              <li>
                <a className="inline-flex items-center gap-2 hover:text-primary" href={profile.links.github} target="_blank" rel="noopener noreferrer">
                  <GitHubIcon size={16} /> GitHub
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="container-page py-5 text-sm text-muted">
          The AI twin is an AI, not actually Rifat, and it can be wrong. Chat messages are sent to Anthropic to generate replies and are not stored by this site.
          © {new Date().getFullYear()} {profile.name}.
        </p>
      </div>
    </footer>
  );
}
