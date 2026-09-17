"use client";

import { useSound } from "@/components/effects/SoundProvider";
import { cn } from "@/lib/utils";
import { useChat } from "./ChatProvider";

type ChatButtonProps = {
  children: React.ReactNode;
  question?: string;
  className?: string;
};

/** Any button on the site that opens the AI twin, optionally asking a question straight away. */
export function ChatButton({ children, question, className }: ChatButtonProps) {
  const { openChat } = useChat();
  const { play } = useSound();
  return (
    <button
      type="button"
      className={cn("cursor-pointer", className)}
      onClick={() => {
        play("whoosh");
        openChat(question);
      }}
    >
      {children}
    </button>
  );
}
