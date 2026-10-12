import { Rich } from "@/components/Rich";
import { cn } from "@/lib/utils";

/** Section headings are numbered like a lab report. `aside` is a red-pen note in the margin. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  aside,
  id,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  aside?: string;
  id?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative mb-10 max-w-2xl", className)}>
      <p className="eyebrow mb-2">
        <span className="text-primary">§</span> {eyebrow}
      </p>
      <h2 id={id} className="font-display text-4xl sm:text-5xl">
        {typeof title === "string" ? <Rich text={title} /> : title}
      </h2>
      {intro && (
        <p className="mt-4 text-lg text-muted">
          <Rich text={intro} />
        </p>
      )}
      {aside && (
        <p className="mt-3 font-hand text-lg leading-snug text-primary lg:absolute lg:top-6 lg:-right-64 lg:mt-0 lg:w-56 lg:-rotate-3">
          <Rich text={aside} />
        </p>
      )}
    </div>
  );
}
