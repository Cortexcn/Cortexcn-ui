"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

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
export function FitToFrame({ children }: { children: ReactNode }) {
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
