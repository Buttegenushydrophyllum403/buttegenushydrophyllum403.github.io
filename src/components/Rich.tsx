import Link from "next/link";
import { Fragment } from "react";

/**
 * Renders a content string with a few inline markers (documented in content/README.md):
 *   ==highlight==   ~~strike~~   **bold**   *italic*   `code`   [label](/path or https://…)   [^1] footnote
 * Markers don't nest. Everything else is plain text; HTML is never interpreted.
 */
const TOKEN = /(==[^=\n]+==|~~[^~\n]+~~|\*\*[^*\n]+\*\*|\*[^*\s][^*\n]*\*|`[^`\n]+`|\[\^\d+\]|\[[^\]\n]+\]\([^)\s]+\))/g;

const linkClass = "text-primary underline decoration-2 underline-offset-4 hover:decoration-wavy";

export function Rich({ text, footnote }: { text: string; footnote?: (n: number) => React.ReactNode }) {
  return (
    <>
      {text.split(TOKEN).map((part, i) => {
        if (i % 2 === 0) return part ? <Fragment key={i}>{part}</Fragment> : null;
        if (part.startsWith("==")) return <span key={i} className="hl">{part.slice(2, -2)}</span>;
        if (part.startsWith("~~")) return <span key={i} className="struck">{part.slice(2, -2)}</span>;
        if (part.startsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
        if (part.startsWith("`")) return <code key={i} className="font-mono text-[0.92em]">{part.slice(1, -1)}</code>;
        if (part.startsWith("[^")) {
          const n = Number(part.slice(2, -1));
          return <Fragment key={i}>{footnote ? footnote(n) : <sup>{n}</sup>}</Fragment>;
        }
        if (part.startsWith("[")) {
          const [, label, href] = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part) ?? [];
          if (/^https?:\/\//.test(href)) {
            return (
              <a key={i} href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {label}
              </a>
            );
          }
          // PDFs and other files are opened directly, not routed.
          if (/\.\w{2,4}$/.test(href)) {
            return (
              <a key={i} href={href} target="_blank" rel="noopener" className={linkClass}>
                {label}
              </a>
            );
          }
          return (
            <Link key={i} href={href} className={linkClass}>
              {label}
            </Link>
          );
        }
        return <em key={i}>{part.slice(1, -1)}</em>;
      })}
    </>
  );
}
