import Link from "next/link";
import { Fragment } from "react";
import { Rich } from "@/components/Rich";
import type { HomeCopy, SkillGroup } from "@/content";

function Heading({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-6 font-mono text-sm font-semibold tracking-wide first:mt-0">{children}</h3>;
}

/** Command-line flags in red, like a man page in a colour terminal. */
function Synopsis({ text }: { text: string }) {
  return (
    <>
      {text.split(/(--[a-z-]+)/).map((part, i) =>
        part.startsWith("--") ? (
          <span key={i} className="text-primary">
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

const linkClass = "underline decoration-primary underline-offset-4 hover:text-primary";

/** Skills, formatted as a Unix manual page. */
export function ManPage({ groups, copy }: { groups: SkillGroup[]; copy: HomeCopy["manPage"] }) {
  const [user, rest] = copy.prompt.split(":");
  return (
    <div className="border-2 border-text bg-surface font-mono text-[0.9rem] leading-relaxed shadow-card">
      <p className="border-b-2 border-text bg-surface-2 px-4 py-2 text-xs sm:px-6">
        <span className="text-mint">{user}</span>:<span className="text-sky">{rest}</span>
      </p>

      <div className="px-4 py-6 sm:px-8">
        <p className="mb-6 flex justify-between gap-4 text-xs text-muted" aria-hidden>
          <span>{copy.header[0]}</span>
          <span className="hidden sm:inline">{copy.header[1]}</span>
          <span>{copy.header[2]}</span>
        </p>

        <Heading>NAME</Heading>
        <p className="pl-6 sm:pl-10">{copy.name}</p>

        <Heading>SYNOPSIS</Heading>
        <p className="pl-6 sm:pl-10">
          <Synopsis text={copy.synopsis} />
        </p>

        <Heading>DESCRIPTION</Heading>
        <p className="pl-6 font-sans sm:pl-10">
          <Rich text={copy.description} />
        </p>

        <Heading>OPTIONS</Heading>
        <dl className="space-y-4 pl-6 sm:pl-10">
          {groups.map((g) => (
            <div key={g.id}>
              <dt>
                <span className="font-semibold text-primary">{g.flag}</span> <span className="text-muted">({g.title.toLowerCase()})</span>
              </dt>
              <dd className="pl-6 sm:pl-10">
                <p className="font-sans text-muted italic">{g.blurb}</p>
                <p>{g.skills.join(", ")}</p>
              </dd>
            </div>
          ))}
        </dl>

        <Heading>EXIT STATUS</Heading>
        <p className="pl-6 font-sans sm:pl-10">
          <Rich text={copy.exitStatus} />
        </p>

        <Heading>BUGS</Heading>
        <ul className="space-y-1 pl-6 font-sans sm:pl-10">
          {copy.bugs.map((bug) => (
            <li key={bug}>
              <Rich text={bug} />
            </li>
          ))}
        </ul>

        <Heading>SEE ALSO</Heading>
        <p className="pl-6 sm:pl-10">
          {copy.seeAlso.map((l, i) => (
            <Fragment key={l.href}>
              {i > 0 && ", "}
              {l.href.startsWith("/") ? (
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              ) : (
                <a href={l.href} className={linkClass}>
                  {l.label}
                </a>
              )}
            </Fragment>
          ))}
        </p>

        <p className="mt-8 flex justify-between gap-4 text-xs text-muted" aria-hidden>
          <span>{copy.footer[0]}</span>
          <span>{copy.footer[1]}</span>
          <span>{copy.footer[2]}</span>
        </p>
      </div>
    </div>
  );
}
