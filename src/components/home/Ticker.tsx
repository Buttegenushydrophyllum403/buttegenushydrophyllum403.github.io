import { homeCopy } from "@/content";

const stats = homeCopy.ticker;

/** A stock-ticker of real numbers. Pauses on hover; sits still for reduced motion. */
export function Ticker() {
  const items = stats.map((s) => (
    <span key={s.label} className="inline-flex items-baseline gap-2 px-5">
      <span className="text-[#7ee08a]" aria-hidden>
        ▲
      </span>
      <span className="font-semibold text-[#ffd76a]">{s.value}</span>
      <span className="text-[#e8e2cf]/80">{s.label}</span>
    </span>
  ));

  return (
    <section aria-label="Numbers worth knowing" className="group overflow-hidden border-y-2 border-text bg-[#16181d] py-2.5 font-mono text-sm">
      {/* Screen readers get the list once; the scrolling copy is decoration. */}
      <ul className="sr-only">
        {stats.map((s) => (
          <li key={s.label}>
            {s.value} {s.label}
          </li>
        ))}
      </ul>
      <div className="flex w-max animate-ticker whitespace-nowrap group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:whitespace-normal" aria-hidden>
        <div className="flex motion-reduce:flex-wrap">{items}</div>
        <div className="flex motion-reduce:hidden">{items}</div>
      </div>
    </section>
  );
}
