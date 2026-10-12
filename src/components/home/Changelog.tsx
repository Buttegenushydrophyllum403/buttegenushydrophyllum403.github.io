import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Rich } from "@/components/Rich";
import type { HomeCopy, JourneyStop } from "@/content";

/** The career as a CHANGELOG.md, newest release first. */
export function Changelog({ stops, copy }: { stops: JourneyStop[]; copy: HomeCopy["changelog"] }) {
  const releases = [...stops].reverse();

  return (
    <div className="overflow-hidden border-2 border-text bg-surface shadow-card">
      {/* Editor chrome */}
      <div className="flex items-center justify-between gap-3 border-b-2 border-text bg-surface-2 px-4 py-2 font-mono text-xs">
        <span className="flex items-center gap-2">
          <span className="inline-block size-2.5 rounded-full bg-primary" aria-hidden />
          {copy.repo} · <span className="font-semibold">{copy.file}</span>
        </span>
        <span className="hidden text-muted sm:inline">{copy.tagline}</span>
      </div>

      <div className="px-4 py-6 sm:px-8">
        <p className="font-mono text-sm text-muted">
          <Rich text={copy.preamble} />
        </p>

        <section className="mt-8 border-l-4 border-dashed border-mint pl-4" aria-labelledby="release-unreleased">
          <h3 id="release-unreleased" className="font-mono text-lg font-semibold">
            ## [Unreleased]
          </h3>
          <p className="mt-1">
            <Rich text={copy.unreleasedText} />
          </p>
        </section>

        <ol className="mt-4">
          {releases.map((r) => (
            <li key={r.id} className="border-t border-dashed border-border py-7 first:border-t-0">
              <article aria-labelledby={`release-${r.id}`}>
                <h3 id={`release-${r.id}`} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-lg font-semibold">
                  <span>
                    ## [<span className="text-primary">{r.version}</span>]
                  </span>
                  <span className="text-sm font-normal text-muted">— {r.period}</span>
                  {r.current && <span className="border border-mint px-1.5 text-xs font-normal text-mint uppercase">{copy.current}</span>}
                </h3>
                <p className="mt-2 font-display text-2xl leading-tight">
                  {r.role} <span className="text-muted">@</span> {r.org}
                  {r.orgNote && <span className="text-base text-muted"> ({r.orgNote})</span>}
                </p>
                <p className="mt-1 text-muted">
                  <Rich text={r.summary} />
                </p>

                <p className="mt-4 font-mono text-sm font-semibold">### {copy.added}</p>
                <ul className="mt-1 space-y-1">
                  {r.highlights.map((h) => (
                    <li key={h} className="flex gap-2.5">
                      <span className="font-mono text-mint" aria-hidden>
                        +
                      </span>
                      <span>
                        <Rich text={h} />
                      </span>
                    </li>
                  ))}
                </ul>

                {r.knownIssues && (
                  <>
                    <p className="mt-4 font-mono text-sm font-semibold">### {copy.knownIssues}</p>
                    <p className="mt-1 font-hand text-lg leading-snug text-primary">
                      <Rich text={r.knownIssues} />
                    </p>
                  </>
                )}

                {r.projectSlug && (
                  <Link href={`/projects/${r.projectSlug}`} className="mt-4 inline-flex items-center gap-1 font-mono text-sm underline decoration-primary decoration-2 underline-offset-4 hover:text-primary">
                    {copy.caseStudyLink} <ArrowUpRight size={15} aria-hidden />
                    <span className="sr-only">: {r.org}</span>
                  </Link>
                )}
              </article>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
