import { PerspectiveMarquee } from "@bklitui/ui/components/perspective-marquee";

const CHART_PREVIEWS = [
  "area-chart",
  "bar-chart",
  "line-chart",
  "pie-chart",
  "radar-chart",
  "ring-chart",
  "gauge-chart",
  "funnel-chart",
  "sankey-chart",
  "scatter-chart",
  "composed-chart",
  "candlestick-chart",
  "choropleth-chart",
  "live-line-chart",
].map((name) => ({
  src: `/svgs/${name}.svg`,
  alt: `${name.replace(/-/g, " ")} preview`,
}));

export function PerspectiveMarqueeDemo({ columns }: { columns?: number }) {
  return (
    <PerspectiveMarquee
      className="h-[480px] max-sm:h-80"
      columns={columns}
      images={CHART_PREVIEWS}
    />
  );
}
