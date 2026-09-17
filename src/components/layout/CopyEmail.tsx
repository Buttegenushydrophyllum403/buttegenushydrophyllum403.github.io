"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useSound } from "@/components/effects/SoundProvider";
import { SparkleStar } from "@/components/effects/Sparkles";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const { play } = useSound();

  return (
    <span className="inline-flex items-center gap-2">
      <a href={`mailto:${email}`} className="font-medium underline decoration-primary/40 underline-offset-4 hover:decoration-primary">
        {email}
      </a>
      <button
        type="button"
        className="relative grid size-8 place-items-center rounded-full hover:bg-surface-2"
        aria-label={copied ? "Email copied" : "Copy email address"}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            play("sparkle");
            window.setTimeout(() => setCopied(false), 1800);
          } catch {
            // Clipboard blocked: the mailto link still works.
          }
        }}
      >
        {copied ? <Check size={16} className="text-mint" /> : <Copy size={16} />}
        {copied && (
          <>
            <SparkleStar color="var(--gold-bright)" size={14} top="-30%" left="-20%" />
            <SparkleStar color="var(--primary)" size={12} top="60%" left="80%" />
          </>
        )}
      </button>
      <span role="status" className="sr-only">
        {copied ? "Email address copied" : ""}
      </span>
    </span>
  );
}
