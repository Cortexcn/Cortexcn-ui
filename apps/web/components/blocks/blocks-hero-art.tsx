import { StatCardArea } from "@/blocks/stat-card-area-01/files/components/stat-card-area";
import { Painting } from "@/components/ui-home/painting";

/**
 * The Blocks hero picture: a painting with one live block on it, the same
 * pairing the component library home uses. The card works as it does on the
 * page below, so hovering the chart scrubs through the values.
 */
export function BlocksHeroArt() {
  return (
    <div className="relative size-full overflow-hidden rounded-xl border border-border shadow-black/10 shadow-xl">
      <Painting
        art="pastel-meadow-flowers"
        sizes="(min-width: 1280px) 576px, 46vw"
      />
      <div className="relative flex size-full items-center justify-center px-6 pt-12 pb-6">
        {/* A shorter chart than the page's copy, so the card clears the tag. */}
        <div className="w-full max-w-[21rem] drop-shadow-xl [&_[class*='stat-card-chart-h']]:[--stat-card-chart-h:136px] lg:[&_[class*='stat-card-chart-h']]:[--stat-card-chart-h:156px]">
          <StatCardArea />
        </div>
      </div>
      <span className="absolute top-3 left-3 rounded-full bg-background/85 px-2.5 py-1 font-mono text-[11px] text-muted-foreground backdrop-blur-sm">
        @cortexcn/stat-card-area-01
      </span>
    </div>
  );
}
