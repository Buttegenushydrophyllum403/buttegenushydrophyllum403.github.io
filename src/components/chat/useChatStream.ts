"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/chat/validate";

const STORAGE_KEY = "rs-chat-history";

function loadHistory(): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as ChatMessage[]) : [];
    return Array.isArray(parsed) ? parsed.filter((m) => m && typeof m.content === "string") : [];
  } catch {
    return [];
  }
}

export type ChatStatus = "idle" | "waiting" | "streaming";

export function useChatStream() {
  const [messages, setMessages] = useState<ChatMessage[]>(loadHistory);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (status !== "idle") return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Storage unavailable: history just won't survive a reload.
    }
  }, [messages, status]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || status !== "idle") return;

      // Only send completed turns; drop a trailing empty assistant bubble if a previous reply failed.
      const history = messages.filter((m) => m.content.trim().length > 0);
      const outgoing: ChatMessage[] = [...history, { role: "user", content }];
      setMessages([...outgoing, { role: "assistant", content: "" }]);
      setStatus("waiting");

      const controller = new AbortController();
      abortRef.current = controller;

      const append = (chunk: string) =>
        setMessages((current) => {
          const next = current.slice();
          const last = next[next.length - 1];
          next[next.length - 1] = { ...last, content: last.content + chunk };
          return next;
        });

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: outgoing }),
          signal: controller.signal,
        });
        if (!res.body) {
          append(await res.text());
        } else {
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          setStatus("streaming");
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            append(decoder.decode(value, { stream: true }));
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          append("My connection to the mothership dropped. Try again?");
        }
      } finally {
        setMessages((current) => {
          const last = current[current.length - 1];
          // A stopped reply with no text becomes a short note so turns keep alternating.
          if (last?.role === "assistant" && !last.content.trim()) {
            return [...current.slice(0, -1), { role: "assistant", content: "(stopped)" }];
          }
          return current;
        });
        abortRef.current = null;
        setStatus("idle");
      }
    },
    [messages, status],
  );

  const stop = useCallback(() => abortRef.current?.abort(), []);
  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
  }, []);

  return { messages, status, send, stop, reset };
}
