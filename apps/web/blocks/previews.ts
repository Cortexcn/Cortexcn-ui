import type { ComponentType } from "react";
import { AiChainOfThoughtPreview } from "./ai-chain-of-thought-01/preview";
import { AiQueuePreview } from "./ai-queue-01/preview";
import { AiReasoningPreview } from "./ai-reasoning-01/preview";
import { AiShimmerPreview } from "./ai-shimmer-01/preview";
import { FeatureBentoGridPreview } from "./feature-bento-grid-01/preview";
import { FeatureImageColumnsPreview } from "./feature-image-columns-01/preview";
import { FeatureMediaCardsPreview } from "./feature-media-cards-01/preview";
import { FeatureMixedBentoPreview } from "./feature-mixed-bento-01/preview";
import { FeatureMockupGridPreview } from "./feature-mockup-grid-01/preview";
import { FeatureSpotlightGridPreview } from "./feature-spotlight-grid-01/preview";
import { FeatureStudioGridPreview } from "./feature-studio-grid-01/preview";
import { FeatureWalkthroughPreview } from "./feature-walkthrough-01/preview";
import { HeroCoverPreview } from "./hero-cover-01/preview";
import { HeroDashboardPreview } from "./hero-dashboard-01/preview";
import { HeroStudioPreview } from "./hero-studio-01/preview";
import { LoaderDotMatrixPreview } from "./loader-dot-matrix-01/preview";
import { LoaderGlitchTextPreview } from "./loader-glitch-text-01/preview";
import type { BlockSlug } from "./manifest";
import { ServicesImageGridPreview } from "./services-image-grid-01/preview";
import { ServicesPreviewListPreview } from "./services-preview-list-01/preview";
import { StatCardAreaPreview } from "./stat-card-area-01/preview";
import { StatCardChoroplethPreview } from "./stat-card-choropleth-01/preview";
import { StatCardLinePreview } from "./stat-card-line-01/preview";

/** Live previews, reused for the card thumbnails on /blocks. */
export const BLOCK_PREVIEWS: Record<BlockSlug, ComponentType> = {
  "feature-spotlight-grid-01": FeatureSpotlightGridPreview,
  "feature-media-cards-01": FeatureMediaCardsPreview,
  "feature-image-columns-01": FeatureImageColumnsPreview,
  "feature-studio-grid-01": FeatureStudioGridPreview,
  "feature-bento-grid-01": FeatureBentoGridPreview,
  "feature-mixed-bento-01": FeatureMixedBentoPreview,
  "feature-mockup-grid-01": FeatureMockupGridPreview,
  "feature-walkthrough-01": FeatureWalkthroughPreview,
  "stat-card-area-01": StatCardAreaPreview,
  "stat-card-line-01": StatCardLinePreview,
  "stat-card-choropleth-01": StatCardChoroplethPreview,
  "ai-reasoning-01": AiReasoningPreview,
  "ai-chain-of-thought-01": AiChainOfThoughtPreview,
  "ai-shimmer-01": AiShimmerPreview,
  "ai-queue-01": AiQueuePreview,
  "hero-dashboard-01": HeroDashboardPreview,
  "hero-studio-01": HeroStudioPreview,
  "hero-cover-01": HeroCoverPreview,
  "loader-dot-matrix-01": LoaderDotMatrixPreview,
  "loader-glitch-text-01": LoaderGlitchTextPreview,
  "services-image-grid-01": ServicesImageGridPreview,
  "services-preview-list-01": ServicesPreviewListPreview,
};
