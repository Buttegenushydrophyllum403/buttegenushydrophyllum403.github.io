"use client";

import { Boop } from "@/components/effects/Boop";
import type { SkillGroup } from "@/content";
import { accentTextVar, accentVar } from "@/lib/utils";

export function Toolbox({ groups }: { groups: SkillGroup[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {groups.map((g) => {
        const color = accentVar[g.accent];
        return (
          <div key={g.id} className="rounded-3xl border border-border bg-surface p-6 shadow-card">
            <p className="font-display text-xl font-bold" style={{ color: accentTextVar[g.accent] }}>
              {g.title}
            </p>
            <p className="mt-1 text-sm text-muted">{g.blurb}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {g.skills.map((s, i) => (
                <li key={s}>
                  <Boop y={-4} rotation={i % 2 === 0 ? -4 : 4} timing={140} sound="pop">
                    <span className="inline-block rounded-full border bg-bg px-3 py-1.5 text-sm font-medium" style={{ borderColor: color }}>
                      {s}
                    </span>
                  </Boop>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
