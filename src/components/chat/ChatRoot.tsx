"use client";

import { Bot } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { Boop } from "@/components/effects/Boop";
import { useSound } from "@/components/effects/SoundProvider";
import { useChat } from "./ChatProvider";

const ChatPanel = dynamic(() => import("./ChatPanel"), { ssr: false });

/** Floating launcher + lazily loaded chat panel, mounted once in the root layout. */
export function ChatRoot() {
  const { open, openChat } = useChat();
  const { play } = useSound();
  const launcherRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  // Deep link: /?chat=open
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("chat") === "open") openChat();
  }, [openChat]);

  // Return focus to the launcher when the panel closes.
  useEffect(() => {
    if (wasOpen.current && !open) launcherRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            ref={launcherRef}
            type="button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            onClick={() => {
              play("whoosh");
              openChat();
            }}
            className="group fixed right-4 bottom-4 z-40 flex items-center gap-2 rounded-full bg-gradient-to-br from-primary to-[color-mix(in_oklab,var(--primary),var(--gold-bright)_45%)] py-3 pr-5 pl-3.5 font-semibold text-white shadow-xl sm:right-6 sm:bottom-6 dark:text-bg"
            aria-label="Chat with Rifat's AI twin"
          >
            <Boop rotation={20} scale={1.1} timing={200} sound="beep">
              <span className="grid size-8 place-items-center rounded-full bg-white/20">
                <Bot size={19} aria-hidden />
              </span>
            </Boop>
            <span className="hidden sm:inline">Ask my AI twin</span>
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>{open && <ChatPanel key="chat" />}</AnimatePresence>
    </>
  );
}
