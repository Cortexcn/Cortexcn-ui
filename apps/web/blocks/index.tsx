import type { ComponentType } from "react";
import { readBlockFiles } from "@/lib/blocks/read-block-files";
import type { BlockCategory } from "./categories";
import { type BlockSlug, blockFileManifests } from "./manifest";
import { StatCardAreaBlock } from "./stat-card-area-01";
import type { BlockDisplayProps } from "./stat-card-area-01/meta";
import { StatCardChoroplethBlock } from "./stat-card-choropleth-01";
import { StatCardLineBlock } from "./stat-card-line-01";

const BLOCK_VIEWERS: Record<BlockSlug, ComponentType<BlockDisplayProps>> = {
  "stat-card-area-01": StatCardAreaBlock,
  "stat-card-line-01": StatCardLineBlock,
  "stat-card-choropleth-01": StatCardChoroplethBlock,
};

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
