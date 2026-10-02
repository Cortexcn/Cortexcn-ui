import type { BlockFile } from "@/lib/blocks/types";

export const aiChainOfThought01Meta = {
  name: "AI Assistant: Chain of Thought",
  description:
    "An agent's progress one step at a time, with sources, a live current step, and a summary when the run ends.",
  registryName: "ai-chain-of-thought-01",
  previewHeight: 560,
} as const;

export interface BlockDisplayProps {
  files: BlockFile[];
  embedded?: boolean;
}
