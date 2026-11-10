import Link from "next/link";
import { cn } from "@/lib/cn";
import { ui } from "@/lib/icons";

type Variant =
  | "primary"
  | "secondary-light"
  | "outline"
  | "outline-light"
  | "text-link"
  | "light" // alias → secondary-light
  | "ghost"; // alias → text-link
type Size = "sm" | "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 font-normal transition-colors focus-visible:outline-none active:scale-[0.97]";

const variants: Record<string, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  // White button for use on the blue CTA band only. Hover → ink-100 (never
  // light blue, which would read as a button-on-panel elsewhere). (fixes 0a)
  "secondary-light": "bg-white text-brand-600 hover:bg-ink-100",
  light: "bg-white text-brand-600 hover:bg-ink-100",
  outline: "border border-ink-300 text-ink hover:border-brand-600 hover:text-brand-700",
  // Hero secondary CTA on dark: transparent, faint white border → solid on hover. (fixes 0a)
  "outline-light": "border border-white/40 text-white hover:border-white hover:bg-white/[0.08]",
  "text-link":
    "px-0 text-brand-600 underline decoration-[0.07em] underline-offset-[0.2em] hover:text-brand-700",
  ghost:
    "px-0 text-brand-600 underline decoration-[0.07em] underline-offset-[0.2em] hover:text-brand-700",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-[15px]",
  md: "h-11 px-[14px] text-[16px]",
  lg: "h-[52px] px-7 text-[18px]",
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  arrow,
  type,
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  arrow?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  const isLink = variant === "text-link" || variant === "ghost";
  const cls = cn(base, variants[variant], isLink ? "text-[16px]" : sizes[size], className);
  const content = (
    <>
      {children}
      {arrow && (
        <ui.ArrowRight
          size={18}
          weight="light"
          className="transition-transform group-hover:translate-x-1"
        />
      )}
    </>
  );

  if (!href) {
    return (
      <button type={type ?? "button"} onClick={onClick} className={cls}>
        {content}
      </button>
    );
  }
  if (href.startsWith("http")) {
    return (
      <a href={href} className={cls} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}
