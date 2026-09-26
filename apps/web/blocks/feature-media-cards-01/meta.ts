import type { BlockFile } from "@/lib/blocks/types";

export const featureMediaCards01Meta = {
  name: "Feature — Media Cards",
  description:
    "Heading and two actions above three cards that pair an image, a short explainer, and an icon tile.",
  registryName: "feature-media-cards-01",
  previewHeight: 860,
} as const;

export interface BlockDisplayProps {
  files: BlockFile[];
  embedded?: boolean;
}
