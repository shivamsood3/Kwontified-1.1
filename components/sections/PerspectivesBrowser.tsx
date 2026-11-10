"use client";

import { useState } from "react";
import Link from "next/link";
import {
  perspectives,
  perspectiveFilters,
  type Perspective,
} from "@/lib/content/perspectives";

export function PerspectivesBrowser() {
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState("All topics");
  const [channel, setChannel] = useState("All channels");
  const [author, setAuthor] = useState("All authors");

  const filtered = perspectives.filter((p) => {
    const matchesQ =
      !q ||
      p.title.toLowerCase().includes(q.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(q.toLowerCase());
    return (
      matchesQ &&
      (topic === "All topics" || p.topic === topic) &&
      (channel === "All channels" || p.channel === channel) &&
      (author === "All authors" || p.author === author)
    );
  });

  const featured = filtered.find((p) => p.featured) ?? filtered[0];
  const rest = filtered.filter((p) => p !== featured);

  return (
    <div>
      {/* Filter bar */}
      <div className="rounded-2xl border border-line bg-paper p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_auto_auto]">
          <div>
            <label className="mb-1.5 block text-xs font-normal text-muted">
              Search Perspectives
            </label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search guides, analyses and updates"
              className="h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <SelectField label="Topic" value={topic} onChange={setTopic} options={perspectiveFilters.topics} />
          <SelectField label="Channel" value={channel} onChange={setChannel} options={perspectiveFilters.channels} />
          <SelectField label="Author" value={author} onChange={setAuthor} options={perspectiveFilters.authors} />
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-muted">No Perspectives match those filters yet.</p>
      )}

      {/* Featured */}
      {featured && (
        <Link
          href={featured.slug ? `/perspectives/${featured.slug}` : "/perspectives"}
          className="group mt-8 block overflow-hidden rounded-2xl border border-white/10 bg-ink text-white"
        >
          <div className="grid md:grid-cols-[1.3fr_1fr]">
            <div className="p-8 md:p-10">
              <p className="text-xs font-normal text-brand-300">
                {featured.topic} · {featured.channel}
              </p>
              <h2 className="h-display mt-3 text-3xl text-white">{featured.title}</h2>
              <p className="mt-4 max-w-md text-[0.975rem] leading-relaxed text-white/65">
                {featured.excerpt}
              </p>
              {featured.author && (
                <p className="mt-6 text-sm text-white/80">
                  <span className="font-semibold">{featured.author}</span>
                </p>
              )}
            </div>
            <div className="hidden bg-gradient-to-br from-brand-700 to-ink-900 md:block" />
          </div>
        </Link>
      )}

      {/* Rest */}
      {rest.length > 0 && (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <PostCard key={p.title} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function PostCard({ p }: { p: Perspective }) {
  return (
    <Link
      href={p.slug ? `/perspectives/${p.slug}` : "/perspectives"}
      className="group flex flex-col rounded-2xl border border-line bg-white p-7 transition hover:-translate-y-0.5 hover:shadow-card"
    >
      <p className="text-xs font-normal text-brand-600">
        {p.topic}
      </p>
      <h3 className="h-display mt-3 text-lg text-ink group-hover:text-brand-700">
        {p.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-700">{p.excerpt}</p>
      {p.author && <p className="mt-5 text-sm text-muted">{p.author}</p>}
    </Link>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-normal text-muted">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 md:w-44"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
