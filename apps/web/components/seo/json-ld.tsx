/**
 * Renders schema.org structured data. `<` is escaped so the JSON can never
 * close the script tag early.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD built from our own constants
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
      type="application/ld+json"
    />
  );
}
