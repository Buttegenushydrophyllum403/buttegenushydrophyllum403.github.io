"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useSound } from "@/components/effects/SoundProvider";

export function CopyEmail({ email, copiedLabel }: { email: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);
  const { play } = useSound();

  return (
    <span className="inline-flex items-center gap-2">
      <a href={`mailto:${email}`} className="font-medium underline decoration-primary/40 underline-offset-4 hover:decoration-primary">
        {email}
      </a>
      <button
        type="button"
        className="relative grid size-8 place-items-center hover:text-primary"
        aria-label={copied ? "Email copied" : "Copy email address"}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            play("stamp");
            window.setTimeout(() => setCopied(false), 1800);
          } catch {
            // Clipboard blocked: the mailto link still works.
          }
        }}
      >
        {copied ? <Check size={16} className="text-mint" /> : <Copy size={16} />}
        {copied && (
          <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 -rotate-6 font-hand text-sm whitespace-nowrap text-primary" aria-hidden>
            {copiedLabel}
          </span>
        )}
      </button>
      <span role="status" className="sr-only">
        {copied ? "Email address copied" : ""}
      </span>
    </span>
  );
}
