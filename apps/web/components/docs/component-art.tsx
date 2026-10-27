import type { ReactNode } from "react";
import type { ComponentGroup } from "@/lib/component-families";
import { cn } from "@/lib/utils";
import { ComponentFamilyArt } from "./component-family-art";

/*
 * A small line drawing for each component page and block category, shown on
 * the overview cards and in the header menus. Every shape takes its color
 * from the theme, so the drawings follow light and dark mode.
 */

type Fill =
  | "surface"
  | "well"
  | "ink"
  | "text"
  | "strong"
  | "inverse"
  | "outline"
  | "dash"
  | "faint";

const FILL: Record<Fill, string> = {
  surface: "fill-background stroke-foreground/15",
  well: "fill-muted",
  ink: "fill-foreground",
  text: "fill-muted-foreground/45",
  strong: "fill-foreground/75",
  inverse: "fill-background",
  outline: "fill-none stroke-foreground/25",
  dash: "fill-none stroke-foreground/30 [stroke-dasharray:4_3]",
  faint: "fill-foreground/10",
};

type Stroke = "line" | "faint" | "ink" | "inverse";

const STROKE: Record<Stroke, string> = {
  line: "stroke-foreground/60",
  faint: "stroke-foreground/20",
  ink: "stroke-foreground",
  inverse: "stroke-background",
};

/** Five steps of ink, for heatmaps and maps. */
const SHADES = [
  "fill-foreground/5",
  "fill-foreground/15",
  "fill-foreground/30",
  "fill-foreground/50",
  "fill-foreground/75",
];

interface BoxProps {
  x: number;
  y: number;
  w: number;
  h: number;
  r?: number;
  f?: Fill;
}

/** A box: a card, a button, an input. */
function B({ x, y, w, h, r = 6, f = "surface" }: BoxProps) {
  return <rect className={FILL[f]} height={h} rx={r} width={w} x={x} y={y} />;
}

/** A line of text, drawn as a rounded bar. */
function L({
  x,
  y,
  w,
  h = 4,
  f = "text",
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  f?: Fill;
}) {
  return (
    <rect className={FILL[f]} height={h} rx={h / 2} width={w} x={x} y={y} />
  );
}

function C({
  x,
  y,
  r,
  f = "surface",
}: {
  x: number;
  y: number;
  r: number;
  f?: Fill;
}) {
  return <circle className={FILL[f]} cx={x} cy={y} r={r} />;
}

/** A path: stroked by default, or filled when `f` is set. */
function P({
  d,
  s = "line",
  w = 1.5,
  f,
}: {
  d: string;
  s?: Stroke;
  w?: number;
  f?: Fill;
}) {
  return (
    <path
      className={f ? FILL[f] : cn("fill-none", STROKE[s])}
      d={d}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={f ? undefined : w}
    />
  );
}

/** A glyph or a short number, in the page's font. */
function T({
  x,
  y,
  children,
  size = 12,
  f = "strong",
  mono,
  bold,
  anchor = "middle",
}: {
  x: number;
  y: number;
  children: ReactNode;
  size?: number;
  f?: Fill;
  mono?: boolean;
  bold?: boolean;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      className={cn(FILL[f], mono && "font-mono", bold && "font-semibold")}
      fontSize={size}
      textAnchor={anchor}
      x={x}
      y={y}
    >
      {children}
    </text>
  );
}

/** A check mark centered on a point. */
function check(x: number, y: number, size = 4) {
  return `M${x - size} ${y}l${size * 0.7} ${size * 0.7} ${size * 1.3}-${size * 1.4}`;
}

function chevronDown(x: number, y: number) {
  return `M${x - 4} ${y - 2}l4 4 4-4`;
}

function chevronRight(x: number, y: number) {
  return `M${x - 2} ${y - 4}l4 4-4 4`;
}

function chevronLeft(x: number, y: number) {
  return `M${x + 2} ${y - 4}l-4 4 4 4`;
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}

function polar(
  cx: number,
  cy: number,
  r: number,
  degrees: number,
): [number, number] {
  const radians = ((degrees - 90) * Math.PI) / 180;
  return [round(cx + r * Math.cos(radians)), round(cy + r * Math.sin(radians))];
}

/** A ring segment from `r0` to `r1` between two angles (0 is up, clockwise). */
function sector(
  cx: number,
  cy: number,
  r0: number,
  r1: number,
  a0: number,
  a1: number,
) {
  const large = a1 - a0 > 180 ? 1 : 0;
  const [x0, y0] = polar(cx, cy, r1, a0);
  const [x1, y1] = polar(cx, cy, r1, a1);
  const [x2, y2] = polar(cx, cy, r0, a1);
  const [x3, y3] = polar(cx, cy, r0, a0);
  if (r0 === 0) {
    return `M${cx} ${cy}L${x0} ${y0}A${r1} ${r1} 0 ${large} 1 ${x1} ${y1}Z`;
  }
  return `M${x0} ${y0}A${r1} ${r1} 0 ${large} 1 ${x1} ${y1}L${x2} ${y2}A${r0} ${r0} 0 ${large} 0 ${x3} ${y3}Z`;
}

/** A sankey band of even thickness between two points. */
function flow(x1: number, y1: number, x2: number, y2: number, h: number) {
  const mid = round((x1 + x2) / 2);
  return `M${x1} ${y1}C${mid} ${y1} ${mid} ${y2} ${x2} ${y2}L${x2} ${y2 + h}C${mid} ${y2 + h} ${mid} ${y1 + h} ${x1} ${y1 + h}Z`;
}

function polygon(points: number[][]) {
  return `M${points.map(([x, y]) => `${x} ${y}`).join("L")}Z`;
}

/* Precomputed geometry for the charts and the radial pieces. */

const PIE = [
  { from: 0, to: 144, shade: "ink" as const },
  { from: 144, to: 234, shade: "strong" as const },
  { from: 234, to: 306, shade: "text" as const },
  { from: 306, to: 360, shade: "well" as const },
].map((slice) => ({
  ...slice,
  d: sector(120, 90, 0, 56, slice.from, slice.to),
}));

const RADAR_AXES = [0, 60, 120, 180, 240, 300];
const RADAR_RINGS = [20, 40, 60].map((r) => ({
  r,
  d: polygon(RADAR_AXES.map((angle) => polar(120, 92, r, angle))),
}));
const RADAR_SPOKES = RADAR_AXES.map((angle) => {
  const [x, y] = polar(120, 92, 60, angle);
  return { angle, d: `M120 92L${x} ${y}` };
});
const RADAR_DATA = polygon(
  [52, 34, 56, 28, 46, 40].map((r, index) =>
    polar(120, 92, r, RADAR_AXES[index] ?? 0),
  ),
);

const SUNBURST = [
  { a0: 0, a1: 130, r0: 22, r1: 44, f: "strong" as const },
  { a0: 130, a1: 250, r0: 22, r1: 44, f: "text" as const },
  { a0: 250, a1: 360, r0: 22, r1: 44, f: "well" as const },
  { a0: 0, a1: 70, r0: 46, r1: 66, f: "ink" as const },
  { a0: 70, a1: 130, r0: 46, r1: 66, f: "text" as const },
  { a0: 130, a1: 200, r0: 46, r1: 66, f: "strong" as const },
  { a0: 200, a1: 250, r0: 46, r1: 66, f: "well" as const },
  { a0: 250, a1: 320, r0: 46, r1: 66, f: "text" as const },
].map((part) => ({
  ...part,
  d: sector(120, 90, part.r0, part.r1, part.a0, part.a1),
}));

const SPHERE_NODES = [0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
  const [x, y] = polar(120, 90, 56, angle);
  return { angle, x, y };
});

/** Light streaks flying out of a vanishing point, like Light Speed. */
const STREAKS = Array.from({ length: 30 }, (_, index) => {
  const angle = (index / 30) * 360 + (index % 3) * 4;
  const start = 10 + ((index * 7) % 11) * 2;
  const end = start + 30 + ((index * 13) % 17) * 4;
  const [x1, y1] = polar(120, 90, start, angle);
  const [x2, y2] = polar(120, 90, end, angle);
  return {
    id: `streak-${angle}`,
    d: `M${x1} ${y1}L${x2} ${y2}`,
    opacity: round(0.35 + ((index * 5) % 7) / 10),
  };
});

const CALENDAR_DAYS = Array.from({ length: 35 }, (_, day) => ({
  day,
  x: 58 + (day % 7) * 18,
  y: 56 + Math.floor(day / 7) * 17,
}));

/** The picked day in ink, the next few as a range, and two blank leading days. */
function calendarDayClass(day: number) {
  if (day === 17) {
    return FILL.ink;
  }
  if (day > 17 && day < 21) {
    return FILL.faint;
  }
  return day < 2 ? "fill-none" : FILL.well;
}

const HEATMAP = Array.from({ length: 60 }, (_, cell) => ({
  cell,
  x: 30 + (cell % 10) * 18,
  y: 40 + Math.floor(cell / 10) * 18,
  shade: SHADES[(cell * 7 + Math.floor(cell / 10) * 3) % 5] ?? "",
}));

