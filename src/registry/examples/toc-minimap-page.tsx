import { TOCMinimap } from "@/components/ui/toc-minimap";

// A realistic layout: an article column with a minimap pinned beside it.
// Hover the dashes to reveal titles; clicking one smooth-scrolls to its section,
// and the dash for the section in view stays highlighted.
const SECTIONS = [
  {
    id: "overview",
    title: "Overview",
    body: "A vision-language-action model is the agent loop with motor commands swapped in for tool calls.",
  },
  {
    id: "features",
    title: "Features",
    body: "Scroll-spy highlighting, a hover-to-expand outline, and depth-aware indentation out of the box.",
  },
  {
    id: "pricing",
    title: "Pricing",
    body: "Free and open source. Copy the component into your project and own the code.",
  },
  {
    id: "faq",
    title: "FAQ",
    body: "Works with any element that has an id. Pass your headings as items and you're done.",
  },
  {
    id: "contact",
    title: "Contact",
    body: "Questions or ideas? Open an issue or reach out — contributions are welcome.",
  },
];

export default function TocMinimapPage() {
  return (
    <div className="mx-auto flex max-w-xl gap-6 px-2">
      <article className="flex-1 space-y-8">
        {SECTIONS.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-4 space-y-2"
          >
            <h3 className="text-lg font-semibold">{section.title}</h3>
            <p className="text-sm text-muted-foreground">{section.body}</p>
          </section>
        ))}
      </article>

      <div className="sticky top-4 self-start">
        <TOCMinimap
          items={SECTIONS.map((section) => ({
            title: section.title,
            url: `#${section.id}`,
            depth: 2,
          }))}
        />
      </div>
    </div>
  );
}
