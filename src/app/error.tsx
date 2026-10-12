"use client";

import { RotateCcw } from "lucide-react";
import { DroneIcon } from "@/components/icons";
import { btnPrimary } from "@/lib/utils";
// The raw JSON, not "@/content": this client file shouldn't pull every page's text into the browser.
// content/errors.json is still validated at build time by "@/content".
import errorsJson from "../../content/errors.json";

const copy = errorsJson.error;

export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <p className="stamp -rotate-6 text-primary">{copy.stamp}</p>
      <div className="mt-8 rotate-12">
        <DroneIcon size={96} className="text-text" />
      </div>
      <h1 className="mt-6 font-display text-4xl">{copy.title}</h1>
      <p className="mt-4 max-w-md text-lg text-muted">{copy.text}</p>
      <button type="button" onClick={() => retry()} className={`${btnPrimary} mt-8`}>
        <RotateCcw size={18} aria-hidden /> {copy.button}
      </button>
    </div>
  );
}
