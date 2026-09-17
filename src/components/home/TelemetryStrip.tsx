import { CountUp } from "@/components/effects/CountUp";
import { stats } from "@/content";

export function TelemetryStrip() {
  return (
    <section aria-label="Telemetry: key numbers" className="border-y border-border bg-bg-soft">
      <div className="container-page">
        <dl className="grid grid-cols-2 divide-border sm:grid-cols-3 lg:grid-cols-5 lg:divide-x">
          {stats.map((s) => (
            <div key={s.label} className="px-4 py-6 lg:first:pl-0">
              <dt className="eyebrow text-[0.65rem]">
                <span className="text-mint">●</span> {s.label}
              </dt>
              <dd className="mt-1 font-mono text-3xl font-bold tracking-tight">
                <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} />
              </dd>
              <dd className="mt-1 text-xs text-muted">{s.note}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
