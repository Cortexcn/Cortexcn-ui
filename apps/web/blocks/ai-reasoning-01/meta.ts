import type { BlockFile } from "@/lib/blocks/types";

export const aiReasoning01Meta = {
  name: "AI Assistant: Reasoning",
  description:
    "A reasoning panel that streams a model's thinking as markdown, folds away when it finishes, and can replay.",
  registryName: "ai-reasoning-01",
  previewHeight: 560,
} as const;

export interface BlockDisplayProps {
  files: BlockFile[];
  embedded?: boolean;
}
