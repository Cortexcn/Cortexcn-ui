import type { BlockFile } from "@/lib/blocks/types";

export const featureImageColumns01Meta = {
  name: "Feature — Image Columns",
  description:
    "Label, headline, and intro over three image columns, closed by one shared call to action.",
  registryName: "feature-image-columns-01",
  previewHeight: 1000,
} as const;

export interface BlockDisplayProps {
  files: BlockFile[];
  embedded?: boolean;
}
