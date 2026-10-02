import type { BlockFile } from "@/lib/blocks/types";

export const loaderDotMatrix01Meta = {
  name: "Loader: Dot Matrix",
  description:
    "A grid of dots that pulses in a ripple, wave, or rain pattern, shown four ways including inside a button.",
  registryName: "loader-dot-matrix-01",
  previewHeight: 640,
} as const;

export interface BlockDisplayProps {
  files: BlockFile[];
  embedded?: boolean;
}
