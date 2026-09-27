"use client";

import { GridPageHero } from "@/components/design/grid-page-hero";
import { useSmoothScrollTo } from "@/components/smooth-scroll/use-smooth-scroll-to";
import { Button } from "@/components/ui/button";

export function BlocksHero() {
  const scrollTo = useSmoothScrollTo();

  return (
    <GridPageHero
      action={
        <Button
          onClick={() => {
            const blocks = document.getElementById("blocks");
            if (blocks) {
              scrollTo(blocks);
            }
          }}
          size="lg"
          variant="white"
        >
          Browse blocks
        </Button>
      }
      subtitle="Ready-to-go sections and cards for landing pages and dashboards"
      title="Blocks"
    />
  );
}
