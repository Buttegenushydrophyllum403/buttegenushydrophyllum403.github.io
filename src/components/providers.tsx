"use client";

import { MotionConfig } from "motion/react";
import { ThemeProvider } from "next-themes";
import { ChatProvider } from "@/components/chat/ChatProvider";
import { SoundProvider } from "@/components/effects/SoundProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <MotionConfig reducedMotion="user">
        <SoundProvider>
          <ChatProvider>{children}</ChatProvider>
        </SoundProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}
