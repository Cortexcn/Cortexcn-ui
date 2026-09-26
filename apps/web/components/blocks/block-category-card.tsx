"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState } from "react";
import type { BlockCategory } from "@/blocks/categories";
import { BLOCK_PREVIEWS } from "@/blocks/previews";

/** Thumbnails render the real blocks on a fixed canvas, then scale it to fit. */
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 750;
const THUMBNAIL_BLOCK_LIMIT = 3;

function ScaledCanvas({ children }: { children: ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) {
      return;
    }
    const update = () => setScale(frame.clientWidth / CANVAS_WIDTH);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden"
      ref={frameRef}
      style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 origin-top-left"
        inert
        style={{
          height: CANVAS_HEIGHT,
          transform: `scale(${scale})`,
          visibility: scale > 0 ? "visible" : "hidden",
          width: CANVAS_WIDTH,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function BlockCategoryCard({ category }: { category: BlockCategory }) {
  const count = category.blocks.length;

  return (
    <div className="group relative flex flex-col gap-5 rounded-2xl bg-muted/50 p-4 transition-colors hover:bg-muted">
      <div className="overflow-hidden rounded-xl border bg-background shadow-xs transition-shadow group-hover:shadow-md">
        <ScaledCanvas>
          <div className="flex size-full flex-wrap content-center items-center justify-center gap-10 p-14">
            {category.blocks.slice(0, THUMBNAIL_BLOCK_LIMIT).map((slug) => {
              const Preview = BLOCK_PREVIEWS[slug];
              return <Preview key={slug} />;
            })}
          </div>
        </ScaledCanvas>
      </div>

      <div className="px-2 pb-2">
        <h2 className="font-semibold text-2xl tracking-tight">
          {category.name}
        </h2>
        <p className="mt-1 text-muted-foreground">
          {count} {count === 1 ? "block" : "blocks"}
        </p>
      </div>

      {/* Full-card link; kept outside the thumbnail so no interactive element nests inside it. */}
      <Link
        className="absolute inset-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
        href={`/blocks/${category.slug}`}
      >
        <span className="sr-only">View {category.name} blocks</span>
      </Link>
    </div>
  );
}
