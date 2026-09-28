import Image from "next/image";
import { cn } from "@/lib/utils";
import blueCreamFlorals from "@/public/images/ui-home/blue-cream-florals.webp";
import blueWhiteFlowers from "@/public/images/ui-home/blue-white-flowers.webp";
import meadowGrass from "@/public/images/ui-home/meadow-grass.webp";
import neutralFlorals from "@/public/images/ui-home/neutral-florals.webp";
import pastelDaisies from "@/public/images/ui-home/pastel-daisies.webp";
import pastelMeadowFlowers from "@/public/images/ui-home/pastel-meadow-flowers.webp";
import pastelWildflowers from "@/public/images/ui-home/pastel-wildflowers.webp";
import softMeadowGrass from "@/public/images/ui-home/soft-meadow-grass.webp";
import watercolorWildflowers from "@/public/images/ui-home/watercolor-wildflowers.webp";
import whiteBlooms from "@/public/images/ui-home/white-blooms.webp";
import whiteBlossoms from "@/public/images/ui-home/white-blossoms.webp";
import wildflowerMeadow from "@/public/images/ui-home/wildflower-meadow.webp";

/** The Solva template's painted backgrounds, in `public/images/ui-home`. */
export const ARTWORKS = {
  "blue-cream-florals": blueCreamFlorals,
  "blue-white-flowers": blueWhiteFlowers,
  "meadow-grass": meadowGrass,
  "neutral-florals": neutralFlorals,
  "pastel-daisies": pastelDaisies,
  "pastel-meadow-flowers": pastelMeadowFlowers,
  "pastel-wildflowers": pastelWildflowers,
  "soft-meadow-grass": softMeadowGrass,
  "watercolor-wildflowers": watercolorWildflowers,
  "white-blooms": whiteBlooms,
  "white-blossoms": whiteBlossoms,
  "wildflower-meadow": wildflowerMeadow,
};

export type Artwork = keyof typeof ARTWORKS;

/**
 * A painted art panel with a faint noise layer on top. It fills its
 * positioned parent and crops the painting to cover it.
 */
export function Painting({
  art,
  className,
  preload = false,
  sizes = "(min-width: 1280px) 720px, (min-width: 768px) 60vw, 100vw",
}: {
  art: Artwork;
  className?: string;
  /** Load it with the page, for a panel above the fold. */
  preload?: boolean;
  /** The panel's rendered width at each breakpoint, so the right size loads. */
  sizes?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden bg-(--surface-strong)",
        className,
      )}
    >
      <Image
        alt=""
        className="object-cover dark:brightness-[0.72] dark:saturate-[0.9]"
        fill
        placeholder="blur"
        preload={preload}
        sizes={sizes}
        src={ARTWORKS[art]}
      />
      <div className="ui-grain absolute inset-0" />
    </div>
  );
}
