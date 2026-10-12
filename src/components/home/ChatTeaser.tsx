import { ChatButton } from "@/components/chat/ChatButton";
import { Rich } from "@/components/Rich";
import type { HomeCopy } from "@/content";

/** A sticky note of interview questions. Ticking one opens the AI twin with that question. */
export function ChatTeaser({ copy }: { copy: HomeCopy["interview"] }) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-[1fr_1fr]">
      <div>
        <p className="eyebrow mb-2">
          <span className="text-primary">§</span> {copy.eyebrow}
        </p>
        <h2 className="font-display text-4xl sm:text-5xl">
          <Rich text={copy.title} />
        </h2>
        {copy.intro && (
          <p className="mt-4 text-lg text-muted">
            <Rich text={copy.intro} />
          </p>
        )}
        <p className="mt-4 font-hand text-xl text-primary">{copy.hint}</p>
      </div>

      <div className="relative mx-auto w-full max-w-md rotate-1 bg-[#fff2a8] p-7 pt-9 text-[#2b2a1f] shadow-[3px_6px_14px_-4px_rgb(0_0_0/0.35)]">
        <span className="tape -top-3 left-8 -rotate-6" aria-hidden />
        <p className="font-hand text-2xl font-bold">{copy.noteTitle}</p>
        <ul className="mt-3 space-y-2">
          {copy.questions.map((q) => (
            <li key={q}>
              <ChatButton question={q} className="group flex w-full items-start gap-3 text-left font-hand text-xl leading-snug">
                <span className="mt-1 grid size-5 shrink-0 place-items-center border-2 border-[#2b2a1f] text-sm leading-none" aria-hidden>
                  <span className="opacity-0 transition-opacity group-hover:opacity-100">✓</span>
                </span>
                <span className="decoration-[#b8321c] decoration-2 group-hover:underline">{q}</span>
              </ChatButton>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
