import Link from "next/link";
import { cn } from "@/lib/cn";
import { ui } from "@/lib/icons";

// §2.3 — gold primary, navy outline on light, white outline on dark/image.
type Variant =
  | "primary"
  | "outline" // navy border on light
  | "outline-light" // white border on dark / image / navy band
  | "text-link"
  | "light" // alias → outline-light (legacy hero/CTA usage)
  | "secondary-light" // alias → outline-light
  | "ghost"; // alias → text-link
type Size = "sm" | "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors focus-visible:outline-none active:scale-[0.98]";

const variants: Record<string, string> = {
  primary: "bg-gold-500 text-navy-900 hover:bg-gold-600",
  outline: "border border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white",
  "outline-light": "border border-white/60 text-white hover:bg-white hover:text-navy-900",
  light: "bg-white text-navy-900 hover:bg-cream-200",
  "secondary-light": "border border-white/60 text-white hover:bg-white hover:text-navy-900",
  "text-link":
    "px-0 text-[15px] font-medium text-navy-900 underline decoration-[0.06em] underline-offset-[0.22em] hover:text-gold-700",
  ghost:
    "px-0 text-[15px] font-medium text-navy-900 underline decoration-[0.06em] underline-offset-[0.22em] hover:text-gold-700",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-[14px]",
  md: "h-12 px-6 text-[15px]",
  lg: "h-[52px] px-7 text-[16px]",
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
  const cls = cn(base, variants[variant], isLink ? "" : sizes[size], className);
  const content = (
    <>
      {children}
      {arrow && (
        <ui.ArrowRight
          size={16}
          weight="bold"
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
