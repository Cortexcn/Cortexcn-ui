import type { BlockFile } from "@/lib/blocks/types";

export const featureStudioGrid01Meta = {
  name: "Feature: Studio Grid",
  description:
    "Heading and one action over two compact cards and a large feature tile, for posts, case studies, or launches.",
  registryName: "feature-studio-grid-01",
  previewHeight: 820,
} as const;

export interface BlockDisplayProps {
  files: BlockFile[];
  embedded?: boolean;
}
