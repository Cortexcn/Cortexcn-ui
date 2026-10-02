import type { BlockFile } from "@/lib/blocks/types";

export const loaderGlitchText01Meta = {
  name: "Loader: Glitch Text",
  description:
    "Loading text that scrambles and splits into color channels, at three intensities and as a heading.",
  registryName: "loader-glitch-text-01",
  previewHeight: 640,
} as const;

export interface BlockDisplayProps {
  files: BlockFile[];
  embedded?: boolean;
}
