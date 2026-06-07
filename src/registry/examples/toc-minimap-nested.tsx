import { TOCMinimap } from "@/components/ui/toc-minimap";

// Mixed heading depths (2/3/4) — deeper items render as shorter, indented dashes.
export default function TocMinimapNested() {
  return (
    <div className="flex min-h-64 items-center justify-center">
      <TOCMinimap
        className="ml-0"
        items={[
          { title: "Getting Started", url: "#getting-started", depth: 2 },
          { title: "Install the CLI", url: "#install-the-cli", depth: 3 },
          { title: "Configure Tailwind", url: "#configure-tailwind", depth: 3 },
          { title: "Add the preset", url: "#add-the-preset", depth: 4 },
          { title: "Components", url: "#components", depth: 2 },
          { title: "Button", url: "#button", depth: 3 },
          { title: "Card", url: "#card", depth: 3 },
          { title: "API Reference", url: "#api-reference", depth: 2 },
        ]}
      />
    </div>
  );
}
