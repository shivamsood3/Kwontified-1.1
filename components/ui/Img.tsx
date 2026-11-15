import Image from "next/image";
import { img } from "@/lib/content/images";
import { cn } from "@/lib/cn";

/**
 * Img — the single bridge between the generated manifest and next/image.
 * Give it a manifest `id`; it fills its positioned parent and lazy-loads
 * with the manifest blur placeholder. Heroes pass `priority`.
 */
export function Img({
  id,
  alt,
  className,
  sizes = "100vw",
  priority,
  position,
}: {
  id: string;
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  position?: string;
}) {
  const m = img(id);
  return (
    <Image
      src={`/images/${id}.webp`}
      alt={alt ?? m.alt}
      fill
      sizes={sizes}
      priority={priority}
      placeholder="blur"
      blurDataURL={m.blurDataURL}
      className={cn("object-cover", className)}
      style={position ? { objectPosition: position } : undefined}
    />
  );
}
