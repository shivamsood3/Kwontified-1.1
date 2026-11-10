import Link from "next/link";
import type { Icon } from "@/lib/icons";
import { ui } from "@/lib/icons";
import { IconTile } from "./IconTile";
import { cn } from "@/lib/cn";

/**
 * §4.6 — full-width row with a hairline top rule, leading IconTile, title + sub,
 * trailing arrow. Hover: blue-50 bg, arrow slides 4px, title underlined.
 */
export function ListRow({
  href,
  title,
  sub,
  icon,
  tone = "light",
}: {
  href: string;
  title: string;
  sub?: string;
  icon?: Icon;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  const external = href.startsWith("http");
  const Cmp = external ? "a" : Link;
  const props = external ? { href, target: "_blank", rel: "noreferrer" } : { href };
  return (
    <Cmp
      {...(props as { href: string })}
      className={cn(
        "group flex items-center gap-4 border-t px-3 py-4 transition-colors",
        dark ? "border-white/12 hover:bg-white/[0.04]" : "border-line hover:bg-brand-50",
      )}
    >
      {icon && <IconTile icon={icon} tone={dark ? "dark" : "light"} />}
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block text-h3 font-medium decoration-[0.07em] underline-offset-4 group-hover:underline",
            dark ? "text-white" : "text-ink",
          )}
        >
          {title}
        </span>
        {sub && (
          <span className={cn("mt-0.5 block text-small", dark ? "text-white/60" : "text-muted")}>
            {sub}
          </span>
        )}
      </span>
      <ui.ArrowRight
        size={20}
        weight="light"
        className={cn(
          "shrink-0 transition-transform group-hover:translate-x-1",
          dark ? "text-white/50" : "text-ink-500",
        )}
        aria-hidden="true"
      />
    </Cmp>
  );
}
