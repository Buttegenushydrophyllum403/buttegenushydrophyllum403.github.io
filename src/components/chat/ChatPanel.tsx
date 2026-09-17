"use client";

import { ArrowUp, Bot, RotateCcw, Square, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useSound } from "@/components/effects/SoundProvider";
import { MAX_INPUT_CHARS } from "@/lib/chat/validate";
import { cn } from "@/lib/utils";
import { useChat } from "./ChatProvider";
import { SafeText } from "./SafeText";
import { useChatStream } from "./useChatStream";

export const SUGGESTED_QUESTIONS = [
  "What did you build for Sylhet Metropolitan Police?",
  "How did a Mars rover team place 6th in the world?",
  "What's Star Watch?",
  "Why should I hire you?",
  "What's your tech stack?",
];

export default function ChatPanel() {
  const { closeChat, consumePendingQuestion, pendingQuestion } = useChat();
  const { messages, status, send, stop, reset } = useChatStream();
  const { play } = useSound();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const busy = status !== "idle";

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!pendingQuestion || busy) return;
    const q = consumePendingQuestion();
    if (q) void send(q);
  }, [pendingQuestion, busy, consumePendingQuestion, send]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeChat();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeChat]);

  const submit = (text: string) => {
    if (!text.trim() || busy) return;
    play("send");
    setInput("");
    void send(text);
  };

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");

  return (
    <motion.div
      role="dialog"
      aria-labelledby="chat-title"
      aria-modal="false"
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="fixed inset-x-2 bottom-2 z-50 flex max-h-[85dvh] flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl sm:inset-x-auto sm:right-5 sm:bottom-5 sm:h-[36rem] sm:w-[25rem]"
    >
      <div className="flex items-center gap-3 border-b border-border bg-bg-soft px-4 py-3">
        <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-primary to-gold-bright text-white">
          <Bot size={18} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p id="chat-title" className="font-display font-bold leading-tight">
            Rifat&apos;s AI twin
          </p>
          <p className="font-mono text-[0.68rem] tracking-wide text-muted uppercase">AI · not actually Rifat</p>
        </div>
        {messages.length > 0 && (
          <button type="button" onClick={reset} className="grid size-9 place-items-center rounded-full hover:bg-surface-2" aria-label="Start a new conversation" title="New conversation">
            <RotateCcw size={17} />
          </button>
        )}
        <button type="button" onClick={closeChat} className="grid size-9 place-items-center rounded-full hover:bg-surface-2" aria-label="Close chat">
          <X size={19} />
        </button>
      </div>

      <div ref={logRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="space-y-4">
            <p className="rounded-2xl rounded-tl-sm bg-surface-2 px-4 py-3 text-[0.95rem]">
              Hey, I&apos;m Rifat&apos;s AI twin. Same facts, fewer coffee breaks. Ask me about rovers, drones, apps or why you should hire me. Anything I don&apos;t know, I&apos;ll send you to the real one.
            </p>
            <ul className="flex flex-wrap gap-2" aria-label="Suggested questions">
              {SUGGESTED_QUESTIONS.map((q) => (
                <li key={q}>
                  <button
                    type="button"
                    onClick={() => submit(q)}
                    className="rounded-full border border-border px-3 py-1.5 text-left text-sm transition-colors hover:border-primary hover:text-primary"
                  >
                    {q}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <p
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-[0.95rem] leading-relaxed whitespace-pre-wrap",
                m.role === "user" ? "rounded-br-sm bg-primary text-white dark:text-bg" : "rounded-tl-sm bg-surface-2",
              )}
            >
              {m.role === "assistant" ? (
                m.content ? (
                  <SafeText text={m.content} />
                ) : (
                  <span className="inline-flex items-center gap-1 font-mono text-sm text-muted" aria-label="Thinking">
                    thinking<span className="animate-blink">_</span>
                  </span>
                )
              ) : (
                m.content
              )}
            </p>
          </div>
        ))}
      </div>

      <div aria-live="polite" className="sr-only">
        {status === "idle" && lastAssistant ? lastAssistant.content : ""}
      </div>

      <form
        className="border-t border-border p-3"
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
      >
        <div className="flex items-end gap-2 rounded-2xl border border-border bg-bg px-3 py-2 focus-within:border-primary">
          <label htmlFor="chat-input" className="sr-only">
            Message the AI twin
          </label>
          <textarea
            id="chat-input"
            ref={inputRef}
            rows={1}
            value={input}
            maxLength={MAX_INPUT_CHARS}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit(input);
              }
            }}
            placeholder="Ask me anything (about Rifat)…"
            className="max-h-32 min-h-6 flex-1 resize-none bg-transparent py-1 outline-none placeholder:text-muted focus-visible:outline-none"
          />
          {busy ? (
            <button type="button" onClick={stop} className="grid size-9 shrink-0 place-items-center rounded-full bg-text text-bg" aria-label="Stop reply">
              <Square size={14} fill="currentColor" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-white transition-opacity disabled:opacity-40 dark:text-bg"
              aria-label="Send message"
            >
              <ArrowUp size={18} />
            </button>
          )}
        </div>
        <p className="mt-2 px-1 text-[0.7rem] text-muted">Messages go to Anthropic to generate replies; this site doesn&apos;t store them.</p>
      </form>
    </motion.div>
  );
}
