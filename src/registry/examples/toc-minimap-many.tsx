import { TOCMinimap } from "@/components/ui/toc-minimap";

// A long outline — the expanded panel scrolls once it exceeds its max height.
const SECTIONS = [
  "Overview",
  "Motivation",
  "Installation",
  "Quick Start",
  "Configuration",
  "Theming",
  "Components",
  "Hooks",
  "Utilities",
  "Accessibility",
  "Migration Guide",
  "Troubleshooting",
  "FAQ",
  "Changelog",
];

export default function TocMinimapMany() {
  return (
    <div className="flex min-h-72 items-center justify-center">
      <TOCMinimap
        className="ml-0"
        items={SECTIONS.map((title) => ({
          title,
          url: `#${title.toLowerCase().replace(/\s+/g, "-")}`,
          depth: 2,
        }))}
      />
    </div>
  );
}
