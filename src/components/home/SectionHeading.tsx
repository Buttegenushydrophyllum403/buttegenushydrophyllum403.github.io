import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  id,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-10 max-w-2xl", className)}>
      <p className="eyebrow mb-3">
        <span className="text-primary">▍</span>
        {eyebrow}
      </p>
      <h2 id={id} className="font-display text-3xl font-extrabold sm:text-4xl">
        {title}
      </h2>
      {intro && <p className="mt-4 text-lg text-muted">{intro}</p>}
    </div>
  );
}
