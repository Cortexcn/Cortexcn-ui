import type { BlockFile } from "@/lib/blocks/types";

export const featureMockupGrid01Meta = {
  name: "Feature: Mockup Grid",
  description:
    "A centered label and heading over five cards, two on top and three below, each with a small product mockup: a prompt with section drafts, a stack of templates, a page views chart, apps around a lock, and a page on a laptop and a phone.",
  registryName: "feature-mockup-grid-01",
  previewHeight: 1000,
} as const;

export interface BlockDisplayProps {
  files: BlockFile[];
  embedded?: boolean;
}
