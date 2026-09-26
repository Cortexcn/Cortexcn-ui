"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState } from "react";
import type { BlockCategory } from "@/blocks/categories";
import { BLOCK_PREVIEWS } from "@/blocks/previews";

/** Blocks lay out at this width before being scaled into the thumbnail. */
const RENDER_WIDTH = 1280;
/** Share of the frame the block may fill, leaving a little breathing room. */
const FILL = 0.88;
/** Small blocks (single cards) stay crisp instead of being blown up. */
const MAX_SCALE = 1;

interface FitLayout {
  scale: number;
  x: number;
  y: number;
}

/**
 * Renders the real block, measures it, and scales it to fit the frame
 * entirely (like object-fit: contain), centered.
 */
function FitToFrame({ children }: { children: ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<FitLayout | null>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const block = canvasRef.current?.firstElementChild;
    if (!(frame && block instanceof HTMLElement)) {
      return;
    }

    const update = () => {
      const blockWidth = block.offsetWidth;
      const blockHeight = block.offsetHeight;
      if (blockWidth === 0 || blockHeight === 0) {
        return;
      }
      const scale = Math.min(
        (frame.clientWidth * FILL) / blockWidth,
        (frame.clientHeight * FILL) / blockHeight,
        MAX_SCALE,
      );
      setLayout({
        scale,
        x: (frame.clientWidth - blockWidth * scale) / 2,
        y: (frame.clientHeight - blockHeight * scale) / 2,
      });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    observer.observe(block);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="relative aspect-16/10 w-full overflow-hidden"
      ref={frameRef}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 origin-top-left"
        inert
        ref={canvasRef}
        style={{
          transform: layout
            ? `translate(${layout.x}px, ${layout.y}px) scale(${layout.scale})`
            : undefined,
          visibility: layout ? "visible" : "hidden",
          width: RENDER_WIDTH,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function BlockCategoryCard({ category }: { category: BlockCategory }) {
  const count = category.blocks.length;
  const thumbnailSlug = category.thumbnail ?? category.blocks[0];
  const Thumbnail = thumbnailSlug ? BLOCK_PREVIEWS[thumbnailSlug] : null;

  return (
    <div className="group relative flex flex-col gap-5 rounded-2xl bg-muted/50 p-4 transition-colors hover:bg-muted">
      <div className="overflow-hidden rounded-xl border bg-background shadow-xs transition-shadow group-hover:shadow-md">
        <FitToFrame>{Thumbnail ? <Thumbnail /> : <div />}</FitToFrame>
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
