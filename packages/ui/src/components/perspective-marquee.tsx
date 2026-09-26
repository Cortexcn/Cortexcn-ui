import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";
import { Marquee } from "./marquee";

export interface PerspectiveMarqueeImage {
  src: string;
  alt: string;
}

export interface PerspectiveMarqueeProps {
  /** Images for the wall, spread across the columns in order. */
  images: PerspectiveMarqueeImage[];
  /**
   * Number of scrolling columns.
   * @default 4
   */
  columns?: number;
  /**
   * Seconds for one full loop of a column. Odd columns run a little slower.
   * @default 40
   */
  duration?: number;
  /**
   * Pause a column while the pointer is over it.
   * @default true
   */
  pauseOnHover?: boolean;
  className?: string;
}

/** Tilt applied to the whole wall: spin it, then lay it back. */
const WALL_TRANSFORM = "translate(-50%, -50%) rotateX(50deg) rotateZ(-40deg)";
const WALL_SIZE = 1600;

/** Round-robin so every column mixes images from across the list. */
function toColumns<T>(items: T[], count: number): T[][] {
  const columnCount = Math.max(1, Math.min(count, items.length));
  const columns: T[][] = Array.from({ length: columnCount }, () => []);
  items.forEach((item, index) => {
    columns[index % columnCount]?.push(item);
  });
  return columns;
}

export function PerspectiveMarquee({
  images,
  columns = 4,
  duration = 40,
  pauseOnHover = true,
  className,
}: PerspectiveMarqueeProps) {
  const lanes = toColumns(images, columns);

  return (
    <div
      className={cn(
        "relative h-[600px] w-full overflow-hidden max-sm:h-96",
        "mask-[radial-gradient(ellipse_at_center,black_45%,transparent_80%)]",
        "motion-reduce:[&_.animate-marquee-vertical]:[animation-play-state:paused]",
        className,
      )}
    >
      <div
        className="absolute top-1/2 left-1/2 grid scale-50 gap-6 sm:scale-75 lg:scale-100"
        style={{
          gridTemplateColumns: `repeat(${lanes.length}, minmax(0, 1fr))`,
          height: WALL_SIZE,
          transform: WALL_TRANSFORM,
          width: WALL_SIZE,
        }}
      >
        {lanes.map((lane, laneIndex) => (
          <Marquee
            className="h-full p-0 [--gap:1.5rem]"
            // biome-ignore lint/suspicious/noArrayIndexKey: columns are positional and never reorder
            key={laneIndex}
            pauseOnHover={pauseOnHover}
            reverse={laneIndex % 2 === 1}
            style={
              {
                "--duration": `${duration * (laneIndex % 2 === 1 ? 1.25 : 1)}s`,
              } as CSSProperties
            }
            vertical
          >
            {lane.map((image) => (
              // biome-ignore lint/performance/noImgElement: framework-agnostic registry component
              <img
                alt={image.alt}
                className="aspect-4/3 w-full rounded-xl bg-muted object-cover shadow-sm ring-1 ring-foreground/10 transition-[translate,box-shadow] duration-300 hover:-translate-y-2 hover:shadow-2xl"
                decoding="async"
                height={300}
                key={image.src}
                loading="lazy"
                src={image.src}
                width={400}
              />
            ))}
          </Marquee>
        ))}
      </div>
    </div>
  );
}
