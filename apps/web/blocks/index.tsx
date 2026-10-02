import type { ComponentType } from "react";
import { readBlockFiles } from "@/lib/blocks/read-block-files";
import { AiChainOfThoughtBlock } from "./ai-chain-of-thought-01";
import { AiReasoningBlock } from "./ai-reasoning-01";
import { AiShimmerBlock } from "./ai-shimmer-01";
import type { BlockCategory } from "./categories";
import { FeatureBentoGridBlock } from "./feature-bento-grid-01";
import { FeatureImageColumnsBlock } from "./feature-image-columns-01";
import { FeatureMediaCardsBlock } from "./feature-media-cards-01";
import { FeatureSpotlightGridBlock } from "./feature-spotlight-grid-01";
import { FeatureStudioGridBlock } from "./feature-studio-grid-01";
import { HeroCoverBlock } from "./hero-cover-01";
import { HeroDashboardBlock } from "./hero-dashboard-01";
import { HeroStudioBlock } from "./hero-studio-01";
import { type BlockSlug, blockFileManifests } from "./manifest";
import { StatCardAreaBlock } from "./stat-card-area-01";
import type { BlockDisplayProps } from "./stat-card-area-01/meta";
import { StatCardChoroplethBlock } from "./stat-card-choropleth-01";
import { StatCardLineBlock } from "./stat-card-line-01";

const BLOCK_VIEWERS: Record<BlockSlug, ComponentType<BlockDisplayProps>> = {
  "feature-spotlight-grid-01": FeatureSpotlightGridBlock,
  "feature-media-cards-01": FeatureMediaCardsBlock,
  "feature-image-columns-01": FeatureImageColumnsBlock,
  "feature-studio-grid-01": FeatureStudioGridBlock,
  "feature-bento-grid-01": FeatureBentoGridBlock,
  "stat-card-area-01": StatCardAreaBlock,
  "stat-card-line-01": StatCardLineBlock,
  "stat-card-choropleth-01": StatCardChoroplethBlock,
  "ai-reasoning-01": AiReasoningBlock,
  "ai-chain-of-thought-01": AiChainOfThoughtBlock,
  "ai-shimmer-01": AiShimmerBlock,
  "hero-dashboard-01": HeroDashboardBlock,
  "hero-studio-01": HeroStudioBlock,
  "hero-cover-01": HeroCoverBlock,
};

/** The viewer (preview, code, install) for one block. */
export function getBlockElement(slug: BlockSlug) {
  const Viewer = BLOCK_VIEWERS[slug];
  return (
    <Viewer
      embedded
      files={readBlockFiles(slug, blockFileManifests[slug])}
      key={slug}
    />
  );
}

/** Block viewers (preview, code, install) for every block in a category. */
export function getCategoryBlockElements(category: BlockCategory) {
  return category.blocks.map((slug) => {
    const Viewer = BLOCK_VIEWERS[slug];
    return (
      <Viewer
        embedded
        files={readBlockFiles(slug, blockFileManifests[slug])}
        key={slug}
      />
    );
  });
}
