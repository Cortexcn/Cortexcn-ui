import { TOCMinimap } from "@/components/ui/toc-minimap";

export default function TocMinimapDemo() {
  return (
    <div className="flex min-h-56 items-center justify-center">
      <TOCMinimap
        className="ml-0"
        items={[
          { title: "Introduction", url: "#introduction", depth: 2 },
          { title: "Installation", url: "#installation", depth: 2 },
          { title: "Usage", url: "#usage", depth: 2 },
          { title: "Examples", url: "#examples", depth: 2 },
          { title: "API Reference", url: "#api-reference", depth: 2 },
        ]}
      />
    </div>
  );
}
