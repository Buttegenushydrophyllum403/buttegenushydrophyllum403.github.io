"use client";

import { useEffect } from "react";

let printed = false;

/** A note for whoever opens DevTools. Engineers check the console first; so do I. */
export function DevConsoleNote({ email, title, body }: { email: string; title: string; body: string }) {
  useEffect(() => {
    if (printed) return;
    printed = true;
    console.log(
      `%c${title}%c\n\n${body} %s\n\n// rifat`,
      "font: 700 15px Georgia, serif; color: #b8321c;",
      "font: 13px ui-monospace, monospace;",
      email,
    );
  }, [email, title, body]);
  return null;
}
