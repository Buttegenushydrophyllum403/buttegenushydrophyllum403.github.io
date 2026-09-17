"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type ChatContextValue = {
  open: boolean;
  /** A question queued by a button elsewhere on the page, sent once the panel mounts. */
  pendingQuestion: string | null;
  openChat: (question?: string) => void;
  closeChat: () => void;
  consumePendingQuestion: () => string | null;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);

  const openChat = useCallback((question?: string) => {
    if (question) setPendingQuestion(question);
    setOpen(true);
  }, []);
  const closeChat = useCallback(() => setOpen(false), []);
  const consumePendingQuestion = useCallback(() => {
    const q = pendingQuestion;
    setPendingQuestion(null);
    return q;
  }, [pendingQuestion]);

  const value = useMemo(
    () => ({ open, pendingQuestion, openChat, closeChat, consumePendingQuestion }),
    [open, pendingQuestion, openChat, closeChat, consumePendingQuestion],
  );
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside <ChatProvider>");
  return ctx;
}
