import type { BlockFile } from "@/lib/blocks/types";

export const featureMixedBento01Meta = {
  name: "Feature: Mixed Bento",
  description:
    "A mono label over four cards on a five-column grid, each setting its title, copy, and image a different way, over soft blurred glows and a faint plus pattern.",
  registryName: "feature-mixed-bento-01",
  previewHeight: 1100,
} as const;

export interface BlockDisplayProps {
  files: BlockFile[];
  embedded?: boolean;
}
