import type { BlockFile } from "@/lib/blocks/types";

export const heroStudio01Meta = {
  name: "Hero: Studio",
  description:
    "A short tagline beside a serif headline and pitch, over a wide landscape photo that fades into the page.",
  registryName: "hero-studio-01",
  previewHeight: 900,
} as const;

export interface BlockDisplayProps {
  files: BlockFile[];
  embedded?: boolean;
}
