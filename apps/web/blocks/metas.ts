import { featureImageColumns01Meta } from "./feature-image-columns-01/meta";
import { featureMediaCards01Meta } from "./feature-media-cards-01/meta";
import { featureSpotlightGrid01Meta } from "./feature-spotlight-grid-01/meta";
import { featureStudioGrid01Meta } from "./feature-studio-grid-01/meta";
import type { BlockSlug } from "./manifest";
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
  "stat-card-area-01": statCardArea01Meta,
  "stat-card-line-01": statCardLine01Meta,
  "stat-card-choropleth-01": statCardChoropleth01Meta,
};
