import type { BlockSlug } from "./manifest";

export interface BlockCategory {
  /** URL segment: /blocks/<slug> */
  slug: string;
  name: string;
  description: string;
  /** Blocks in display order. */
  blocks: BlockSlug[];
  /** Block shown on the category card. Defaults to the first block. */
  thumbnail?: BlockSlug;
}

/** Add a category here and it gets a card on /blocks and its own page. */
export const BLOCK_CATEGORIES: BlockCategory[] = [
  {
    slug: "stat-cards",
    name: "Stat Cards",
    description:
      "KPI cards with animated numbers, trend badges, and chart sparklines.",
    blocks: [
      "stat-card-area-01",
      "stat-card-line-01",
      "stat-card-choropleth-01",
    ],
    thumbnail: "stat-card-area-01",
  },
];

export function getBlockCategory(slug: string): BlockCategory | undefined {
  return BLOCK_CATEGORIES.find((category) => category.slug === slug);
}
