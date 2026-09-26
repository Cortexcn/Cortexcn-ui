import type { ComponentType } from "react";
import type { BlockSlug } from "./manifest";
import { StatCardAreaPreview } from "./stat-card-area-01/preview";
import { StatCardChoroplethPreview } from "./stat-card-choropleth-01/preview";
import { StatCardLinePreview } from "./stat-card-line-01/preview";

/** Live previews, reused for the category card thumbnails on /blocks. */
export const BLOCK_PREVIEWS: Record<BlockSlug, ComponentType> = {
  "stat-card-area-01": StatCardAreaPreview,
  "stat-card-line-01": StatCardLinePreview,
  "stat-card-choropleth-01": StatCardChoroplethPreview,
};
