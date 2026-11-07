/**
 * Renders one or more JSON-LD structured-data blocks.
 * Used for SEO rich results and to give AI / generative search engines
 * explicit, machine-readable facts about the brand, pages and content.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Structured data is trusted, app-authored content.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
        />
      ))}
    </>
  );
}
