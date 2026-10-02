import type { BlockFile } from "@/lib/blocks/types";

export const featureBentoGrid01Meta = {
  name: "Feature: Bento Grid",
  description:
    "A bento of photo tiles, logo tiles, and stat cards on a twelve-column grid, with one call to action.",
  registryName: "feature-bento-grid-01",
  previewHeight: 900,
} as const;

export interface BlockDisplayProps {
  files: BlockFile[];
  embedded?: boolean;
}
