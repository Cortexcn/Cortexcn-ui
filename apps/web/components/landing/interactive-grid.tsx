"use client";

import { useEffect, useRef, useState } from "react";

import { usePauseWhenOffscreen } from "@/lib/use-pause-when-offscreen";
import { cn } from "@/lib/utils";

const CELL_SIZE = 48;
const FADE_MS = 700;

const FADE_EASING = "cubic-bezier(0.23, 1, 0.32, 1)";

interface GridSize {
  columns: number;
  rows: number;
}

function showCell(cell: HTMLElement) {
  for (const animation of cell.getAnimations()) {
    animation.cancel();
  }
  cell.style.opacity = "1";
}

function fadeCell(cell: HTMLElement) {
  cell.style.opacity = "0";
  cell.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: FADE_MS,
    easing: FADE_EASING,
  });
}

/**
 * Square line grid that fills the cell under the cursor and fades it out as
 * the cursor moves on. Lines start at the top-left corner, so the grid lines
 * stay put when the viewport resizes.
 */
export function InteractiveGrid({ className }: { className?: string }) {
  const { ref: containerRef, paused } = usePauseWhenOffscreen<HTMLDivElement>();
  const cellsRef = useRef<HTMLDivElement>(null);
  // Cells only drive the hover effect, so they skip the server HTML.
  const [size, setSize] = useState<GridSize | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const measure = () => {
      const columns = Math.ceil(container.clientWidth / CELL_SIZE);
      const rows = Math.ceil(container.clientHeight / CELL_SIZE);
      setSize((current) =>
        current?.columns === columns && current.rows === rows
          ? current
          : { columns, rows },
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    const cells = cellsRef.current?.children;
    if (!(container && cells && size) || paused) {
      return;
    }

    let frame = 0;
    let point: { x: number; y: number } | null = null;
    let activeCell: HTMLElement | null = null;

    const setActive = (cell: HTMLElement | null) => {
      if (cell === activeCell) {
        return;
      }
      if (activeCell) {
        fadeCell(activeCell);
      }
      if (cell) {
        showCell(cell);
      }
      activeCell = cell;
    };

    // Listening on the window keeps the effect working under the header and the
    // copy that sit on top of the grid.
    const update = () => {
      frame = 0;
      if (!point) {
        return;
      }
      const rect = container.getBoundingClientRect();
      const x = point.x - rect.left;
      const y = point.y - rect.top;
      if (x < 0 || y < 0 || x >= rect.width || y >= rect.height) {
        setActive(null);
        return;
      }
      const index =
        Math.floor(y / CELL_SIZE) * size.columns + Math.floor(x / CELL_SIZE);
      const cell = cells[index];
      setActive(cell instanceof HTMLElement ? cell : null);
    };

    const schedule = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        return;
      }
      point = { x: event.clientX, y: event.clientY };
      schedule();
    };

    const onPointerLeave = () => {
      point = null;
      setActive(null);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", schedule);
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave,
      );
      cancelAnimationFrame(frame);
      setActive(null);
    };
  }, [containerRef, paused, size]);

  return (
    <div
      aria-hidden="true"
      className={cn("overflow-hidden bg-(--band)", className)}
      ref={containerRef}
      style={{
        backgroundImage:
          "linear-gradient(to right, var(--band-line) 1px, transparent 1px), linear-gradient(to bottom, var(--band-line) 1px, transparent 1px)",
        backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
      }}
    >
      <div
        className="grid"
        ref={cellsRef}
        style={{
          gridTemplateColumns: size
            ? `repeat(${size.columns}, ${CELL_SIZE}px)`
            : undefined,
          gridAutoRows: CELL_SIZE,
        }}
      >
        {size
          ? Array.from({ length: size.columns * size.rows }, (_, index) => (
              <div
                // Inset 1px from the top-left so the fill sits inside the lines.
                className="mt-px ml-px bg-[color-mix(in_oklab,var(--primary)_60%,var(--band))] opacity-0"
                // biome-ignore lint/suspicious/noArrayIndexKey: cells are fixed positions that never reorder
                key={index}
              />
            ))
          : null}
      </div>
    </div>
  );
}
