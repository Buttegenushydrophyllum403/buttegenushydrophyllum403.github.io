import { ArrowDown, ArrowRight } from "lucide-react";
import { Fragment } from "react";
import type { Project } from "@/content";
import { accentTextVar, accentVar } from "@/lib/utils";

/** A left-to-right (top-to-bottom on mobile) flow of stages built from content. */
export function ArchitectureDiagram({ architecture, accent }: { architecture: NonNullable<Project["architecture"]>; accent: Project["accent"] }) {
  const color = accentVar[accent];
  return (
    <figure className="border-2 border-text bg-surface p-5 sm:p-7">
      <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
        {architecture.stages.map((stage, i) => (
          <Fragment key={stage.label}>
            <div className="flex-1 border border-dashed p-4" style={{ borderColor: color }}>
              <p className="eyebrow mb-3" style={{ color: accentTextVar[accent] }}>
                {String(i + 1).padStart(2, "0")} · {stage.label}
              </p>
              <ul className="space-y-2">
                {stage.nodes.map((node) => (
                  <li key={node} className="border border-border bg-surface-2 px-3 py-2 font-mono text-sm">
                    {node}
                  </li>
                ))}
              </ul>
            </div>
            {i < architecture.stages.length - 1 && (
              <span className="flex justify-center text-muted" aria-hidden>
                <ArrowDown className="md:hidden" size={20} />
                <ArrowRight className="hidden md:block" size={20} />
              </span>
            )}
          </Fragment>
        ))}
      </div>
      <figcaption className="mt-4 text-center font-hand text-lg text-primary">fig. — {architecture.caption}</figcaption>
    </figure>
  );
}
