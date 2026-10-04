import type { BlockFile } from "@/lib/blocks/types";

export const servicesImageGrid01Meta = {
  name: "Services: Image Grid",
  description:
    "An intro with a heading, a short pitch, and one outline action beside five image cards that fade when you point at them.",
  registryName: "services-image-grid-01",
  previewHeight: 820,
} as const;

export interface BlockDisplayProps {
  files: BlockFile[];
  embedded?: boolean;
}
