import { cn } from "@/lib/utils";

import { PixelArt } from "./kit";

/*
 * Extruded icons: a flat front shape pushed back along a depth vector, drawn
 * two ways from the same geometry. The line version is a thin wireframe; the
 * pixel version fills the front face and outlines the sides, cell by cell.
 * Coordinates are on a 20 x 20 grid.
 */

type Point = readonly [number, number];

export interface ExtrudedShape {
  /** Front faces (drawn nearest). */
  front: readonly (readonly Point[])[];
  /** Offset of the back faces; the sides are the quads in between. */
  depth: Point;
  /** Strokes on the front face; cut out of the pixel version. */
  details?: readonly (readonly Point[])[];
}

const GRID = 20;

function shift(polygon: readonly Point[], [dx, dy]: Point): Point[] {
  return polygon.map(([x, y]) => [x + dx, y + dy] as const);
}

function sideQuads(polygon: readonly Point[], depth: Point) {
  return polygon.map((start, index) => {
    const end = polygon[(index + 1) % polygon.length] ?? start;
    return [start, end, shift([end], depth)[0], shift([start], depth)[0]] as [
      Point,
      Point,
      Point,
      Point,
    ];
  });
}

function toPoints(polygon: readonly Point[]) {
  return polygon.map(([x, y]) => `${x},${y}`).join(" ");
}

function isInside([px, py]: Point, polygon: readonly Point[]) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const [xi, yi] = polygon[i] ?? [0, 0];
    const [xj, yj] = polygon[j] ?? [0, 0];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function distanceToSegment([px, py]: Point, [ax, ay]: Point, [bx, by]: Point) {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSquared = dx * dx + dy * dy;
  const t =
    lengthSquared === 0
      ? 0
      : Math.max(
          0,
          Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSquared),
        );
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function nearDetail(point: Point, details: readonly (readonly Point[])[]) {
  return details.some((line) =>
    line.some((start, index) => {
      const end = line[index + 1];
      return end ? distanceToSegment(point, start, end) < 0.6 : false;
    }),
  );
}

/** Rows for PixelArt: `#` front face, `+` sides, `.` empty. */
export function extrudedPixelRows(shape: ExtrudedShape) {
  const sides = shape.front.flatMap((polygon) => [
    shift(polygon, shape.depth),
    ...sideQuads(polygon, shape.depth),
  ]);
  const rows: string[] = [];
  for (let y = 0; y < GRID; y += 1) {
    let row = "";
    for (let x = 0; x < GRID; x += 1) {
      const center: Point = [x + 0.5, y + 0.5];
      if (shape.front.some((polygon) => isInside(center, polygon))) {
        row += nearDetail(center, shape.details ?? []) ? "." : "#";
      } else if (sides.some((polygon) => isInside(center, polygon))) {
        row += "+";
      } else {
        row += ".";
      }
    }
    rows.push(row);
  }
  return rows;
}

/** Thin wireframe, painted back to front so hidden edges stay hidden. */
export function ExtrudedLineIcon({
  shape,
  className,
}: {
  shape: ExtrudedShape;
  className?: string;
}) {
  const [dx, dy] = shape.depth;
  // Faces further along the depth vector are drawn first.
  const quads = shape.front
    .flatMap((polygon) => sideQuads(polygon, shape.depth))
    .map((quad) => {
      const midX = (quad[0][0] + quad[1][0]) / 2;
      const midY = (quad[0][1] + quad[1][1]) / 2;
      return { quad, order: midX * dx + midY * dy };
    })
    .sort((a, b) => a.order - b.order);

  const face = {
    className: "fill-background stroke-current",
    strokeLinejoin: "round" as const,
    strokeWidth: 1.25,
    vectorEffect: "non-scaling-stroke" as const,
  };

  return (
    <svg
      aria-hidden="true"
      className={cn("overflow-visible", className)}
      fill="none"
      viewBox={`0 0 ${GRID} ${GRID}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {shape.front.map((polygon) => (
        <polygon
          key={`back-${toPoints(polygon)}`}
          points={toPoints(shift(polygon, shape.depth))}
          {...face}
        />
      ))}
      {quads.map(({ quad }) => (
        <polygon
          key={`side-${toPoints(quad)}`}
          points={toPoints(quad)}
          {...face}
        />
      ))}
      {shape.front.map((polygon) => (
        <polygon
          key={`front-${toPoints(polygon)}`}
          points={toPoints(polygon)}
          {...face}
        />
      ))}
      {(shape.details ?? []).map((line) => (
        <polyline
          className="stroke-current"
          key={`detail-${toPoints(line)}`}
          points={toPoints(line)}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.25}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

/** Line art at rest; the pixel version fades in over it on hover of `group`. */
export function ExtrudedIcon({
  shape,
  className,
}: {
  shape: ExtrudedShape;
  className?: string;
}) {
  return (
    <span className={cn("relative block", className)}>
      <ExtrudedLineIcon
        className="absolute inset-0 size-full text-foreground transition-opacity duration-300 group-hover:opacity-0"
        shape={shape}
      />
      <PixelArt
        className="absolute inset-0 size-full text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        rows={extrudedPixelRows(shape)}
      />
    </span>
  );
}

/** A 2 x 2 tile block: a real component. */
export const COMPONENT_SHAPE: ExtrudedShape = {
  front: [
    [
      [2, 7],
      [13, 7],
      [13, 18],
      [2, 18],
    ],
  ],
  depth: [4, -4],
  details: [
    [
      [7.5, 7],
      [7.5, 18],
    ],
    [
      [2, 12.5],
      [13, 12.5],
    ],
  ],
};

/** A terminal window with a prompt: one command. */
export const TERMINAL_SHAPE: ExtrudedShape = {
  front: [
    [
      [1, 6],
      [15, 6],
      [15, 17],
      [1, 17],
    ],
  ],
  depth: [3.5, -3.5],
  details: [
    [
      [1, 8.5],
      [15, 8.5],
    ],
    [
      [4, 11],
      [6.5, 13],
      [4, 15],
    ],
    [
      [8.5, 15],
      [12, 15],
    ],
  ],
};

/** A pointer: yours to edit. */
export const CURSOR_SHAPE: ExtrudedShape = {
  front: [
    [
      [3, 1.5],
      [3, 15.5],
      [6.5, 12.3],
      [9, 17.8],
      [11.4, 16.7],
      [8.9, 11.4],
      [13.6, 11.4],
    ],
  ],
  depth: [2.5, 2.5],
};
