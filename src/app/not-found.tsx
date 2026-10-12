import Link from "next/link";
import { RoverIcon } from "@/components/icons";
import { Rich } from "@/components/Rich";
import { errorsCopy } from "@/content";
import { btnPrimary } from "@/lib/utils";

export default function NotFound() {
  const copy = errorsCopy.notFound;
  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <p className="stamp -rotate-6 text-primary">{copy.stamp}</p>
      <div className="relative mt-10 grid h-40 w-72 place-items-center overflow-hidden border-2 border-text bg-surface">
        <div className="absolute inset-x-0 bottom-8 border-t border-dashed border-terrain" aria-hidden />
        <div className="animate-float">
          <RoverIcon size={88} className="text-text" />
        </div>
        <span className="absolute top-3 right-4 font-mono text-xs text-muted" aria-hidden>
          ??.??° N, ??.??° E
        </span>
      </div>
      <h1 className="mt-8 font-display text-4xl sm:text-5xl">
        <Rich text={copy.title} />
      </h1>
      <p className="mt-4 max-w-md text-lg text-muted">
        <Rich text={copy.text} />
      </p>
      {copy.note && <p className="mt-2 font-hand text-xl text-primary">{copy.note}</p>}
      <Link href="/" className={`${btnPrimary} mt-8`}>
        {copy.button}
      </Link>
    </div>
  );
}
