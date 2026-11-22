"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ImageCard } from "@/components/blocks/ImageCard";
import {
  articles as allArticles,
  news as allNews,
  pressReleases as allPress,
  perspectiveFilters,
  articleImage,
  monthOf,
  type Article,
} from "@/lib/content/perspectives";
import { authorSlug } from "@/lib/content/perspectiveAuthors";

const selectClass =
  "w-full appearance-none rounded-lg border border-sand-300 bg-white px-3 py-2.5 text-small text-navy-900 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500";

function Field({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium uppercase tracking-wide text-ink-faint">{label}</span>
      <select className={selectClass} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

export function PerspectivesExplorer() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("All types");
  const [topic, setTopic] = useState("All topics");
  const [channel, setChannel] = useState("All channels");
  const [author, setAuthor] = useState("All authors");
  const [month, setMonth] = useState("Any month");

  const matchArticle = (a: Article) => {
    if (topic !== "All topics" && a.topic !== topic) return false;
    if (channel !== "All channels" && a.channel !== channel) return false;
    if (author !== "All authors" && a.author !== author) return false;
    if (month !== "Any month" && monthOf(a.date) !== month) return false;
    if (q.trim()) {
      const hay = `${a.title} ${a.dek} ${a.topic} ${a.channel} ${a.author}`.toLowerCase();
      if (!hay.includes(q.trim().toLowerCase())) return false;
    }
    return true;
  };

  const articles = useMemo(() => allArticles.filter(matchArticle), [q, topic, channel, author, month]);

  const news = useMemo(
    () =>
      allNews.filter((n) => {
        if (topic !== "All topics" && n.topic !== topic) return false;
        if (channel !== "All channels" && n.channel !== channel) return false;
        if (month !== "Any month" && monthOf(n.date) !== month) return false;
        if (q.trim() && !`${n.title} ${n.topic} ${n.channel}`.toLowerCase().includes(q.trim().toLowerCase())) return false;
        return true;
      }),
    [q, topic, channel, month],
  );

  const press = useMemo(
    () =>
      allPress.filter((p) => {
        if (month !== "Any month" && monthOf(p.date) !== month) return false;
        if (q.trim() && !p.title.toLowerCase().includes(q.trim().toLowerCase())) return false;
        return true;
      }),
    [q, month],
  );

  const showArticles = type === "All types" || type === "Articles";
  const showNews = type === "All types" || type === "News";
  const showPress = type === "All types" || type === "Press releases";

  const clear = () => {
    setQ(""); setType("All types"); setTopic("All topics"); setChannel("All channels"); setAuthor("All authors"); setMonth("Any month");
  };

  const activeCount = articles.length + news.length + press.length;

  return (
    <div>
      {/* Filter bar */}
      <div className="rounded-2xl border border-sand-300 bg-white p-5 shadow-card sm:p-6">
        <label className="block">
          <span className="sr-only">Search Perspectives</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Perspectives"
            className="w-full rounded-lg border border-sand-300 bg-cream-50 px-4 py-3 text-body text-navy-900 placeholder:text-ink-faint focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
          />
        </label>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Field label="Type" value={type} onChange={setType} options={perspectiveFilters.types} />
          <Field label="Topic" value={topic} onChange={setTopic} options={perspectiveFilters.topics} />
          <Field label="Channel" value={channel} onChange={setChannel} options={perspectiveFilters.channels} />
          <Field label="Author" value={author} onChange={setAuthor} options={perspectiveFilters.authors} />
          <Field label="Month" value={month} onChange={setMonth} options={perspectiveFilters.months} />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-small text-ink-muted">{activeCount} result{activeCount === 1 ? "" : "s"}</p>
          <button type="button" onClick={clear} className="text-small font-medium text-gold-700 hover:text-navy-900">
            Clear filters
          </button>
        </div>
      </div>

      {/* Articles */}
      {showArticles && (
        <section className="mt-14">
          <h2 className="h-display text-h2 text-navy-900">Articles</h2>
          {articles.length === 0 ? (
            <p className="mt-6 text-body text-ink-muted">No articles match these filters.</p>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <ImageCard
                  key={a.slug}
                  href={`/perspectives/${a.slug}`}
                  imageId={articleImage(a.slug)}
                  ratio="3/2"
                  chip={a.topic}
                  meta={`${a.author} · ${a.displayDate}`}
                  title={a.title}
                  excerpt={a.dek}
                  cta="Read"
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* News */}
      {showNews && news.length > 0 && (
        <section className="mt-16">
          <h2 className="h-display text-h2 text-navy-900">News</h2>
          <p className="mt-2 max-w-2xl text-body text-ink-muted">Short reads on marketplace announcements, written the week they happen.</p>
          <ul className="mt-8 divide-y divide-sand-300 border-t border-sand-300">
            {news.map((n) => (
              <li key={n.slug} className="py-5">
                <Link href={`/perspectives/news/${n.slug}`} className="group flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <span className="order-2 shrink-0 text-small text-ink-faint sm:order-1 sm:w-28">{n.displayDate}</span>
                  <span className="order-1 sm:order-2 sm:flex-1">
                    <span className="text-body font-medium text-navy-900 group-hover:text-gold-700">{n.title}</span>
                    <span className="mt-1 block text-[13px] text-ink-faint">News · {n.topic} · {n.channel}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Press releases */}
      {showPress && press.length > 0 && (
        <section className="mt-16">
          <h2 className="h-display text-h2 text-navy-900">Press releases</h2>
          <p className="mt-2 text-body text-ink-muted">
            Company announcements. Press inquiries: <a href="mailto:press@kwontified.com" className="link-underline">press@kwontified.com</a>.
          </p>
          <ul className="mt-8 divide-y divide-sand-300 border-t border-sand-300">
            {press.map((p) => (
              <li key={p.slug} className="py-5">
                <Link href={`/perspectives/press/${p.slug}`} className="group flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <span className="order-2 shrink-0 text-small text-ink-faint sm:order-1 sm:w-28">{p.displayDate}</span>
                  <span className="order-1 text-body font-medium text-navy-900 group-hover:text-gold-700 sm:order-2 sm:flex-1">{p.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-14 text-small text-ink-faint">
        Looking for an author?{" "}
        <Link href={`/perspectives/authors/${authorSlug("Elaine Kwon")}`} className="link-underline">Elaine Kwon</Link>
        {" · "}
        <Link href={`/perspectives/authors/${authorSlug("Jordan Taylor")}`} className="link-underline">Jordan Taylor</Link>
      </p>
    </div>
  );
}
