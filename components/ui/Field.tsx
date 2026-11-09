"use client";

import { cn } from "@/lib/cn";

const fieldBase =
  "h-12 w-full border border-ink-300 bg-white px-3 text-small text-ink outline-none transition-colors focus:border-brand-600";

export function Label({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-caption font-medium text-ink">
      {children}
    </label>
  );
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, className)} {...props} />;
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldBase, className)} {...props}>
      {children}
    </select>
  );
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full border border-ink-300 bg-white px-3 py-2.5 text-small text-ink outline-none transition-colors focus:border-brand-600",
        className,
      )}
      {...props}
    />
  );
}

/**
 * §4.12 / §7.10 — segmented control. Native radios kept for accessibility;
 * each option is a square toggle.
 */
export function SegmentedControl({
  name,
  options,
  value,
  onChange,
  legend,
}: {
  name: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  legend?: string;
}) {
  return (
    <fieldset>
      {legend && (
        <legend className="mb-2 text-caption font-medium text-ink">{legend}</legend>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = o === value;
          return (
            <label
              key={o}
              className={cn(
                "cursor-pointer select-none border px-4 py-2 text-small transition-colors",
                active
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-ink-300 text-ink-700 hover:border-brand-600 hover:text-brand-700",
              )}
            >
              <input
                type="radio"
                name={name}
                value={o}
                checked={active}
                onChange={() => onChange(o)}
                className="sr-only"
              />
              {o}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
