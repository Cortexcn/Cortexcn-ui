import type { BlockFile } from "@/lib/blocks/types";

export const heroCover01Meta = {
  name: "Hero: Cover Photo",
  description:
    "A full-bleed photo with the title, a small label, a short description, and one call to action along its bottom edge.",
  registryName: "hero-cover-01",
  previewHeight: 680,
} as const;

export interface BlockDisplayProps {
  files: BlockFile[];
  embedded?: boolean;
}
