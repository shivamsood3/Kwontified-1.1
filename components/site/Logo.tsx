import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Kwontified logo: angular "K" monogram + wordmark.
 * `tone` controls colour so it sits on light or dark backgrounds.
 */
export function Logo({
  tone = "dark",
  className,
  href = "/",
  withWordmark = true,
}: {
  tone?: "dark" | "light";
  className?: string;
  href?: string;
  withWordmark?: boolean;
}) {
  const color = tone === "light" ? "#ffffff" : "#0d1320";
  return (
    <Link
      href={href}
      aria-label="Kwontified home"
      className={cn("inline-flex items-center gap-2.5", className)}
    >
      <Monogram color={color} />
      {withWordmark && (
        <span
          className="text-[1.05rem] font-semibold uppercase tracking-[0.22em]"
          style={{ color }}
        >
          Kwontified
        </span>
      )}
    </Link>
  );
}

function Monogram({ color }: { color: string }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M6 4 H14 V44 H6 Z" fill={color} />
      <path d="M14 24 L30 4 H40 L20 24 Z" fill="#2b94db" />
      <path d="M20 24 L40 44 H30 L14 26 Z" fill={color} />
    </svg>
  );
}