/** A rough continent for the choropleth, one digit (shade) per cell. */
const MAP_ROWS = [
  "..1222.....11..",
  ".133442...2342.",
  "12344431.234431",
  ".2344321.13442.",
  "..23321...1221.",
  "...121.....11..",
  "....1..........",
];
const MAP_CELLS = MAP_ROWS.flatMap((row, rowIndex) =>
  [...row].flatMap((cell, column) =>
    cell === "."
      ? []
      : [
          {
            id: `${rowIndex}-${column}`,
            x: 22 + column * 13.4,
            y: 40 + rowIndex * 14,
            shade: SHADES[Number(cell)] ?? "",
          },
        ],
  ),
);

const SCATTER = [
  [44, 128, 3],
  [56, 116, 4],
  [66, 122, 3],
  [74, 100, 5],
  [86, 108, 3],
  [94, 92, 4],
  [104, 98, 6],
  [112, 80, 3],
  [124, 86, 4],
  [132, 70, 5],
  [140, 78, 3],
  [150, 62, 4],
  [158, 66, 6],
  [170, 54, 3],
  [178, 48, 4],
  [190, 44, 5],
  [82, 128, 3],
  [118, 112, 3],
  [160, 96, 4],
  [196, 70, 3],
].map(([x = 0, y = 0, r = 3]) => ({ x, y, r }));

const CANDLES = [
  { x: 40, open: 110, close: 92, high: 84, low: 118 },
  { x: 60, open: 92, close: 100, high: 86, low: 108 },
  { x: 80, open: 100, close: 78, high: 70, low: 104 },
  { x: 100, open: 78, close: 86, high: 72, low: 96 },
  { x: 120, open: 86, close: 64, high: 56, low: 90 },
  { x: 140, open: 64, close: 74, high: 58, low: 84 },
  { x: 160, open: 74, close: 54, high: 46, low: 80 },
  { x: 180, open: 54, close: 62, high: 48, low: 70 },
  { x: 200, open: 62, close: 44, high: 38, low: 66 },
];

const BARS = [
  { x: 34, h: 46 },
  { x: 58, h: 70 },
  { x: 82, h: 38 },
  { x: 106, h: 84 },
  { x: 130, h: 62 },
  { x: 154, h: 96 },
  { x: 178, h: 74 },
  { x: 202, h: 54 },
];

const GRID_LINES = [50, 80, 110, 140];

const LINE_POINTS = "M30 124L60 106L90 112L120 82L150 90L180 62L210 52";
const LINE_SECOND = "M30 132L60 128L90 118L120 116L150 104L180 100L210 88";

const DOT_MATRIX = Array.from({ length: 25 }, (_, dot) => ({
  dot,
  x: 92 + (dot % 5) * 14,
  y: 62 + Math.floor(dot / 5) * 14,
  shade: SHADES[(dot * 3 + Math.floor(dot / 5)) % 5] ?? "",
}));

