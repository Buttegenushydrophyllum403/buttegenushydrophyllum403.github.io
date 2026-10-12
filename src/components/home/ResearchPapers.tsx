import { FileText } from "lucide-react";
import { Rich } from "@/components/Rich";
import type { HomeCopy, Paper } from "@/content";
import { cn } from "@/lib/utils";

/** Each paper as a first page: venue line, title, the one number circled in red, then the TL;DR. */
export function ResearchPapers({ papers, copy }: { papers: Paper[]; copy: HomeCopy["research"] }) {
  return (
    <ol className="grid gap-8 md:grid-cols-2">
      {papers.map((p, i) => (
        <li key={p.id} className={cn("relative border border-border bg-surface p-6 shadow-card sm:p-8", i % 2 === 1 && "md:translate-y-10")}>
          <article aria-labelledby={`paper-${p.id}`}>
            <p className="flex flex-wrap justify-between gap-2 font-mono text-xs text-muted uppercase">
              <span>{p.venue}</span>
              <span>{p.year}</span>
            </p>
            <h3 id={`paper-${p.id}`} className="mt-3 font-display text-2xl leading-tight">
              {p.title}
            </h3>
            {(p.authors || p.note) && (
              <p className="mt-1 text-sm text-muted">{[p.authors?.join(", "), p.note].filter(Boolean).join(" · ")}</p>
            )}

            <div className="mt-6 flex items-center gap-4">
              <span className="relative shrink-0 px-3 py-1 font-display text-4xl text-primary">
                {p.headline.value}
                {/* A hand-drawn red-pen ring, never quite closed. */}
                <svg className="pointer-events-none absolute -inset-x-2 -inset-y-2 h-[calc(100%+1rem)] w-[calc(100%+1rem)]" viewBox="0 0 120 60" preserveAspectRatio="none" aria-hidden>
                  <path
                    d="M8 34C6 18 34 6 64 6s52 10 50 26-30 24-58 22S8 46 10 30C12 20 30 10 52 9"
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </span>
              <span className="text-sm leading-snug text-muted">{p.headline.label}</span>
            </div>

            <ul className="mt-6 space-y-2 text-[0.95rem]">
              {p.points.map((pt) => (
                <li key={pt} className="flex gap-2.5">
                  <span className="mt-[0.55rem] size-1 shrink-0 bg-text" aria-hidden />
                  <span>
                    <Rich text={pt} />
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-6 border-t border-dashed border-border pt-4">
              <span className="font-mono text-xs font-semibold text-muted uppercase">{copy.tldr} </span>
              <span className="hl font-hand text-xl">{p.tldr}</span>
            </p>
            <a
              href={p.pdf}
              target="_blank"
              rel="noopener"
              className="mt-5 inline-flex items-center gap-1.5 font-mono text-sm underline decoration-primary decoration-2 underline-offset-4 hover:text-primary"
            >
              <FileText size={15} aria-hidden /> {copy.pdfLink}
              <span className="sr-only">: {p.title}</span>
            </a>
          </article>
        </li>
      ))}
    </ol>
  );
}
