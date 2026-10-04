import type { BlockFile } from "@/lib/blocks/types";

export const featureWalkthrough01Meta = {
  name: "Feature: Walkthrough",
  description:
    "Three numbered steps beside a painted stage in a ruled frame. Each step plays out in its own window, and the steps move on by themselves.",
  registryName: "feature-walkthrough-01",
  previewHeight: 860,
} as const;

export interface BlockDisplayProps {
  files: BlockFile[];
  embedded?: boolean;
}
