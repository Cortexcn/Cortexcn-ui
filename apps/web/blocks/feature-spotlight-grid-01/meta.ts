import type { BlockFile } from "@/lib/blocks/types";

export const featureSpotlightGrid01Meta = {
  name: "Feature — Spotlight Grid",
  description:
    "Six icon cards under a centered intro, with one soft highlight that glides to the card you point at.",
  registryName: "feature-spotlight-grid-01",
  previewHeight: 960,
} as const;

export interface BlockDisplayProps {
  files: BlockFile[];
  embedded?: boolean;
}
