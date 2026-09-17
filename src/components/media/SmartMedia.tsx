import Image from "next/image";
import type { Media } from "@/content";
import { cn } from "@/lib/utils";
import { LazyVideo } from "./LazyVideo";
import { Placeholder } from "./Placeholder";

type SmartMediaProps = {
  media: Media;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/** Renders the image or video if a file is set, otherwise a same-size placeholder. */
export function SmartMedia({ media, sizes = "(min-width: 1024px) 50vw, 100vw", priority, className }: SmartMediaProps) {
  if (!media.src) return <Placeholder media={media} className={className} />;

  if (media.kind === "video") {
    return <LazyVideo media={{ ...media, src: media.src }} className={className} />;
  }

  return (
    <Image
      src={media.src}
      alt={media.alt}
      width={media.width}
      height={media.height}
      sizes={sizes}
      priority={priority}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
