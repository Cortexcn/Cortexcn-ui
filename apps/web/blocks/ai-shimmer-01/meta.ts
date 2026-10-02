import type { BlockFile } from "@/lib/blocks/types";

export const aiShimmer01Meta = {
  name: "AI Assistant: Shimmer",
  description:
    "A chat turn where the assistant's reply is a shimmering status line while it works.",
  registryName: "ai-shimmer-01",
  previewHeight: 360,
} as const;

export interface BlockDisplayProps {
  files: BlockFile[];
  embedded?: boolean;
}
