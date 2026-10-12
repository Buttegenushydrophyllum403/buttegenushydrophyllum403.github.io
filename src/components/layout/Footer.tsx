import Link from "next/link";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { Rich } from "@/components/Rich";
import { profile, siteCopy } from "@/content";
import { CopyEmail } from "./CopyEmail";

const linkClass = "hover:text-primary hover:underline hover:decoration-wavy hover:underline-offset-4";

export function Footer() {
  const copy = siteCopy.footer;
  const built = new Date().toISOString().slice(0, 10);

  return (
    <footer className="mt-28 border-t-2 border-text bg-bg-soft">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-3">
          <p className="font-hand text-3xl font-bold">{profile.name}</p>
          <p className="max-w-sm text-muted">
            <Rich text={copy.tagline} />
          </p>
          <CopyEmail email={profile.email} copiedLabel={siteCopy.copied} />
        </div>

        <nav aria-label="Footer" className="space-y-2">
          <p className="eyebrow">{copy.indexTitle}</p>
          <ul className="space-y-1.5">
            {copy.index.map((item) => (
              <li key={item.href}>
                {/\.\w{2,4}$/.test(item.href) ? (
                  <a className={linkClass} href={item.href} target="_blank" rel="noopener">
                    {item.label}
                  </a>
                ) : (
                  <Link className={linkClass} href={item.href}>
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-2">
          <p className="eyebrow">{copy.elsewhereTitle}</p>
          <ul className="space-y-1.5">
            <li>
              <a className={`inline-flex items-center gap-2 ${linkClass}`} href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
                <LinkedInIcon size={16} /> LinkedIn
              </a>
            </li>
            {profile.links.github && (
              <li>
                <a className={`inline-flex items-center gap-2 ${linkClass}`} href={profile.links.github} target="_blank" rel="noopener noreferrer">
                  <GitHubIcon size={16} /> GitHub
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-dashed border-border">
        <div className="container-page space-y-1 py-5 font-mono text-xs text-muted">
          <p>
            compiled {built} · {copy.bugs} <span className="text-primary">{copy.bugsAside}</span> · © {new Date().getFullYear()} {profile.name}
          </p>
          <p className="font-sans text-sm">
            <Rich text={copy.disclaimer} />
          </p>
        </div>
      </div>
    </footer>
  );
}
