import type { BlockSlug } from "./manifest";

export interface BlockCategory {
  /** URL segment: /blocks/<slug> */
  slug: string;
  name: string;
  description: string;
  /** Blocks in display order. */
  blocks: BlockSlug[];
}

/** Add a category here and it joins the /blocks sidebar and gets its own page. */
export const BLOCK_CATEGORIES: BlockCategory[] = [
  {
    slug: "features",
    name: "Features",
    description:
      "Feature sections that explain what your product does, with icons, images, and motion.",
    blocks: [
      "feature-spotlight-grid-01",
      "feature-media-cards-01",
      "feature-image-columns-01",
      "feature-studio-grid-01",
      "feature-bento-grid-01",
    ],
  },
  {
    slug: "ai-assistant",
    name: "AI Assistant",
    description:
      "Pieces for chat and agent interfaces: streaming reasoning, step-by-step agent progress, and thinking states.",
    blocks: ["ai-reasoning-01", "ai-chain-of-thought-01", "ai-shimmer-01"],
  },
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
  },
];

export function getBlockCategory(slug: string): BlockCategory | undefined {
  return BLOCK_CATEGORIES.find((category) => category.slug === slug);
}
