import Link from "next/link";
import { DroneIcon } from "@/components/icons";
import type { HomeCopy } from "@/content";

// Stamp perforations: a row of holes around the edge, solid in the middle.
const PERFORATED = "radial-gradient(circle 3px, #0000 95%, #000) -4px -4px / 8px 8px round, linear-gradient(#000 0 0) 4px 4px / calc(100% - 8px) calc(100% - 8px) no-repeat";

/** The contact call-to-action, as a postcard. The whole card is the link. */
export function Postcard({ copy }: { copy: HomeCopy["postcard"] }) {
  return (
    <Link
      href="/contact"
      aria-label={copy.ariaLabel}
      className="group relative mx-auto grid max-w-3xl -rotate-1 gap-6 border border-border bg-[#fbf7ec] p-6 text-[#1c2740] shadow-card transition-transform hover:rotate-0 sm:grid-cols-[1.2fr_1fr] sm:p-8"
    >
      {/* Airmail border */}
      <span
        className="pointer-events-none absolute inset-0 border-[6px] border-transparent [border-image:repeating-linear-gradient(-45deg,#b8321c_0_10px,transparent_10px_20px,#1d5aa0_20px_30px,transparent_30px_40px)_6]"
        aria-hidden
      />

      <div className="sm:border-r sm:border-dashed sm:border-[#1c2740]/30 sm:pr-6">
        <p className="font-hand text-3xl leading-tight">{copy.heading}</p>
        <p className="mt-3 font-hand text-xl leading-snug text-[#1c2740]/80">{copy.body}</p>
        <p className="mt-4 font-hand text-xl">{copy.signoff}</p>
      </div>

      <div className="relative flex flex-col justify-between gap-6">
        <div className="flex items-start justify-between gap-3">
          {/* Postmark */}
          <span className="grid size-20 -rotate-12 place-items-center rounded-full border-2 border-[#1c2740]/50 text-center font-mono text-[0.55rem] leading-tight text-[#1c2740]/60 uppercase" aria-hidden>
            {copy.postmark.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </span>
          {/* Stamp */}
          <span className="grid h-24 w-20 shrink-0 rotate-3 place-items-center bg-[#1d5aa0] p-2 text-[#fbf7ec]" style={{ mask: PERFORATED }} aria-hidden>
            <span className="grid h-full w-full place-items-center border border-[#fbf7ec]/70">
              <DroneIcon size={40} className="text-[#fbf7ec]" />
            </span>
          </span>
        </div>
        <div className="space-y-2 font-hand text-xl">
          <p className="border-b border-[#1c2740]/30">{copy.to}</p>
          <p className="border-b border-[#1c2740]/30">{copy.via}</p>
          <p className="border-b border-[#1c2740]/30 font-mono text-sm group-hover:text-[#b8321c]">{copy.path}</p>
        </div>
      </div>
    </Link>
  );
}
