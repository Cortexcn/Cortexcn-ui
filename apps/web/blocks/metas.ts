import { aiChainOfThought01Meta } from "./ai-chain-of-thought-01/meta";
import { aiQueue01Meta } from "./ai-queue-01/meta";
import { aiReasoning01Meta } from "./ai-reasoning-01/meta";
import { aiShimmer01Meta } from "./ai-shimmer-01/meta";
import { featureBentoGrid01Meta } from "./feature-bento-grid-01/meta";
import { featureImageColumns01Meta } from "./feature-image-columns-01/meta";
import { featureMediaCards01Meta } from "./feature-media-cards-01/meta";
import { featureMixedBento01Meta } from "./feature-mixed-bento-01/meta";
import { featureSpotlightGrid01Meta } from "./feature-spotlight-grid-01/meta";
import { featureStudioGrid01Meta } from "./feature-studio-grid-01/meta";
import { featureWalkthrough01Meta } from "./feature-walkthrough-01/meta";
import { heroCover01Meta } from "./hero-cover-01/meta";
import { heroDashboard01Meta } from "./hero-dashboard-01/meta";
import { heroStudio01Meta } from "./hero-studio-01/meta";
import { loaderDotMatrix01Meta } from "./loader-dot-matrix-01/meta";
import { loaderGlitchText01Meta } from "./loader-glitch-text-01/meta";
import type { BlockSlug } from "./manifest";
import { servicesImageGrid01Meta } from "./services-image-grid-01/meta";
import { servicesPreviewList01Meta } from "./services-preview-list-01/meta";
import { statCardArea01Meta } from "./stat-card-area-01/meta";
import { statCardChoropleth01Meta } from "./stat-card-choropleth-01/meta";
import { statCardLine01Meta } from "./stat-card-line-01/meta";

/** Name and description of every block, for the cards on /blocks. */
export const BLOCK_METAS: Record<
  BlockSlug,
  { name: string; description: string }
> = {
  "feature-spotlight-grid-01": featureSpotlightGrid01Meta,
  "feature-media-cards-01": featureMediaCards01Meta,
  "feature-image-columns-01": featureImageColumns01Meta,
  "feature-studio-grid-01": featureStudioGrid01Meta,
  "feature-bento-grid-01": featureBentoGrid01Meta,
  "feature-mixed-bento-01": featureMixedBento01Meta,
  "feature-walkthrough-01": featureWalkthrough01Meta,
  "stat-card-area-01": statCardArea01Meta,
  "stat-card-line-01": statCardLine01Meta,
  "stat-card-choropleth-01": statCardChoropleth01Meta,
  "ai-reasoning-01": aiReasoning01Meta,
  "ai-chain-of-thought-01": aiChainOfThought01Meta,
  "ai-shimmer-01": aiShimmer01Meta,
  "ai-queue-01": aiQueue01Meta,
  "hero-dashboard-01": heroDashboard01Meta,
  "hero-studio-01": heroStudio01Meta,
  "hero-cover-01": heroCover01Meta,
  "loader-dot-matrix-01": loaderDotMatrix01Meta,
  "loader-glitch-text-01": loaderGlitchText01Meta,
  "services-image-grid-01": servicesImageGrid01Meta,
  "services-preview-list-01": servicesPreviewList01Meta,
};