const ARTS: Record<string, () => ReactNode> = {
  /* Components (shadcn/ui) */
  accordion: () => (
    <>
      <B h={26} w={160} x={40} y={28} />
      <L f="strong" w={70} x={52} y={39} />
      <P d={chevronDown(184, 41)} />
      <B h={60} w={160} x={40} y={60} />
      <L f="strong" w={84} x={52} y={71} />
      <P d="M180 75l4-4 4 4" />
      <L w={124} x={52} y={88} />
      <L w={110} x={52} y={98} />
      <L w={70} x={52} y={108} />
      <B h={26} w={160} x={40} y={126} />
      <L f="strong" w={60} x={52} y={137} />
      <P d={chevronDown(184, 139)} />
    </>
  ),
  alert: () => (
    <>
      <B h={70} r={10} w={180} x={30} y={55} />
      <C f="outline" r={8} x={52} y={75} />
      <P d="M52 71v4" s="ink" />
      <C f="ink" r={1} x={52} y={79} />
      <L f="strong" h={5} w={84} x={68} y={71} />
      <L w={120} x={68} y={86} />
      <L w={92} x={68} y={97} />
    </>
  ),
  "alert-dialog": () => (
    <>
      <B f="well" h={180} r={0} w={240} x={0} y={0} />
      <B h={104} r={12} w={140} x={50} y={38} />
      <L f="strong" h={5} w={72} x={64} y={54} />
      <L w={110} x={64} y={68} />
      <L w={88} x={64} y={78} />
      <B h={18} r={6} w={40} x={96} y={112} />
      <L w={22} x={105} y={119} />
      <B f="ink" h={18} r={6} w={40} x={140} y={112} />
      <L f="inverse" w={24} x={148} y={119} />
    </>
  ),
  "aspect-ratio": () => (
    <>
      <B f="well" h={90} r={10} w={160} x={40} y={40} />
      <P d="M40 120L80 86L106 108L128 92L200 128V130H40Z" f="text" />
      <C f="text" r={9} x={170} y={62} />
      <P
        d="M34 52V34H52M188 34H206V52M206 118V136H188M52 136H34V118"
        s="faint"
      />
      <T mono size={10} x={120} y={156}>
        16:9
      </T>
    </>
  ),
  avatar: () => (
    <>
      <circle
        className="fill-muted stroke-background"
        cx={80}
        cy={90}
        r={24}
        strokeWidth={4}
      />
      <T f="text" size={14} x={80} y={95}>
        AR
      </T>
      <circle
        className="fill-background stroke-background"
        cx={120}
        cy={90}
        r={24}
        strokeWidth={4}
      />
      <circle
        className="fill-none stroke-foreground/15"
        cx={120}
        cy={90}
        r={22}
      />
      <T size={14} x={120} y={95}>
        JD
      </T>
      <circle
        className="fill-foreground stroke-background"
        cx={160}
        cy={90}
        r={24}
        strokeWidth={4}
      />
      <T f="inverse" size={13} x={160} y={95}>
        +3
      </T>
    </>
  ),
  badge: () => (
    <>
      <B f="ink" h={20} r={10} w={56} x={40} y={62} />
      <L f="inverse" w={32} x={52} y={70} />
      <B f="well" h={20} r={10} w={62} x={102} y={62} />
      <L f="strong" w={38} x={114} y={70} />
      <B f="outline" h={20} r={10} w={40} x={170} y={62} />
      <L w={20} x={180} y={70} />
      <B f="outline" h={20} r={10} w={72} x={64} y={94} />
      <C f="ink" r={3} x={77} y={104} />
      <L f="strong" w={42} x={86} y={102} />
      <B f="ink" h={20} r={10} w={44} x={142} y={94} />
      <P d={check(158, 104, 3)} s="inverse" />
      <L f="inverse" w={14} x={164} y={102} />
    </>
  ),
  breadcrumb: () => (
    <>
      <L w={34} x={32} y={88} />
      <P d={chevronRight(78, 90)} s="faint" />
      <L w={40} x={90} y={88} />
      <P d={chevronRight(142, 90)} s="faint" />
      <L w={6} x={152} y={88} />
      <L w={6} x={160} y={88} />
      <P d={chevronRight(176, 90)} s="faint" />
      <L f="ink" w={28} x={186} y={88} />
    </>
  ),
  button: () => (
    <>
      <B f="ink" h={28} r={8} w={128} x={56} y={56} />
      <L f="inverse" w={48} x={96} y={68} />
      <B h={28} r={8} w={128} x={56} y={96} />
      <L f="strong" w={48} x={96} y={108} />
    </>
  ),
  "button-group": () => (
    <>
      <B h={28} r={8} w={162} x={39} y={58} />
      <P d="M93 58v28M147 58v28" s="faint" />
      <L f="strong" w={30} x={51} y={70} />
      <L f="strong" w={30} x={105} y={70} />
      <L f="strong" w={30} x={159} y={70} />
      <B h={28} r={8} w={100} x={39} y={98} />
      <P d="M117 98v28" s="faint" />
      <L f="strong" w={50} x={53} y={110} />
      <P d={chevronDown(128, 112)} />
    </>
  ),
  calendar: () => (
    <>
      <B h={134} r={12} w={146} x={47} y={24} />
      <L f="strong" h={5} w={50} x={95} y={36} />
      <P d={chevronLeft(62, 38)} />
      <P d={chevronRight(178, 38)} />
      {CALENDAR_DAYS.map((cell) => (
        <rect
          className={calendarDayClass(cell.day)}
          height={12}
          key={cell.day}
          rx={3}
          width={12}
          x={cell.x}
          y={cell.y}
        />
      ))}
    </>
  ),
  card: () => (
    <>
      <B h={124} r={12} w={144} x={48} y={28} />
      <L f="strong" h={5} w={74} x={62} y={44} />
      <L w={104} x={62} y={56} />
      <B f="well" h={40} r={8} w={116} x={62} y={70} />
      <B f="ink" h={18} r={6} w={52} x={62} y={120} />
      <L f="inverse" w={30} x={73} y={127} />
      <B h={18} r={6} w={52} x={120} y={120} />
      <L w={30} x={131} y={127} />
    </>
  ),
  carousel: () => (
    <>
      <B f="well" h={88} r={10} w={40} x={14} y={46} />
      <B f="well" h={88} r={10} w={40} x={186} y={46} />
      <B h={110} r={12} w={112} x={64} y={35} />
      <B f="well" h={64} r={8} w={92} x={74} y={45} />
      <L f="strong" w={60} x={74} y={118} />
      <L w={40} x={74} y={128} />
      <C r={9} x={58} y={90} />
      <P d={chevronLeft(57, 90)} />
      <C r={9} x={182} y={90} />
      <P d={chevronRight(183, 90)} />
      <C f="ink" r={2.5} x={110} y={160} />
      <C f="text" r={2.5} x={120} y={160} />
      <C f="text" r={2.5} x={130} y={160} />
    </>
  ),
  checkbox: () => (
    <>
      <B f="ink" h={16} r={4} w={16} x={60} y={50} />
      <P d={check(68, 58)} s="inverse" />
      <L f="strong" w={84} x={86} y={56} />
      <B f="ink" h={16} r={4} w={16} x={60} y={82} />
      <P d={check(68, 90)} s="inverse" />
      <L f="strong" w={64} x={86} y={88} />
      <B h={16} r={4} w={16} x={60} y={114} />
      <L f="strong" w={74} x={86} y={120} />
    </>
  ),
  collapsible: () => (
    <>
      <L f="strong" h={5} w={92} x={44} y={38} />
      <B h={20} r={6} w={20} x={176} y={30} />
      <P d="M182 38l4-4 4 4M182 42l4 4 4-4" />
      <B h={26} r={7} w={152} x={44} y={58} />
      <L w={70} x={56} y={69} />
      <B h={26} r={7} w={152} x={44} y={90} />
      <L w={92} x={56} y={101} />
      <B h={26} r={7} w={152} x={44} y={122} />
      <L w={60} x={56} y={133} />
    </>
  ),
  combobox: () => (
    <>
      <B h={26} r={8} w={140} x={50} y={26} />
      <L f="strong" w={60} x={62} y={37} />
      <P d="M174 36l4-4 4 4M174 42l4 4 4-4" />
      <B h={96} r={10} w={140} x={50} y={60} />
      <C f="outline" r={4} x={63} y={74} />
      <P d="M66 77l3 3" />
      <L w={52} x={74} y={72} />
      <P d="M50 86h140" s="faint" />
      <L f="strong" w={64} x={62} y={96} />
      <B f="well" h={18} r={5} w={128} x={56} y={108} />
      <L f="strong" w={80} x={62} y={115} />
      <P d={check(172, 117)} s="ink" />
      <L f="strong" w={56} x={62} y={136} />
    </>
  ),
  command: () => (
    <>
      <B h={128} r={12} w={164} x={38} y={26} />
      <C f="outline" r={4.5} x={54} y={42} />
      <P d="M57.5 45.5l3 3" />
      <L w={64} x={68} y={40} />
      <P d="M38 56h164" s="faint" />
      <L h={3} w={30} x={50} y={66} />
      <B f="well" h={20} r={6} w={152} x={44} y={74} />
      <B f="text" h={10} r={3} w={10} x={52} y={79} />
      <L f="strong" w={64} x={70} y={82} />
      <B f="outline" h={12} r={3} w={22} x={168} y={78} />
      <B f="text" h={10} r={3} w={10} x={52} y={101} />
      <L f="strong" w={78} x={70} y={104} />
      <B f="outline" h={12} r={3} w={22} x={168} y={100} />
      <L h={3} w={36} x={50} y={124} />
      <B f="text" h={10} r={3} w={10} x={52} y={133} />
      <L f="strong" w={56} x={70} y={136} />
    </>
  ),
  "context-menu": () => (
    <>
      <B f="dash" h={100} r={10} w={120} x={22} y={30} />
      <L w={64} x={50} y={70} />
      <L w={44} x={60} y={80} />
      <P d="M108 94v15l4-4 5 7 3-2-5-7 6-1Z" f="ink" />
      <B h={94} r={10} w={96} x={120} y={64} />
      <B f="well" h={16} r={5} w={86} x={125} y={70} />
      <L f="strong" w={44} x={132} y={76} />
      <L f="strong" w={52} x={132} y={94} />
      <L h={3} w={16} x={188} y={95} />
      <L f="strong" w={36} x={132} y={110} />
      <P d="M120 124h96" s="faint" />
      <L f="strong" w={48} x={132} y={134} />
      <P d={chevronRight(202, 136)} />
    </>
  ),
  dialog: () => (
    <>
      <B f="well" h={180} r={0} w={240} x={0} y={0} />
      <B h={124} r={12} w={150} x={45} y={28} />
      <P d="M176 42l7 7m0-7-7 7" />
      <L f="strong" h={5} w={70} x={59} y={42} />
      <L w={98} x={59} y={54} />
      <L h={3} w={30} x={59} y={70} />
      <B h={16} r={5} w={122} x={59} y={77} />
      <L h={3} w={36} x={59} y={100} />
      <B h={16} r={5} w={122} x={59} y={107} />
      <B f="ink" h={16} r={5} w={44} x={137} y={129} />
      <L f="inverse" w={26} x={146} y={135} />
    </>
  ),
  drawer: () => (
    <>
      <L f="faint" w={90} x={24} y={20} />
      <L f="faint" w={140} x={24} y={32} />
      <B f="well" h={180} r={0} w={240} x={0} y={0} />
      <B h={120} r={16} w={204} x={18} y={74} />
      <B f="well" h={5} r={2.5} w={36} x={102} y={84} />
      <L f="strong" h={5} w={84} x={78} y={100} />
      <L w={110} x={65} y={113} />
      <B f="ink" h={20} r={6} w={124} x={58} y={130} />
      <L f="inverse" w={40} x={100} y={138} />
    </>
  ),
  "dropdown-menu": () => (
    <>
      <B h={22} r={7} w={72} x={40} y={26} />
      <L f="strong" w={36} x={50} y={35} />
      <P d={chevronDown(98, 37)} />
      <B h={100} r={10} w={128} x={40} y={54} />
      <L h={3} w={40} x={50} y={64} />
      <P d="M40 74h128" s="faint" />
      <B f="well" h={18} r={5} w={118} x={45} y={79} />
      <B f="text" h={8} r={2} w={8} x={52} y={84} />
      <L f="strong" w={50} x={66} y={86} />
      <L h={3} w={18} x={138} y={86} />
      <B f="text" h={8} r={2} w={8} x={52} y={104} />
      <L f="strong" w={60} x={66} y={106} />
      <L h={3} w={18} x={138} y={106} />
      <P d="M40 122h128" s="faint" />
      <B f="text" h={8} r={2} w={8} x={52} y={132} />
      <L f="strong" w={42} x={66} y={134} />
    </>
  ),
  empty: () => (
    <>
      <B f="dash" h={128} r={12} w={164} x={38} y={26} />
      <B h={28} r={8} w={28} x={106} y={44} />
      <P d="M113 54h14M113 60h10" />
      <L f="strong" h={5} w={70} x={85} y={86} />
      <L w={100} x={70} y={98} />
      <L w={74} x={83} y={108} />
      <B f="ink" h={18} r={6} w={50} x={95} y={122} />
      <L f="inverse" w={28} x={106} y={129} />
    </>
  ),
  field: () => (
    <>
      <L f="strong" w={46} x={50} y={40} />
      <B h={24} r={7} w={140} x={50} y={50} />
      <L w={64} x={60} y={60} />
      <L h={3} w={100} x={50} y={82} />
      <L f="strong" w={36} x={50} y={102} />
      <B h={24} r={7} w={140} x={50} y={112} />
      <L w={50} x={60} y={122} />
      <P d={chevronDown(176, 124)} />
      <L h={3} w={80} x={50} y={144} />
    </>
  ),
  "hover-card": () => (
    <>
      <L f="strong" w={60} x={40} y={34} />
      <P d="M40 44h60" />
      <B h={96} r={12} w={164} x={40} y={54} />
      <C f="well" r={13} x={64} y={78} />
      <L f="strong" h={5} w={64} x={84} y={72} />
      <L w={40} x={84} y={83} />
      <L w={136} x={54} y={102} />
      <L w={110} x={54} y={112} />
      <B f="text" h={8} r={2} w={8} x={54} y={128} />
      <L h={3} w={60} x={68} y={130} />
    </>
  ),
  input: () => (
    <>
      <B h={28} r={8} w={160} x={40} y={54} />
      <L w={70} x={52} y={66} />
      <rect
        className="fill-none stroke-foreground/10"
        height={36}
        rx={11}
        strokeWidth={4}
        width={168}
        x={36}
        y={92}
      />
      <B h={28} r={8} w={160} x={40} y={96} />
      <L f="strong" w={58} x={52} y={108} />
      <P d="M115 103v14" s="ink" />
    </>
  ),
  "input-group": () => (
    <>
      <B h={28} r={8} w={180} x={30} y={56} />
      <C f="outline" r={4.5} x={46} y={69} />
      <P d="M49.5 72.5l3 3" />
      <L w={70} x={60} y={68} />
      <B f="outline" h={14} r={4} w={30} x={172} y={63} />
      <L h={3} w={16} x={179} y={69} />
      <B h={28} r={8} w={180} x={30} y={96} />
      <path
        className={FILL.well}
        d="M38 96h46v28H38a8 8 0 0 1-8-8v-12a8 8 0 0 1 8-8Z"
      />
      <L w={30} x={42} y={108} />
      <L f="strong" w={56} x={94} y={108} />
      <B f="ink" h={20} r={6} w={34} x={172} y={100} />
      <L f="inverse" w={18} x={180} y={108} />
    </>
  ),
  "input-otp": () => (
    <>
      <B h={34} r={7} w={24} x={36} y={73} />
      <T size={16} x={48} y={96}>
        4
      </T>
      <B h={34} r={7} w={24} x={63} y={73} />
      <T size={16} x={75} y={96}>
        8
      </T>
      <B h={34} r={7} w={24} x={90} y={73} />
      <T size={16} x={102} y={96}>
        1
      </T>
      <P d="M117 90h6" />
      <B h={34} r={7} w={24} x={126} y={73} />
      <T size={16} x={138} y={96}>
        5
      </T>
      <rect
        className="fill-background stroke-foreground/70"
        height={34}
        rx={7}
        strokeWidth={1.5}
        width={24}
        x={153}
        y={73}
      />
      <P d="M165 82v16" s="ink" />
      <B h={34} r={7} w={24} x={180} y={73} />
    </>
  ),
  item: () => (
    <>
      <B h={36} r={8} w={172} x={34} y={32} />
      <B f="well" h={20} r={5} w={20} x={42} y={40} />
      <L f="strong" w={64} x={70} y={43} />
      <L w={90} x={70} y={53} />
      <P d={chevronRight(194, 50)} />
      <B h={36} r={8} w={172} x={34} y={72} />
      <C f="well" r={10} x={52} y={90} />
      <L f="strong" w={50} x={70} y={83} />
      <L w={76} x={70} y={93} />
      <B h={16} r={5} w={34} x={162} y={82} />
      <L w={20} x={169} y={88} />
      <B h={36} r={8} w={172} x={34} y={112} />
      <B f="well" h={20} r={5} w={20} x={42} y={120} />
      <L f="strong" w={72} x={70} y={123} />
      <L w={60} x={70} y={133} />
      <P d={chevronRight(194, 130)} />
    </>
  ),
  kbd: () => (
    <>
      <B f="well" h={44} r={9} w={44} x={44} y={72} />
      <B h={44} r={9} w={44} x={44} y={66} />
      <T size={20} x={66} y={95}>
        ⌘
      </T>
      <B f="well" h={44} r={9} w={44} x={98} y={72} />
      <B h={44} r={9} w={44} x={98} y={66} />
      <T size={20} x={120} y={95}>
        ⇧
      </T>
      <B f="well" h={44} r={9} w={44} x={152} y={72} />
      <B h={44} r={9} w={44} x={152} y={66} />
      <T bold size={18} x={174} y={94}>
        K
      </T>
    </>
  ),
  label: () => (
    <>
      <L f="strong" w={44} x={50} y={46} />
      <B h={26} r={7} w={140} x={50} y={56} />
      <L w={70} x={60} y={67} />
      <B f="ink" h={16} r={4} w={16} x={50} y={110} />
      <P d={check(58, 118)} s="inverse" />
      <L f="strong" w={92} x={74} y={116} />
    </>
  ),
  menubar: () => (
    <>
      <B h={26} r={8} w={196} x={22} y={26} />
      <B f="well" h={18} r={5} w={40} x={27} y={30} />
      <L f="strong" w={24} x={35} y={37} />
      <L f="strong" w={24} x={80} y={37} />
      <L f="strong" w={24} x={120} y={37} />
      <L f="strong" w={30} x={160} y={37} />
      <B h={92} r={10} w={118} x={27} y={58} />
      <L f="strong" w={54} x={38} y={70} />
      <L h={3} w={20} x={114} y={70} />
      <L f="strong" w={44} x={38} y={86} />
      <L h={3} w={20} x={114} y={86} />
      <P d="M27 100h118" s="faint" />
      <L f="strong" w={60} x={38} y={110} />
      <P d={chevronRight(131, 112)} />
      <L f="strong" w={40} x={38} y={128} />
    </>
  ),
  "native-select": () => (
    <>
      <L f="strong" w={50} x={50} y={46} />
      <B h={28} r={7} w={140} x={50} y={56} />
      <L f="strong" w={70} x={62} y={68} />
      <P d="M174 66l4-4 4 4M174 74l4 4 4-4" />
      <B f="well" h={28} r={7} w={140} x={50} y={100} />
      <L w={56} x={62} y={112} />
      <P d="M174 110l4-4 4 4M174 118l4 4 4-4" s="faint" />
    </>
  ),
  "navigation-menu": () => (
    <>
      <B h={26} r={8} w={200} x={20} y={24} />
      <B f="well" h={18} r={5} w={52} x={25} y={28} />
      <L f="strong" w={26} x={33} y={35} />
      <P d="M65 38l3-3 3 3" />
      <L f="strong" w={30} x={88} y={35} />
      <L f="strong" w={26} x={132} y={35} />
      <L f="strong" w={30} x={172} y={35} />
      <B h={100} r={12} w={200} x={20} y={56} />
      <B f="well" h={84} r={8} w={64} x={28} y={64} />
      <L f="strong" w={40} x={36} y={126} />
      <L w={48} x={36} y={136} />
      <L f="strong" w={58} x={104} y={70} />
      <L w={98} x={104} y={80} />
      <L f="strong" w={46} x={104} y={98} />
      <L w={86} x={104} y={108} />
      <L f="strong" w={62} x={104} y={126} />
      <L w={92} x={104} y={136} />
    </>
  ),
  pagination: () => (
    <>
      <B h={26} r={7} w={30} x={26} y={77} />
      <P d={chevronLeft(39, 90)} />
      <B f="outline" h={26} r={7} w={26} x={62} y={77} />
      <T size={11} x={75} y={94}>
        1
      </T>
      <B f="ink" h={26} r={7} w={26} x={94} y={77} />
      <T f="inverse" size={11} x={107} y={94}>
        2
      </T>
      <B f="outline" h={26} r={7} w={26} x={126} y={77} />
      <T size={11} x={139} y={94}>
        3
      </T>
      <C f="text" r={1.5} x={162} y={90} />
      <C f="text" r={1.5} x={168} y={90} />
      <C f="text" r={1.5} x={174} y={90} />
      <B h={26} r={7} w={30} x={184} y={77} />
      <P d={chevronRight(199, 90)} />
    </>
  ),
  popover: () => (
    <>
      <B h={84} r={12} w={152} x={44} y={24} />
      <P d="M76 108l7 7 7-7Z" f="inverse" />
      <P d="M76 108l7 7 7-7" s="faint" w={1} />
      <L f="strong" h={5} w={64} x={58} y={38} />
      <L w={104} x={58} y={50} />
      <L h={3} w={28} x={58} y={68} />
      <B h={14} r={4} w={84} x={98} y={63} />
      <L h={3} w={28} x={58} y={88} />
      <B h={14} r={4} w={84} x={98} y={83} />
      <B h={26} r={7} w={76} x={44} y={124} />
      <L f="strong" w={44} x={60} y={135} />
    </>
  ),
  progress: () => (
    <>
      <L f="strong" w={64} x={40} y={66} />
      <T anchor="end" mono size={11} x={200} y={71}>
        62%
      </T>
      <B f="well" h={12} r={6} w={160} x={40} y={80} />
      <B f="ink" h={12} r={6} w={100} x={40} y={80} />
      <B f="well" h={6} r={3} w={160} x={40} y={110} />
      <B f="strong" h={6} r={3} w={44} x={40} y={110} />
    </>
  ),
  "radio-group": () => (
    <>
      <C r={8} x={58} y={56} />
      <C f="ink" r={4} x={58} y={56} />
      <L f="strong" w={70} x={74} y={50} />
      <L w={100} x={74} y={60} />
      <C r={8} x={58} y={90} />
      <L f="strong" w={58} x={74} y={84} />
      <L w={86} x={74} y={94} />
      <C r={8} x={58} y={124} />
      <L f="strong" w={78} x={74} y={118} />
      <L w={70} x={74} y={128} />
    </>
  ),
  resizable: () => (
    <>
      <B h={124} r={12} w={196} x={22} y={28} />
      <P d="M100 28v124M100 92h118" s="faint" />
      <B h={22} r={4} w={10} x={95} y={79} />
      <P d="M98.5 85v10M101.5 85v10" s="faint" w={1} />
      <B h={10} r={4} w={22} x={148} y={87} />
      <P d="M154 90.5h10M154 93.5h10" s="faint" w={1} />
      <L f="strong" w={40} x={36} y={44} />
      <L w={52} x={36} y={56} />
      <L w={44} x={36} y={66} />
      <L f="strong" w={52} x={114} y={44} />
      <L w={80} x={114} y={56} />
      <L f="strong" w={46} x={114} y={108} />
      <L w={76} x={114} y={120} />
    </>
  ),
  "scroll-area": () => (
    <>
      <B h={128} r={12} w={144} x={48} y={26} />
      <L f="strong" w={50} x={60} y={40} />
      <P
        d="M60 54h104M60 72h104M60 90h104M60 108h104M60 126h104"
        s="faint"
        w={1}
      />
      <L w={70} x={60} y={60} />
      <L w={56} x={60} y={78} />
      <L w={82} x={60} y={96} />
      <L w={64} x={60} y={114} />
      <L w={74} x={60} y={132} />
      <B f="well" h={112} r={3} w={6} x={178} y={34} />
      <B f="strong" h={38} r={3} w={6} x={178} y={46} />
    </>
  ),
  select: () => (
    <>
      <B h={26} r={8} w={140} x={50} y={26} />
      <L f="strong" w={60} x={62} y={37} />
      <P d={chevronDown(176, 39)} />
      <B h={94} r={10} w={140} x={50} y={60} />
      <L h={3} w={36} x={62} y={70} />
      <L f="strong" w={64} x={62} y={84} />
      <B f="well" h={18} r={5} w={128} x={56} y={96} />
      <L f="strong" w={80} x={62} y={103} />
      <P d={check(174, 105)} s="ink" />
      <L f="strong" w={52} x={62} y={124} />
      <L f="strong" w={70} x={62} y={142} />
    </>
  ),
  separator: () => (
    <>
      <L f="strong" h={5} w={90} x={56} y={50} />
      <L w={124} x={56} y={63} />
      <P d="M56 82h128" s="line" w={1} />
      <L f="strong" w={28} x={56} y={98} />
      <P d="M94 92v16" s="line" w={1} />
      <L f="strong" w={28} x={104} y={98} />
      <P d="M142 92v16" s="line" w={1} />
      <L f="strong" w={30} x={152} y={98} />
    </>
  ),
  sheet: () => (
    <>
      <L f="faint" w={70} x={20} y={30} />
      <L f="faint" w={90} x={20} y={44} />
      <L f="faint" w={60} x={20} y={58} />
      <B f="well" h={180} r={0} w={240} x={0} y={0} />
      <B h={192} r={16} w={124} x={128} y={-6} />
      <P d="M214 18l7 7m0-7-7 7" />
      <L f="strong" h={5} w={56} x={142} y={30} />
      <L w={80} x={142} y={42} />
      <L h={3} w={28} x={142} y={62} />
      <B h={16} r={5} w={84} x={142} y={68} />
      <L h={3} w={34} x={142} y={94} />
      <B h={16} r={5} w={84} x={142} y={100} />
      <B f="ink" h={18} r={6} w={84} x={142} y={146} />
      <L f="inverse" w={34} x={167} y={153} />
    </>
  ),
  sidebar: () => (
    <>
      <B h={136} r={12} w={204} x={18} y={22} />
      <path
        className={FILL.well}
        d="M30 22h52v136H30a12 12 0 0 1-12-12V34a12 12 0 0 1 12-12Z"
      />
      <C f="ink" r={5} x={32} y={38} />
      <L f="strong" w={28} x={42} y={36} />
      <B h={16} r={5} w={56} x={22} y={54} />
      <B f="text" h={8} r={2} w={8} x={28} y={58} />
      <L f="strong" w={30} x={42} y={60} />
      <B f="text" h={8} r={2} w={8} x={28} y={78} />
      <L w={34} x={42} y={80} />
      <B f="text" h={8} r={2} w={8} x={28} y={96} />
      <L w={26} x={42} y={98} />
      <B f="text" h={8} r={2} w={8} x={28} y={114} />
      <L w={32} x={42} y={116} />
      <L f="strong" h={5} w={60} x={96} y={36} />
      <B f="well" h={36} r={7} w={54} x={96} y={52} />
      <B f="well" h={36} r={7} w={54} x={156} y={52} />
      <B f="well" h={52} r={7} w={114} x={96} y={94} />
    </>
  ),
  skeleton: () => (
    <>
      <C f="well" r={17} x={62} y={66} />
      <B f="well" h={9} r={4.5} w={104} x={88} y={56} />
      <B f="well" h={9} r={4.5} w={72} x={88} y={72} />
      <B f="well" h={44} r={9} w={150} x={45} y={98} />
    </>
  ),
  slider: () => (
    <>
      <B f="well" h={6} r={3} w={160} x={40} y={70} />
      <B f="ink" h={6} r={3} w={96} x={40} y={70} />
      <circle
        className="fill-background stroke-foreground"
        cx={136}
        cy={73}
        r={9}
        strokeWidth={2}
      />
      <B f="well" h={6} r={3} w={160} x={40} y={112} />
      <B f="strong" h={6} r={3} w={80} x={76} y={112} />
      <circle
        className="fill-background stroke-foreground"
        cx={76}
        cy={115}
        r={8}
        strokeWidth={2}
      />
      <circle
        className="fill-background stroke-foreground"
        cx={156}
        cy={115}
        r={8}
        strokeWidth={2}
      />
    </>
  ),
  sonner: () => (
    <>
      <B h={40} r={10} w={120} x={60} y={86} />
      <B h={42} r={10} w={132} x={54} y={94} />
      <B h={46} r={12} w={148} x={46} y={104} />
      <C f="ink" r={8} x={66} y={127} />
      <P d={check(66, 127, 3)} s="inverse" />
      <L f="strong" w={64} x={82} y={119} />
      <L w={80} x={82} y={130} />
      <B h={16} r={5} w={30} x={156} y={119} />
      <L w={16} x={163} y={125} />
    </>
  ),
  spinner: () => (
    <>
      <circle
        className="fill-none stroke-muted"
        cx={120}
        cy={70}
        r={22}
        strokeWidth={5}
      />
      <P d="M120 48a22 22 0 0 1 22 22" s="ink" w={5} />
      <B f="ink" h={24} r={7} w={96} x={72} y={116} />
      <circle
        className="fill-none stroke-background/30"
        cx={92}
        cy={128}
        r={6}
        strokeWidth={2}
      />
      <P d="M92 122a6 6 0 0 1 6 6" s="inverse" w={2} />
      <L f="inverse" w={44} x={106} y={126} />
    </>
  ),
  switch: () => (
    <>
      <B f="ink" h={26} r={13} w={46} x={64} y={56} />
      <C f="inverse" r={10} x={97} y={69} />
      <L f="strong" w={64} x={122} y={67} />
      <B f="well" h={26} r={13} w={46} x={64} y={98} />
      <circle
        className="fill-background stroke-foreground/15"
        cx={77}
        cy={111}
        r={10}
      />
      <L f="strong" w={50} x={122} y={109} />
    </>
  ),
  table: () => (
    <>
      <B h={118} r={10} w={196} x={22} y={32} />
      <L f="strong" w={34} x={34} y={44} />
      <L f="strong" w={30} x={98} y={44} />
      <L f="strong" w={26} x={160} y={44} />
      <P d="M22 56h196M22 80h196M22 104h196M22 128h196" s="faint" w={1} />
      <L w={46} x={34} y={66} />
      <L w={30} x={98} y={66} />
      <B f="well" h={12} r={6} w={36} x={160} y={62} />
      <L w={38} x={34} y={90} />
      <L w={40} x={98} y={90} />
      <B f="ink" h={12} r={6} w={36} x={160} y={86} />
      <L w={52} x={34} y={114} />
      <L w={26} x={98} y={114} />
      <B f="well" h={12} r={6} w={36} x={160} y={110} />
      <L w={30} x={34} y={137} />
      <L w={36} x={98} y={137} />
    </>
  ),
  tabs: () => (
    <>
      <B f="well" h={26} r={8} w={160} x={40} y={26} />
      <B h={20} r={6} w={52} x={43} y={29} />
      <L f="strong" w={30} x={54} y={37} />
      <L w={30} x={108} y={37} />
      <L w={30} x={156} y={37} />
      <B h={92} r={12} w={160} x={40} y={60} />
      <L f="strong" h={5} w={60} x={54} y={74} />
      <L w={110} x={54} y={86} />
      <B h={16} r={5} w={132} x={54} y={100} />
      <B f="ink" h={18} r={6} w={50} x={54} y={124} />
      <L f="inverse" w={28} x={65} y={131} />
    </>
  ),
  textarea: () => (
    <>
      <L f="strong" w={50} x={40} y={30} />
      <B h={100} r={10} w={160} x={40} y={40} />
      <L w={124} x={52} y={54} />
      <L w={136} x={52} y={66} />
      <L w={100} x={52} y={78} />
      <L f="strong" w={58} x={52} y={90} />
      <P d="M114 87v10" s="ink" />
      <P d="M186 130l8-8M190 132l4-4" s="faint" />
      <L h={3} w={40} x={160} y={148} />
    </>
  ),
  toggle: () => (
    <>
      <B f="well" h={52} r={10} w={52} x={56} y={64} />
      <T bold size={24} x={82} y={99}>
        B
      </T>
      <B f="outline" h={52} r={10} w={52} x={132} y={64} />
      <text
        className="fill-foreground/60 italic"
        fontSize={24}
        textAnchor="middle"
        x={158}
        y={99}
      >
        I
      </text>
    </>
  ),
  "toggle-group": () => (
    <>
      <B h={44} r={10} w={144} x={48} y={68} />
      <P d="M96 68v44M144 68v44" s="faint" />
      <B f="well" h={36} r={6} w={40} x={100} y={72} />
      <P d="M60 82h24M60 90h16M60 98h22" />
      <P d="M108 82h24M112 90h16M109 98h22" s="ink" />
      <P d="M156 82h24M164 90h16M158 98h22" />
    </>
  ),
  tooltip: () => (
    <>
      <B f="ink" h={28} r={7} w={100} x={70} y={54} />
      <L f="inverse" w={64} x={88} y={66} />
      <P d="M114 82l6 6 6-6Z" f="ink" />
      <B h={28} r={8} w={84} x={78} y={100} />
      <L f="strong" w={44} x={98} y={112} />
    </>
  ),

  /* Cortex */
  "command-search": () => (
    <>
      <B h={136} r={14} w={196} x={22} y={22} />
      <C f="outline" r={5} x={40} y={40} />
      <P d="M44 44l3.5 3.5" />
      <L f="strong" w={70} x={54} y={38} />
      <B f="outline" h={14} r={4} w={26} x={180} y={33} />
      <L h={3} w={14} x={186} y={39} />
      <P d="M22 56h196" s="faint" />
      <B f="ink" h={16} r={8} w={34} x={34} y={64} />
      <L f="inverse" h={3} w={18} x={42} y={70} />
      <B f="outline" h={16} r={8} w={42} x={74} y={64} />
      <L h={3} w={24} x={83} y={70} />
      <B f="outline" h={16} r={8} w={36} x={122} y={64} />
      <L h={3} w={20} x={130} y={70} />
      <B f="well" h={24} r={7} w={180} x={30} y={88} />
      <B h={14} r={4} w={14} x={37} y={93} />
      <L f="strong" w={70} x={58} y={95} />
      <P d="M196 100h-8m4-4 4 4-4 4" />
      <B f="text" h={14} r={4} w={14} x={37} y={119} />
      <L f="strong" w={84} x={58} y={121} />
      <B f="text" h={14} r={4} w={14} x={37} y={139} />
      <L f="strong" w={60} x={58} y={141} />
    </>
  ),
  "fan-out-diagram": () => (
    <>
      <P
        d="M98 84C80 84 82 52 64 52M98 96C80 96 82 128 64 128M142 84C160 84 158 52 176 52M142 96C160 96 158 128 176 128"
        s="faint"
        w={1.5}
      />
      <B f="ink" h={40} r={10} w={46} x={97} y={70} />
      <L f="inverse" w={24} x={108} y={88} />
      <B h={26} r={7} w={46} x={18} y={39} />
      <L f="strong" w={26} x={28} y={50} />
      <B h={26} r={7} w={46} x={18} y={115} />
      <L f="strong" w={22} x={28} y={126} />
      <B h={26} r={7} w={46} x={176} y={39} />
      <L f="strong" w={24} x={186} y={50} />
      <B h={26} r={7} w={46} x={176} y={115} />
      <L f="strong" w={28} x={186} y={126} />
      <C f="ink" r={2.5} x={64} y={52} />
      <C f="ink" r={2.5} x={64} y={128} />
      <C f="ink" r={2.5} x={176} y={52} />
      <C f="ink" r={2.5} x={176} y={128} />
    </>
  ),
  "faq-tabs-card": () => (
    <>
      <B h={136} r={14} w={196} x={22} y={22} />
      <B f="ink" h={18} r={9} w={46} x={34} y={34} />
      <L f="inverse" h={3} w={26} x={44} y={41.5} />
      <B f="outline" h={18} r={9} w={46} x={86} y={34} />
      <L h={3} w={26} x={96} y={41.5} />
      <B f="outline" h={18} r={9} w={46} x={138} y={34} />
      <L h={3} w={26} x={148} y={41.5} />
      <B f="well" h={46} r={8} w={172} x={34} y={62} />
      <L f="strong" w={96} x={44} y={72} />
      <P d="M190 74h8" />
      <L w={140} x={44} y={86} />
      <L w={110} x={44} y={96} />
      <B h={22} r={8} w={172} x={34} y={114} />
      <L f="strong" w={84} x={44} y={123} />
      <P d="M190 125h8M194 121v8" />
      <L f="strong" w={110} x={44} y={146} />
      <P d="M190 148h8M194 144v8" />
    </>
  ),
  "gooey-nav": () => (
    <>
      <B h={40} r={20} w={188} x={26} y={70} />
      <L f="strong" w={24} x={44} y={88} />
      <B f="ink" h={28} r={14} w={52} x={80} y={76} />
      <C f="ink" r={5} x={138} y={80} />
      <C f="ink" r={3} x={146} y={98} />
      <C f="ink" r={2} x={72} y={102} />
      <L f="inverse" w={28} x={92} y={88} />
      <L f="strong" w={24} x={148} y={88} />
      <L f="strong" w={20} x={182} y={88} />
    </>
  ),
  "lanyard-3d": () => (
    <>
      <P d="M112 0L114 64M128 0L126 64" s="line" w={1.5} />
      <B f="ink" h={64} r={0} w={12} x={114} y={0} />
      <circle
        className="fill-none stroke-foreground/60"
        cx={120}
        cy={70}
        r={6}
        strokeWidth={2}
      />
      <g transform="rotate(-12 120 120)">
        <B f="well" h={88} r={10} w={64} x={92} y={80} />
        <B h={88} r={10} w={64} x={88} y={76} />
        <B f="well" h={5} r={2.5} w={20} x={110} y={83} />
        <B f="well" h={22} r={5} w={22} x={98} y={98} />
        <L f="strong" h={5} w={40} x={98} y={128} />
        <L w={28} x={98} y={139} />
      </g>
    </>
  ),
  "lanyard-badge": () => (
    <>
      <B f="ink" h={62} r={0} w={14} x={113} y={0} />
      <P d="M120 6v6M120 18v6M120 30v6M120 42v6" s="inverse" w={2} />
      <circle
        className="fill-none stroke-foreground/60"
        cx={120}
        cy={66}
        r={5}
        strokeWidth={2}
      />
      <B h={100} r={10} w={76} x={82} y={70} />
      <B f="well" h={5} r={2.5} w={22} x={109} y={77} />
      <B f="ink" h={8} r={2} w={8} x={92} y={90} />
      <L f="strong" w={26} x={104} y={92} />
      <B f="outline" h={10} r={5} w={20} x={128} y={89} />
      <B f="well" h={24} r={5} w={24} x={92} y={106} />
      <L f="strong" h={6} w={46} x={92} y={140} />
      <L w={32} x={92} y={152} />
    </>
  ),
  "line-nav": () => (
    <>
      <L f="strong" w={30} x={40} y={50} />
      <L w={30} x={86} y={50} />
      <L w={30} x={132} y={50} />
      <L w={30} x={178} y={50} />
      <P d="M30 66h180" s="faint" w={1} />
      <P d="M40 66h30" s="ink" w={2.5} />
      <P d="M64 98v56" s="faint" w={1} />
      <P d="M64 104v14" s="ink" w={2.5} />
      <L f="strong" w={56} x={76} y={109} />
      <L w={46} x={76} y={125} />
      <L w={64} x={76} y={141} />
    </>
  ),
  "logos-carousel": () => (
    <>
      <P d="M0 56h240M0 124h240" s="faint" w={1} />
      <g className="opacity-30">
        <C f="strong" r={6} x={22} y={90} />
        <L f="strong" h={5} w={18} x={32} y={88} />
      </g>
      <g className="opacity-70">
        <P d="M66 96l7-12 7 12Z" f="strong" />
        <L f="strong" h={5} w={22} x={84} y={88} />
      </g>
      <g>
        <B f="strong" h={12} r={3} w={12} x={120} y={84} />
        <L f="strong" h={5} w={26} x={136} y={88} />
      </g>
      <g className="opacity-70">
        <C f="outline" r={6} x={182} y={90} />
        <C f="strong" r={2} x={182} y={90} />
        <L f="strong" h={5} w={16} x={192} y={88} />
      </g>
      <g className="opacity-30">
        <B f="strong" h={10} r={5} w={14} x={224} y={85} />
      </g>
    </>
  ),
  marquee: () => (
    <>
      <g className="opacity-40">
        <B h={30} r={8} w={56} x={-18} y={48} />
      </g>
      <B h={30} r={8} w={56} x={44} y={48} />
      <L f="strong" w={32} x={56} y={61} />
      <B h={30} r={8} w={56} x={106} y={48} />
      <L f="strong" w={30} x={118} y={61} />
      <g className="opacity-40">
        <B h={30} r={8} w={56} x={168} y={48} />
        <B h={30} r={8} w={56} x={230} y={48} />
      </g>
      <g className="opacity-40">
        <B h={30} r={8} w={56} x={14} y={94} />
      </g>
      <B h={30} r={8} w={56} x={76} y={94} />
      <L f="strong" w={28} x={88} y={107} />
      <B h={30} r={8} w={56} x={138} y={94} />
      <L f="strong" w={34} x={150} y={107} />
      <g className="opacity-40">
        <B h={30} r={8} w={56} x={200} y={94} />
      </g>
      <P d="M104 146h32M128 140l8 6-8 6" s="faint" />
    </>
  ),
  "number-ticker": () => (
    <>
      <T f="faint" mono size={30} x={62} y={58}>
        3
      </T>
      <T f="faint" mono size={30} x={92} y={58}>
        7
      </T>
      <T f="faint" mono size={30} x={150} y={58}>
        1
      </T>
      <T f="faint" mono size={30} x={180} y={58}>
        9
      </T>
      <T f="ink" mono size={30} x={62} y={102}>
        4
      </T>
      <T f="ink" mono size={30} x={92} y={102}>
        8
      </T>
      <T f="ink" mono size={30} x={121} y={102}>
        ,
      </T>
      <T f="ink" mono size={30} x={150} y={102}>
        2
      </T>
      <T f="ink" mono size={30} x={180} y={102}>
        1
      </T>
      <T f="faint" mono size={30} x={92} y={146}>
        9
      </T>
      <T f="faint" mono size={30} x={150} y={146}>
        3
      </T>
      <T f="faint" mono size={30} x={180} y={146}>
        2
      </T>
    </>
  ),
  "perspective-marquee": () => (
    <g transform="translate(120 92) skewX(-28) scale(1 0.62) translate(-120 -92)">
      <g className="opacity-40">
        <B h={30} r={7} w={60} x={10} y={20} />
        <B h={30} r={7} w={60} x={170} y={160} />
      </g>
      <B h={30} r={7} w={60} x={76} y={20} />
      <B h={30} r={7} w={60} x={142} y={20} />
      <B f="well" h={30} r={7} w={60} x={40} y={66} />
      <B h={30} r={7} w={60} x={106} y={66} />
      <B f="ink" h={30} r={7} w={60} x={172} y={66} />
      <B h={30} r={7} w={60} x={10} y={112} />
      <B f="well" h={30} r={7} w={60} x={76} y={112} />
      <B h={30} r={7} w={60} x={142} y={112} />
      <B h={30} r={7} w={60} x={40} y={160} />
      <B f="well" h={30} r={7} w={60} x={106} y={160} />
    </g>
  ),
  "sphere-menu": () => (
    <>
      <C f="dash" r={56} x={120} y={90} />
      {SPHERE_NODES.map((node) => (
        <g key={node.angle}>
          <C r={11} x={node.x} y={node.y} />
          <C f="text" r={3} x={node.x} y={node.y} />
        </g>
      ))}
      <C f="ink" r={17} x={120} y={90} />
      <P d="M114 90h12M120 84v12" s="inverse" w={2} />
    </>
  ),
  "theme-toggle-effect": () => (
    <>
      <B h={124} r={12} w={184} x={28} y={28} />
      <C f="ink" r={50} x={156} y={90} />
      <C f="outline" r={9} x={74} y={90} />
      <P d="M74 70v5M74 105v5M54 90h5M89 90h5M60 76l3.5 3.5M84.5 100.5L88 104M60 104l3.5-3.5M84.5 79.5L88 76" />
      <C f="inverse" r={13} x={156} y={90} />
      <C f="ink" r={11} x={162} y={84} />
    </>
  ),
  "work-experience": () => (
    <>
      <P d="M52 40v104" s="faint" w={1.5} />
      <C f="ink" r={5} x={52} y={46} />
      <B f="well" h={22} r={6} w={22} x={66} y={35} />
      <L f="strong" w={64} x={96} y={39} />
      <L w={46} x={96} y={49} />
      <L h={3} w={26} x={186} y={41} />
      <C r={5} x={52} y={92} />
      <B f="well" h={22} r={6} w={22} x={66} y={81} />
      <L f="strong" w={52} x={96} y={85} />
      <L w={70} x={96} y={95} />
      <L h={3} w={26} x={186} y={87} />
      <C r={5} x={52} y={138} />
      <B f="well" h={22} r={6} w={22} x={66} y={127} />
      <L f="strong" w={58} x={96} y={131} />
      <L w={40} x={96} y={141} />
      <L h={3} w={26} x={186} y={133} />
    </>
  ),

  /* Backgrounds */
  "light-speed": () => (
    <>
      <B f="ink" h={180} r={0} w={240} x={0} y={0} />
      {STREAKS.map((streak) => (
        <path
          className="stroke-background"
          d={streak.d}
          key={streak.id}
          opacity={streak.opacity}
          strokeLinecap="round"
          strokeWidth={1.5}
        />
      ))}
    </>
  ),

  /* Charts */
  "area-chart": () => (
    <>
      {GRID_LINES.map((y) => (
        <P d={`M30 ${y}h180`} key={y} s="faint" w={1} />
      ))}
      <P d={`${LINE_POINTS}V150H30Z`} f="faint" />
      <P d={LINE_POINTS} s="ink" w={2} />
    </>
  ),
  "bar-chart": () => (
    <>
      {GRID_LINES.map((y) => (
        <P d={`M28 ${y}h184`} key={y} s="faint" w={1} />
      ))}
      {BARS.map((bar) => (
        <rect
          className={bar.x === 154 ? FILL.ink : FILL.strong}
          height={bar.h}
          key={bar.x}
          rx={3}
          width={14}
          x={bar.x}
          y={150 - bar.h}
        />
      ))}
    </>
  ),
  "candlestick-chart": () => (
    <>
      {GRID_LINES.map((y) => (
        <P d={`M28 ${y}h184`} key={y} s="faint" w={1} />
      ))}
      {CANDLES.map((candle) => (
        <g key={candle.x}>
          <P d={`M${candle.x} ${candle.high}V${candle.low}`} s="line" w={1} />
          <rect
            className={
              candle.close < candle.open
                ? FILL.ink
                : "fill-background stroke-foreground/70"
            }
            height={Math.abs(candle.open - candle.close)}
            rx={2}
            width={10}
            x={candle.x - 5}
            y={Math.min(candle.open, candle.close)}
          />
        </g>
      ))}
    </>
  ),
  "choropleth-chart": () => (
    <>
      {MAP_CELLS.map((cell) => (
        <rect
          className={cell.shade}
          height={12}
          key={cell.id}
          rx={3}
          width={12}
          x={cell.x}
          y={cell.y}
        />
      ))}
      <B f="well" h={6} r={3} w={80} x={80} y={152} />
      <B f="strong" h={6} r={3} w={28} x={132} y={152} />
    </>
  ),
  "composed-chart": () => (
    <>
      {GRID_LINES.map((y) => (
        <P d={`M28 ${y}h184`} key={y} s="faint" w={1} />
      ))}
      {BARS.map((bar) => (
        <rect
          className={FILL.well}
          height={bar.h * 0.7}
          key={bar.x}
          rx={3}
          width={14}
          x={bar.x}
          y={150 - bar.h * 0.7}
        />
      ))}
      <P
        d="M41 112L65 98L89 104L113 76L137 84L161 58L185 66L209 48"
        s="ink"
        w={2}
      />
      <C f="ink" r={3} x={161} y={58} />
    </>
  ),
  "funnel-chart": () => (
    <>
      <P d="M34 34H206L190 62H50Z" f="ink" />
      <P d="M52 66H188L172 94H68Z" f="strong" />
      <P d="M70 98H170L156 126H84Z" f="text" />
      <P d="M86 130H154L142 158H98Z" f="well" />
    </>
  ),
  "gauge-chart": () => (
    <>
      <P d="M50 130A70 70 0 0 1 190 130" s="faint" w={14} />
      <path
        className="fill-none stroke-foreground"
        d="M50 130A70 70 0 0 1 151.8 67.6"
        strokeLinecap="round"
        strokeWidth={14}
      />
      <P d="M120 130L144 88" s="ink" w={3} />
      <C f="ink" r={6} x={120} y={130} />
      <T bold mono size={14} x={120} y={158}>
        65%
      </T>
    </>
  ),
  "heatmap-chart": () => (
    <>
      {HEATMAP.map((cell) => (
        <rect
          className={cell.shade}
          height={15}
          key={cell.cell}
          rx={3}
          width={15}
          x={cell.x}
          y={cell.y}
        />
      ))}
    </>
  ),
  "line-chart": () => (
    <>
      {GRID_LINES.map((y) => (
        <P d={`M30 ${y}h180`} key={y} s="faint" w={1} />
      ))}
      <path
        className="fill-none stroke-foreground/35 [stroke-dasharray:4_4]"
        d={LINE_SECOND}
        strokeWidth={2}
      />
      <P d={LINE_POINTS} s="ink" w={2} />
      <P d="M150 40V150" s="faint" w={1} />
      <circle
        className="fill-background stroke-foreground"
        cx={150}
        cy={90}
        r={4}
        strokeWidth={2}
      />
    </>
  ),
  "profit-loss-line": () => (
    <>
      <P d="M45 90L60 80L90 70L114 90Z" f="text" />
      <path className="fill-destructive/20" d="M30 100L45 90H30Z" />
      <path
        className="fill-destructive/20"
        d="M114 90L120 95L150 115L180 105L193.6 90Z"
      />
      <P d="M193.6 90L210 72V90Z" f="text" />
      <path
        className="fill-none stroke-foreground/30 [stroke-dasharray:4_4]"
        d="M30 90H210"
      />
      <P d="M30 100L60 80L90 70L120 95L150 115L180 105L210 72" s="ink" w={2} />
    </>
  ),
  "live-line-chart": () => (
    <>
      {GRID_LINES.map((y) => (
        <P d={`M24 ${y}h170`} key={y} s="faint" w={1} />
      ))}
      <P
        d="M24 118L44 110L60 116L78 98L96 104L114 86L130 92L148 74L166 80L182 64"
        s="ink"
        w={2}
      />
      <C f="faint" r={10} x={182} y={64} />
      <C f="ink" r={4} x={182} y={64} />
      <path
        className="fill-none stroke-foreground/30 [stroke-dasharray:3_3]"
        d="M186 64H196"
      />
      <B f="ink" h={16} r={4} w={32} x={198} y={56} />
      <L f="inverse" h={3} w={18} x={205} y={62.5} />
    </>
  ),
  "pie-chart": () => (
    <>
      {PIE.map((slice) => (
        <path
          className={cn(FILL[slice.shade], "stroke-background")}
          d={slice.d}
          key={slice.from}
          strokeWidth={2}
        />
      ))}
    </>
  ),
  "radar-chart": () => (
    <>
      {RADAR_RINGS.map((ring) => (
        <P d={ring.d} key={ring.r} s="faint" w={1} />
      ))}
      {RADAR_SPOKES.map((spoke) => (
        <P d={spoke.d} key={spoke.angle} s="faint" w={1} />
      ))}
      <path
        className="fill-foreground/15 stroke-foreground"
        d={RADAR_DATA}
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </>
  ),
  "ring-chart": () => (
    <>
      <circle
        className="fill-none stroke-muted"
        cx={120}
        cy={90}
        r={58}
        strokeWidth={10}
      />
      <circle
        className="fill-none stroke-muted"
        cx={120}
        cy={90}
        r={42}
        strokeWidth={10}
      />
      <circle
        className="fill-none stroke-muted"
        cx={120}
        cy={90}
        r={26}
        strokeWidth={10}
      />
      <circle
        className="fill-none stroke-foreground"
        cx={120}
        cy={90}
        r={58}
        strokeDasharray="273 365"
        strokeLinecap="round"
        strokeWidth={10}
        transform="rotate(-90 120 90)"
      />
      <circle
        className="fill-none stroke-foreground/60"
        cx={120}
        cy={90}
        r={42}
        strokeDasharray="160 264"
        strokeLinecap="round"
        strokeWidth={10}
        transform="rotate(-90 120 90)"
      />
      <circle
        className="fill-none stroke-foreground/35"
        cx={120}
        cy={90}
        r={26}
        strokeDasharray="120 164"
        strokeLinecap="round"
        strokeWidth={10}
        transform="rotate(-90 120 90)"
      />
    </>
  ),
  "scatter-chart": () => (
    <>
      <P d="M30 30V150H214" s="faint" w={1} />
      {SCATTER.map((dot) => (
        <circle
          className={dot.r > 4 ? "fill-foreground/80" : "fill-foreground/35"}
          cx={dot.x}
          cy={dot.y}
          key={`${dot.x}-${dot.y}`}
          r={dot.r}
        />
      ))}
    </>
  ),
  "sankey-chart": () => (
    <>
      <path className="fill-foreground/15" d={flow(36, 34, 112, 30, 34)} />
      <path className="fill-foreground/10" d={flow(36, 68, 112, 88, 22)} />
      <path className="fill-foreground/10" d={flow(36, 110, 112, 110, 30)} />
      <path className="fill-foreground/20" d={flow(120, 30, 196, 40, 34)} />
      <path className="fill-foreground/10" d={flow(120, 88, 196, 74, 22)} />
      <path className="fill-foreground/15" d={flow(120, 110, 196, 112, 30)} />
      <B f="ink" h={56} r={2} w={8} x={28} y={34} />
      <B f="strong" h={30} r={2} w={8} x={28} y={110} />
      <B f="ink" h={34} r={2} w={8} x={112} y={30} />
      <B f="strong" h={22} r={2} w={8} x={112} y={88} />
      <B f="text" h={30} r={2} w={8} x={112} y={110} />
      <B f="ink" h={56} r={2} w={8} x={196} y={40} />
      <B f="strong" h={30} r={2} w={8} x={196} y={112} />
    </>
  ),
  "sunburst-chart": () => (
    <>
      <C f="ink" r={20} x={120} y={90} />
      {SUNBURST.map((part) => (
        <path
          className={cn(FILL[part.f], "stroke-background")}
          d={part.d}
          key={`${part.r0}-${part.a0}`}
          strokeWidth={2}
        />
      ))}
    </>
  ),

  /* Block categories */
  "block-hero": () => (
    <>
      <B h={140} r={12} w={200} x={20} y={20} />
      <C f="ink" r={4} x={34} y={34} />
      <L h={3} w={18} x={128} y={33} />
      <L h={3} w={18} x={152} y={33} />
      <L h={3} w={18} x={176} y={33} />
      <B f="ink" h={10} r={3} w={14} x={198} y={29} />
      <L f="strong" h={7} w={110} x={65} y={54} />
      <L f="strong" h={7} w={80} x={80} y={66} />
      <L w={96} x={72} y={80} />
      <B f="ink" h={14} r={4} w={36} x={82} y={92} />
      <B h={14} r={4} w={36} x={122} y={92} />
      <B f="well" h={42} r={8} w={160} x={40} y={114} />
    </>
  ),
  "block-features": () => (
    <>
      <L f="strong" h={6} w={90} x={75} y={28} />
      <L w={120} x={60} y={40} />
      <B h={50} r={9} w={64} x={20} y={56} />
      <B h={50} r={9} w={64} x={88} y={56} />
      <B h={50} r={9} w={64} x={156} y={56} />
      <B f="well" h={22} r={5} w={52} x={26} y={62} />
      <L f="strong" h={3} w={34} x={26} y={92} />
      <B f="well" h={22} r={5} w={52} x={94} y={62} />
      <L f="strong" h={3} w={30} x={94} y={92} />
      <B f="well" h={22} r={5} w={52} x={162} y={62} />
      <L f="strong" h={3} w={38} x={162} y={92} />
      <B h={50} r={9} w={98} x={20} y={112} />
      <B h={50} r={9} w={98} x={122} y={112} />
      <B f="ink" h={22} r={5} w={86} x={26} y={118} />
      <B f="well" h={22} r={5} w={86} x={128} y={118} />
      <L f="strong" h={3} w={40} x={26} y={148} />
      <L f="strong" h={3} w={46} x={128} y={148} />
    </>
  ),
  "block-services": () => (
    <>
      <L f="strong" h={6} w={84} x={24} y={28} />
      <L w={110} x={24} y={40} />
      <B f="ink" h={14} r={4} w={44} x={176} y={28} />
      <B f="well" h={70} r={9} w={60} x={24} y={58} />
      <B f="well" h={70} r={9} w={60} x={90} y={58} />
      <B f="well" h={70} r={9} w={60} x={156} y={58} />
      <L f="strong" w={40} x={24} y={136} />
      <L f="strong" w={34} x={90} y={136} />
      <L f="strong" w={44} x={156} y={136} />
      <L h={3} w={52} x={24} y={146} />
      <L h={3} w={46} x={90} y={146} />
      <L h={3} w={50} x={156} y={146} />
    </>
  ),
  "block-ai-assistant": () => (
    <>
      <B f="well" h={26} r={10} w={110} x={110} y={24} />
      <L f="strong" w={80} x={122} y={35} />
      <C f="outline" r={5} x={34} y={66} />
      <C f="ink" r={2} x={34} y={66} />
      <L f="strong" w={64} x={46} y={64} />
      <P d={chevronDown(118, 66)} />
      <P d="M34 76v34" s="faint" w={1} />
      <L f="faint" w={130} x={46} y={80} />
      <L f="faint" w={110} x={46} y={90} />
      <L f="faint" w={124} x={46} y={100} />
      <L f="strong" w={170} x={30} y={122} />
      <L f="strong" w={150} x={30} y={133} />
      <L f="strong" w={96} x={30} y={144} />
    </>
  ),
  "block-loaders": () => (
    <>
      {DOT_MATRIX.map((cell) => (
        <rect
          className={cell.shade}
          height={10}
          key={cell.dot}
          rx={2}
          width={10}
          x={cell.x}
          y={cell.y}
        />
      ))}
      <L f="faint" h={4} w={60} x={90} y={142} />
    </>
  ),
  "block-stat-cards": () => (
    <>
      <B h={120} r={12} w={170} x={35} y={30} />
      <L h={3} w={56} x={49} y={46} />
      <B f="well" h={12} r={6} w={34} x={157} y={42} />
      <T anchor="start" bold mono size={22} x={48} y={78}>
        $6,525
      </T>
      <P
        d="M35 136L60 122L84 128L108 106L132 112L156 92L180 96L205 78V150H35Z"
        f="faint"
      />
      <P
        d="M35 136L60 122L84 128L108 106L132 112L156 92L180 96L205 78"
        s="ink"
        w={2}
      />
    </>
  ),
};

/** Whether a page or block category has a drawing of its own. */
export function hasComponentArt(name: string) {
  return name in ARTS;
}

/**
 * The drawing for a component page (by slug) or a block category (by
 * `block-<category>`). Pages without one fall back to their family's drawing.
 */
export function ComponentArt({
  name,
  family = "components",
  className,
}: {
  name: string;
  family?: ComponentGroup["category"];
  className?: string;
}) {
  const Art = ARTS[name];
  if (!Art) {
    return <ComponentFamilyArt category={family} className={className} />;
  }
  return (
    <svg
      aria-hidden="true"
      className={cn("block h-auto w-full", className)}
      fill="none"
      viewBox="0 0 240 180"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Art />
    </svg>
  );
}
