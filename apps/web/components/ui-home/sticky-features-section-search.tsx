"use client";

import {
  CommandSearch,
  type CommandSearchGroup,
  type CommandSearchItem,
} from "@bklitui/ui/components/command-search";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface PaletteLink {
  label: string;
  href: string;
}

interface PaletteSection {
  label: string;
  links: PaletteLink[];
}

const docsLink = (label: string, slug: string): PaletteLink => ({
  label,
  href: `/docs/components/${slug}`,
});

/** Real pages and registry items, so choosing a row opens its docs. */
const SECTIONS: PaletteSection[] = [
  {
    label: "Pages",
    links: [
      { label: "Installation", href: "/docs/installation" },
      { label: "Components", href: "/docs/components" },
      { label: "Blocks", href: "/blocks" },
      { label: "Charts", href: "/charts/area-chart" },
    ],
  },
  {
    label: "Components",
    links: [
      docsLink("Accordion", "accordion"),
      docsLink("Card", "card"),
      docsLink("Command Search", "command-search"),
      docsLink("FAQ Tabs Card", "faq-tabs-card"),
      docsLink("Line Nav", "line-nav"),
      docsLink("Logos Carousel", "logos-carousel"),
      docsLink("Marquee", "marquee"),
      docsLink("Number Ticker", "number-ticker"),
      docsLink("Perspective Marquee", "perspective-marquee"),
      docsLink("Theme Toggle Effect", "theme-toggle-effect"),
      docsLink("Work Experience", "work-experience"),
    ],
  },
  {
    label: "Charts",
    links: [
      docsLink("Area Chart", "area-chart"),
      docsLink("Bar Chart", "bar-chart"),
      docsLink("Funnel Chart", "funnel-chart"),
      docsLink("Gauge Chart", "gauge-chart"),
      docsLink("Line Chart", "line-chart"),
      docsLink("Live Line Chart", "live-line-chart"),
      docsLink("Pie Chart", "pie-chart"),
      docsLink("Radar Chart", "radar-chart"),
      docsLink("Ring Chart", "ring-chart"),
      docsLink("Sankey Chart", "sankey-chart"),
    ],
  },
];

const GROUPS: CommandSearchGroup[] = SECTIONS.map((section) => ({
  label: section.label,
  items: section.links.map((link) => ({ label: link.label })),
}));

const HREF_BY_LABEL = new Map(
  SECTIONS.flatMap((section) =>
    section.links.map((link) => [link.label, link.href] as const),
  ),
);

const QUERIES = ["chart", "tick", "mar", "line"];

/**
 * The palette fills the square tile instead of taking a pixel height. Its
 * results list does not scroll on its own: over a sticky stack the wheel
 * should keep moving the page, and Chrome would make a scrolling list an
 * unnamed tab stop. Arrow keys still bring each row into view. The ring
 * matches the page's other focus states, since the palette's own is faint.
 * With reduced motion the typing stops but the component keeps its caret
 * blinking, so the caret is held on here.
 */
const PALETTE_CLASS_NAME =
  "h-full! focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:[&_.whitespace-pre+span]:opacity-100! dark:focus-visible:ring-ring [&_.overflow-y-auto]:overflow-y-hidden";

/** The live Command Search. Enter or a click opens the chosen page. */
export function CommandPaletteTile() {
  const router = useRouter();

  const openItem = useCallback(
    (item: CommandSearchItem) => {
      const href = HREF_BY_LABEL.get(item.label);
      if (href) {
        router.push(href);
      }
    },
    [router],
  );

  return (
    <CommandSearch
      className={PALETTE_CLASS_NAME}
      groups={GROUPS}
      onSelect={openItem}
      queries={QUERIES}
    />
  );
}
