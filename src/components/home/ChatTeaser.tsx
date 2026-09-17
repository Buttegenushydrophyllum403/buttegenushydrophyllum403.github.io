import { Bot } from "lucide-react";
import { ChatButton } from "@/components/chat/ChatButton";

const QUESTIONS = [
  "What did you build for Sylhet Metropolitan Police?",
  "How did a Mars rover team place 6th in the world?",
  "Why should I hire you?",
  "What's your salary expectation?",
];

export function ChatTeaser() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-primary-soft via-surface to-surface p-7 shadow-card sm:p-10">
      <div className="grid gap-8 md:grid-cols-[1fr_1.1fr] md:items-center">
        <div>
          <p className="eyebrow mb-3">Chat · AI twin</p>
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Interview my AI twin</h2>
          <p className="mt-3 text-lg text-muted">
            It knows everything on this site, is mildly sarcastic, and refuses to make things up. Ask it the tough ones. It will tell you when you need the real me.
          </p>
        </div>
        <ul className="space-y-2.5">
          {QUESTIONS.map((q) => (
            <li key={q}>
              <ChatButton
                question={q}
                className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-left font-medium transition-all hover:-translate-y-0.5 hover:border-primary"
              >
                <Bot size={18} className="shrink-0 text-primary" aria-hidden />
                {q}
              </ChatButton>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
