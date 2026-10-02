import {
  CommandSearch,
  type CommandSearchGroup,
} from "@cortexcn/ui/components/command-search";

const GROUPS: CommandSearchGroup[] = [
  {
    label: "Pages",
    items: [
      { label: "Docs" },
      { label: "Components" },
      { label: "Blocks" },
      { label: "Charts" },
      { label: "Pricing" },
      { label: "Contact" },
    ],
  },
  {
    label: "Components",
    items: [
      { label: "Accordion" },
      { label: "Area Chart" },
      { label: "Bar Chart" },
      { label: "Card" },
      { label: "Command Search" },
      { label: "FAQ Tabs Card" },
      { label: "Light Speed" },
      { label: "Line Chart" },
      { label: "Line Nav" },
      { label: "Logos Carousel" },
      { label: "Marquee" },
      { label: "Number Ticker" },
      { label: "Perspective Marquee" },
      { label: "Pie Chart" },
      { label: "Theme Toggle Effect" },
      { label: "Work Experience" },
    ],
  },
];

const QUERIES = ["chart", "mar", "theme", "line"];

export function CommandSearchDemo() {
  return (
    <CommandSearch
      className="max-w-md"
      groups={GROUPS}
      height={380}
      queries={QUERIES}
    />
  );
}
