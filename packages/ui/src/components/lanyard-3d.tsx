"use client";

import {
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AmbientLight,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  DirectionalLight,
  DoubleSide,
  DynamicDrawUsage,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NoToneMapping,
  type Object3D,
  PerspectiveCamera,
  Plane,
  PMREMGenerator,
  Raycaster,
  RepeatWrapping,
  Scene,
  Shape,
  ShapeGeometry,
  SRGBColorSpace,
  type Texture,
  TorusGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { cn } from "@/lib/utils";

export interface Lanyard3DProps {
  /** Name on the front of the badge. */
  name?: string;
  /** Line under the name. */
  jobTitle?: string;
  /** Code under the barcode. */
  badgeId?: string;
  /** Tag in the top corner. Pass an empty string to hide it. */
  label?: string;
  /** Letters in the photo square. Taken from the name when left out. */
  initials?: string;
  /** Photo for the square instead of initials. The server must allow CORS. */
  photo?: string;
  /** Name beside the logo. */
  brand?: string;
  /** Logo image URL. The Cortexcn mark is drawn when left out. */
  logo?: string;
  /** Line under the logo on the back. */
  backText?: string;
  /** Your own artwork for the whole front, card-shaped. Replaces the layout. */
  frontImage?: string;
  /** Your own artwork for the whole back. */
  backImage?: string;
  /** Text repeated along the strap. */
  strapText?: string;
  strapColor?: string;
  cardColor?: string;
  /** Color of the text and marks on the card. */
  inkColor?: string;
  /** Strap length in px. */
  strapLength?: number;
  /** Card width in px. */
  cardWidth?: number;
  /** Card height in px. */
  cardHeight?: number;
  /** Pull of gravity on the strap and card. */
  gravity?: number;
  /** Swing the badge in from the side on mount. */
  dropIn?: boolean;
  className?: string;
}

interface BadgeContent {
  name: string;
  jobTitle: string;
  badgeId: string;
  label: string;
  initials: string;
  brand: string;
  backText: string;
  strapText: string;
  strapColor: string;
  cardColor: string;
  inkColor: string;
  logo?: string;
  photo?: string;
  frontImage?: string;
  backImage?: string;
}

interface Vec {
  x: number;
  y: number;
  z: number;
}

interface Point extends Vec {
  px: number;
  py: number;
  pz: number;
  /** Inverse mass. Zero holds the point still. */
  w: number;
}

interface Link {
  a: Point;
  b: Point;
  length: number;
}

const CARD_KEYS = ["top", "bottom", "left", "right", "front", "back"] as const;
type CardKey = (typeof CARD_KEYS)[number];
type CardPoints = Record<CardKey, Point>;

const SEGMENTS = 12;
const ITERATIONS = 24;
const DAMPING = 0.985;
/** From the top of the card to the end of the strap, through the clip. */
const CLIP = 18;
const STEP_MS = 1000 / 60;
const CLICK_SLOP = 5;
const FOV = 30;
const CARD_DEPTH = 3;
const BEVEL = 0.8;
const CARD_RADIUS = 18;
const STRAP_WIDTH = 18;
const STRAP_SAMPLES = 64;
const TEXTURE_SCALE = 3;
const STRAP_TEXTURE_SCALE = 4;
/** The card is heavier than the strap, so it pulls the strap more than back. */
const CARD_INVERSE_MASS = 0.35;
/** Twist of the strap that turns the card back to face you. */
const TWIST_STIFFNESS = 0.012;
const TWIST_DAMPING = 0.12;
const WHITESPACE = /\s+/;
const HEX_COLOR = /^#([0-9a-f]{6})$/i;

/** The Cortexcn mark on a 3 by 3 grid. */
const MARK_PATHS = [
  "M.17 0H.83A.17 .17 0 0 1 1 .17V.83A.17 .17 0 0 1 .83 1H.17A.17 .17 0 0 1 0 .83V.17A.17 .17 0 0 1 .17 0Z",
  "M2.17 2H2.83A.17 .17 0 0 1 3 2.17V2.83A.17 .17 0 0 1 2.83 3H2.17A.17 .17 0 0 1 2 2.83V2.17A.17 .17 0 0 1 2.17 2Z",
  "M2.17 0H2.83A.17 .17 0 0 1 3 .17V.83A.17 .17 0 0 1 2.83 1H2.32A.32 .32 0 0 0 2 1.32V1.83A.17 .17 0 0 1 1.83 2H1.32A.32 .32 0 0 0 1 2.32V2.83A.17 .17 0 0 1 .83 3H.17A.17 .17 0 0 1 0 2.83V2.17A.17 .17 0 0 1 .17 2H.68A.32 .32 0 0 0 1 1.68V1.17A.17 .17 0 0 1 1.17 1H1.68A.32 .32 0 0 0 2 .68V.17A.17 .17 0 0 1 2.17 0Z",
];

/** Barcode bar widths for the footer. */
const BARS = [
  2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2,
];

/* ------------------------------------------------------------------ */
/* Physics: a verlet rope with a rigid card of six points on its end.  */
/* ------------------------------------------------------------------ */

function makePoint({ x, y, z }: Vec, w: number): Point {
  return { x, y, z, px: x, py: y, pz: z, w };
}

function distance(a: Vec, b: Vec) {
  return Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z);
}

function wrapAngle(angle: number) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

/** Shrinks the card to fit a box narrower than it, never below half size. */
function fitScale(boxWidth: number, cardWidth: number) {
  return clamp((boxWidth - 24) / cardWidth, 0.5, 1);
}

/** Moves both ends of a link back to its length, the lighter end the most. */
function constrain({ a, b, length }: Link) {
  const total = a.w + b.w;
  if (total === 0) {
    return;
  }
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dz = b.z - a.z;
  const current = Math.hypot(dx, dy, dz);
  if (current < 1e-6) {
    return;
  }
  const diff = (current - length) / current / total;
  a.x += dx * diff * a.w;
  a.y += dy * diff * a.w;
  a.z += dz * diff * a.w;
  b.x -= dx * diff * b.w;
  b.y -= dy * diff * b.w;
  b.z -= dz * diff * b.w;
}

function integrate(points: Point[], gravity: number) {
  for (const p of points) {
    const vx = (p.x - p.px) * DAMPING;
    const vy = (p.y - p.py) * DAMPING;
    const vz = (p.z - p.pz) * DAMPING;
    p.px = p.x;
    p.py = p.y;
    p.pz = p.z;
    p.x += vx;
    p.y += vy - gravity;
    p.z += vz;
  }
}

/** Where the card would sit on the card's own frame, with the top at 0. */
function cardLayout(width: number, height: number): Record<CardKey, Vec> {
  // Two points off the face, front and back, so the card cannot fold.
  const depth = width * 0.35;
  return {
    top: { x: 0, y: 0, z: 0 },
    bottom: { x: 0, y: -height, z: 0 },
    left: { x: -width / 2, y: -height / 2, z: 0 },
    right: { x: width / 2, y: -height / 2, z: 0 },
    front: { x: 0, y: -height / 2, z: depth },
    back: { x: 0, y: -height / 2, z: -depth },
  };
}

/** Every pair of card points held at its distance, which makes it rigid. */
function cardLinks(card: CardPoints, layout: Record<CardKey, Vec>): Link[] {
  const links: Link[] = [];
  CARD_KEYS.forEach((first, i) => {
    for (const second of CARD_KEYS.slice(i + 1)) {
      links.push({
        a: card[first],
        b: card[second],
        length: distance(layout[first], layout[second]),
      });
    }
  });
  return links;
}

function cardCenter(card: CardPoints): Vec {
  return {
    x: (card.left.x + card.right.x) / 2,
    y: (card.left.y + card.right.y) / 2,
    z: (card.left.z + card.right.z) / 2,
  };
}

/** Which way the face points, as a turn about the vertical. 0 faces you. */
function cardYaw(card: CardPoints) {
  const center = cardCenter(card);
  return Math.atan2(card.front.x - center.x, card.front.z - center.z);
}

function rotateAboutVertical(points: Point[], center: Vec, angle: number) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  for (const p of points) {
    const dx = p.x - center.x;
    const dz = p.z - center.z;
    p.x = center.x + dx * cos + dz * sin;
    p.z = center.z - dx * sin + dz * cos;
  }
}

function withinReach(target: Vec, anchor: Vec, reach: number): Vec {
  const dx = target.x - anchor.x;
  const dy = target.y - anchor.y;
  const dz = target.z - anchor.z;
  const length = Math.hypot(dx, dy, dz);
  if (length <= reach) {
    return target;
  }
  const k = reach / length;
  return { x: anchor.x + dx * k, y: anchor.y + dy * k, z: anchor.z + dz * k };
}

interface Sim {
  anchor: Point;
  end: Point;
  rope: Point[];
  ropeLinks: Link[];
  card: CardPoints;
  cardPoints: Point[];
  cardLinks: Link[];
  clipLink: Link;
  segment: number;
  strapLength: number;
  baseWidth: number;
  baseHeight: number;
  fit: number;
  gravity: number;
  dragging: boolean;
  grab: number;
  pointer: Vec;
  flipped: boolean;
  lastYaw: number;
  still: number;
}

interface SimOptions {
  strapLength: number;
  cardWidth: number;
  cardHeight: number;
  gravity: number;
}

/** Lays the strap out from the anchor, straight down or off to one side. */
function createSim(
  options: SimOptions,
  anchorAt: Vec,
  fit: number,
  swingIn: boolean,
): Sim {
  const angle = swingIn ? Math.PI / 2.6 : 0;
  const down = { x: Math.sin(angle), y: -Math.cos(angle), z: 0 };
  const right = { x: Math.cos(angle), y: Math.sin(angle), z: 0 };
  const segment = options.strapLength / SEGMENTS;
  const along = (length: number): Vec => ({
    x: anchorAt.x + down.x * length,
    y: anchorAt.y + down.y * length,
    z: anchorAt.z,
  });
  const anchor = makePoint(anchorAt, 0);
  const rest = Array.from({ length: SEGMENTS }, (_, i) =>
    makePoint(along(segment * (i + 1)), 1),
  );
  const rope = [anchor, ...rest];
  const end = rest.at(-1) ?? anchor;
  const ropeLinks = rope.slice(1).map((b, i) => ({
    a: rope[i] ?? anchor,
    b,
    length: segment,
  }));

  const width = options.cardWidth * fit;
  const height = options.cardHeight * fit;
  const top = along(options.strapLength + CLIP * fit);
  const layout = cardLayout(width, height);
  const place = ({ x, y, z }: Vec): Vec => ({
    x: top.x + right.x * x - down.x * y,
    y: top.y + right.y * x - down.y * y,
    z: top.z + z,
  });
  const card = Object.fromEntries(
    CARD_KEYS.map((key) => [
      key,
      makePoint(place(layout[key]), CARD_INVERSE_MASS),
    ]),
  ) as CardPoints;

  return {
    anchor,
    end,
    rope,
    ropeLinks,
    card,
    cardPoints: CARD_KEYS.map((key) => card[key]),
    cardLinks: cardLinks(card, layout),
    clipLink: { a: end, b: card.top, length: CLIP * fit },
    segment,
    strapLength: options.strapLength,
    baseWidth: options.cardWidth,
    baseHeight: options.cardHeight,
    fit,
    gravity: options.gravity,
    dragging: false,
    grab: 0.5,
    pointer: { x: 0, y: 0, z: 0 },
    flipped: false,
    lastYaw: 0,
    still: 0,
  };
}

function setFit(sim: Sim, fit: number) {
  sim.fit = fit;
  sim.cardLinks = cardLinks(
    sim.card,
    cardLayout(sim.baseWidth * fit, sim.baseHeight * fit),
  );
  sim.clipLink.length = CLIP * fit;
}

/** Moves the card so the grabbed spot sits under the pointer. */
function dragCard(sim: Sim) {
  const { top, bottom } = sim.card;
  // Where the top would go with the grabbed spot under the pointer, kept
  // within the strap's reach so the strap never has to stretch.
  const wanted = {
    x: sim.pointer.x - (bottom.x - top.x) * sim.grab,
    y: sim.pointer.y - (bottom.y - top.y) * sim.grab,
    z: sim.pointer.z - (bottom.z - top.z) * sim.grab,
  };
  const target = withinReach(
    wanted,
    sim.anchor,
    sim.strapLength + sim.clipLink.length,
  );
  const dx = target.x - top.x;
  const dy = target.y - top.y;
  const dz = target.z - top.z;
  for (const p of sim.cardPoints) {
    p.x += dx;
    p.y += dy;
    p.z += dz;
  }
}

/** The strap's twist turns the card toward its side, and a swing turns it. */
function twist(sim: Sim) {
  const yaw = cardYaw(sim.card);
  const rate = wrapAngle(yaw - sim.lastYaw);
  sim.lastYaw = yaw;
  const center = cardCenter(sim.card);
  const sideways =
    (sim.card.left.x -
      sim.card.left.px +
      sim.card.right.x -
      sim.card.right.px) /
    2;
  const target =
    (sim.flipped ? Math.PI : 0) + clamp(sideways * 0.035, -0.7, 0.7);
  const turn = wrapAngle(target - yaw) * TWIST_STIFFNESS - rate * TWIST_DAMPING;
  rotateAboutVertical(sim.cardPoints, center, turn);
  return Math.abs(rate);
}

function solve(sim: Sim) {
  const cardWeight = sim.dragging ? 0 : CARD_INVERSE_MASS;
  for (const p of sim.cardPoints) {
    p.w = cardWeight;
  }
  const reversed = [...sim.ropeLinks].reverse();
  for (let i = 0; i < ITERATIONS; i++) {
    // Sweeping the strap both ways spreads a pull along it much faster.
    for (const link of i % 2 === 0 ? sim.ropeLinks : reversed) {
      constrain(link);
    }
    constrain(sim.clipLink);
    for (const link of sim.cardLinks) {
      constrain(link);
    }
  }
}

function pullWithin(p: Point, from: Vec, length: number) {
  const dx = p.x - from.x;
  const dy = p.y - from.y;
  const dz = p.z - from.z;
  const current = Math.hypot(dx, dy, dz);
  if (current <= length) {
    return null;
  }
  const k = 1 - length / current;
  return { x: dx * k, y: dy * k, z: dz * k };
}

function pullToward(p: Point, from: Vec, length: number) {
  const excess = pullWithin(p, from, length);
  if (excess) {
    p.x -= excess.x;
    p.y -= excess.y;
    p.z -= excess.z;
  }
}

function tightenFromAnchor(sim: Sim) {
  let previous: Vec = sim.anchor;
  for (const p of sim.rope.slice(1)) {
    pullToward(p, previous, sim.segment);
    previous = p;
  }
}

function tightenFromCard(sim: Sim) {
  pullToward(sim.end, sim.card.top, sim.clipLink.length);
  let next: Vec = sim.end;
  for (const p of sim.rope.slice(1, -1).reverse()) {
    pullToward(p, next, sim.segment);
    next = p;
  }
}

/**
 * Takes up any stretch the solver left, so the strap never looks longer than
 * it is or loose from the clip. A held card stays put and the strap comes to
 * it; a free card is pulled back to the strap.
 */
function tighten(sim: Sim) {
  if (sim.dragging) {
    for (let i = 0; i < 3; i++) {
      tightenFromCard(sim);
      tightenFromAnchor(sim);
    }
    return;
  }
  tightenFromAnchor(sim);
  const excess = pullWithin(sim.card.top, sim.end, sim.clipLink.length);
  if (excess) {
    for (const p of sim.cardPoints) {
      p.x -= excess.x;
      p.y -= excess.y;
      p.z -= excess.z;
    }
  }
}

/** One fixed physics step. */
function step(sim: Sim) {
  integrate(sim.rope.slice(1), sim.gravity);
  integrate(sim.cardPoints, sim.gravity);
  if (sim.dragging) {
    dragCard(sim);
  }
  const spin = twist(sim);
  solve(sim);
  tighten(sim);
  let motion = spin * 40;
  for (const p of sim.cardPoints) {
    motion +=
      Math.abs(p.x - p.px) + Math.abs(p.y - p.py) + Math.abs(p.z - p.pz);
  }
  sim.still = !sim.dragging && motion < 0.12 ? sim.still + 1 : 0;
}

/** Turns the card half way round at once, for reduced motion. */
function flipAtOnce(sim: Sim) {
  rotateAboutVertical(sim.cardPoints, cardCenter(sim.card), Math.PI);
  for (const p of sim.cardPoints) {
    p.px = p.x;
    p.py = p.y;
    p.pz = p.z;
  }
  sim.lastYaw = cardYaw(sim.card);
}

/* ------------------------------------------------------------------ */
/* Drawing the card faces and the strap on canvases.                   */
/* ------------------------------------------------------------------ */

interface Fonts {
  sans: string;
  mono: string;
}

type Images = Partial<
  Record<"logo" | "photo" | "frontImage" | "backImage", HTMLImageElement>
>;

function drawCover(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const scale = Math.max(
    width / image.naturalWidth,
    height / image.naturalHeight,
  );
  const sw = width / scale;
  const sh = height / scale;
  ctx.drawImage(
    image,
    (image.naturalWidth - sw) / 2,
    (image.naturalHeight - sh) / 2,
    sw,
    sh,
    x,
    y,
    width,
    height,
  );
}

function drawMark(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  logo?: HTMLImageElement,
) {
  if (logo) {
    ctx.drawImage(logo, x, y, size, size);
    return;
  }
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 3, size / 3);
  ctx.fillStyle = color;
  for (const d of MARK_PATHS) {
    ctx.fill(new Path2D(d));
  }
  ctx.restore();
}

function ellipsize(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  if (ctx.measureText(text).width <= maxWidth) {
    return text;
  }
  let end = text.length;
  while (
    end > 0 &&
    ctx.measureText(`${text.slice(0, end)}…`).width > maxWidth
  ) {
    end--;
  }
  return `${text.slice(0, end)}…`;
}

/** The slot the clip goes through. */
function drawSlot(ctx: CanvasRenderingContext2D, width: number) {
  ctx.fillStyle = "rgb(0 0 0 / 0.16)";
  ctx.beginPath();
  ctx.roundRect(width / 2 - 22, 12, 44, 8, 4);
  ctx.fill();
}

function drawHeader(
  ctx: CanvasRenderingContext2D,
  content: BadgeContent,
  images: Images,
  fonts: Fonts,
  width: number,
) {
  const pad = 20;
  drawMark(ctx, pad, 38, 20, content.inkColor, images.logo);
  ctx.fillStyle = content.inkColor;
  ctx.textBaseline = "middle";
  ctx.font = `600 14px ${fonts.sans}`;
  ctx.fillText(ellipsize(ctx, content.brand, width - 140), pad + 28, 48.5);
  if (!content.label) {
    return;
  }
  ctx.font = `500 10px ${fonts.mono}`;
  const pillWidth = ctx.measureText(content.label).width + 16;
  const x = width - pad - pillWidth;
  ctx.beginPath();
  ctx.roundRect(x + 0.5, 38.5, pillWidth - 1, 20, 10);
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = content.inkColor;
  ctx.stroke();
  ctx.globalAlpha = 0.6;
  ctx.textAlign = "center";
  ctx.fillText(content.label, x + pillWidth / 2, 49);
  ctx.globalAlpha = 1;
  ctx.textAlign = "left";
}

function drawPerson(
  ctx: CanvasRenderingContext2D,
  content: BadgeContent,
  images: Images,
  fonts: Fonts,
  width: number,
  height: number,
) {
  const pad = 20;
  const roleY = height - pad - 32 - 28;
  const nameY = roleY - 24;
  const avatarY = nameY - 24 - 14 - 64;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(pad, avatarY, 64, 64, 16);
  ctx.clip();
  if (images.photo) {
    drawCover(ctx, images.photo, pad, avatarY, 64, 64);
  } else {
    ctx.globalAlpha = 0.07;
    ctx.fillStyle = content.inkColor;
    ctx.fillRect(pad, avatarY, 64, 64);
    ctx.globalAlpha = 1;
    ctx.font = `600 20px ${fonts.sans}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(content.initials, pad + 32, avatarY + 33);
    ctx.textAlign = "left";
  }
  ctx.restore();
  ctx.fillStyle = content.inkColor;
  ctx.textBaseline = "alphabetic";
  ctx.font = `600 24px ${fonts.sans}`;
  ctx.fillText(ellipsize(ctx, content.name, width - pad * 2), pad, nameY);
  ctx.globalAlpha = 0.6;
  ctx.font = `400 14px ${fonts.sans}`;
  ctx.fillText(ellipsize(ctx, content.jobTitle, width - pad * 2), pad, roleY);
  ctx.globalAlpha = 1;
}

function drawFooter(
  ctx: CanvasRenderingContext2D,
  content: BadgeContent,
  fonts: Fonts,
  width: number,
  height: number,
) {
  const pad = 20;
  ctx.fillStyle = content.inkColor;
  let x = pad;
  for (const bar of BARS) {
    ctx.fillRect(x, height - pad - 32, bar, 32);
    x += bar + 2;
  }
  ctx.globalAlpha = 0.6;
  ctx.font = `500 10px ${fonts.mono}`;
  ctx.textAlign = "right";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(content.badgeId, width - pad, height - pad);
  ctx.globalAlpha = 1;
  ctx.textAlign = "left";
}

function drawFront(
  ctx: CanvasRenderingContext2D,
  content: BadgeContent,
  images: Images,
  fonts: Fonts,
  width: number,
  height: number,
) {
  ctx.fillStyle = content.cardColor;
  ctx.fillRect(0, 0, width, height);
  if (images.frontImage) {
    drawCover(ctx, images.frontImage, 0, 0, width, height);
  } else {
    drawHeader(ctx, content, images, fonts, width);
    drawPerson(ctx, content, images, fonts, width, height);
    drawFooter(ctx, content, fonts, width, height);
  }
  drawSlot(ctx, width);
}

function drawBack(
  ctx: CanvasRenderingContext2D,
  content: BadgeContent,
  images: Images,
  fonts: Fonts,
  width: number,
  height: number,
) {
  ctx.fillStyle = content.cardColor;
  ctx.fillRect(0, 0, width, height);
  if (images.backImage) {
    drawCover(ctx, images.backImage, 0, 0, width, height);
  } else {
    drawMark(
      ctx,
      width / 2 - 32,
      height / 2 - 70,
      64,
      content.inkColor,
      images.logo,
    );
    ctx.fillStyle = content.inkColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.font = `600 18px ${fonts.sans}`;
    ctx.fillText(
      ellipsize(ctx, content.brand, width - 40),
      width / 2,
      height / 2 + 26,
    );
    ctx.globalAlpha = 0.6;
    ctx.font = `400 14px ${fonts.sans}`;
    ctx.fillText(
      ellipsize(ctx, content.backText, width - 40),
      width / 2,
      height / 2 + 48,
    );
    ctx.globalAlpha = 1;
    ctx.textAlign = "left";
  }
  drawSlot(ctx, width);
}

/** Light ink on a dark strap, dark ink on a light one. */
function inkFor(ctx: CanvasRenderingContext2D, color: string) {
  ctx.fillStyle = "#000000";
  ctx.fillStyle = color;
  const hex = HEX_COLOR.exec(String(ctx.fillStyle))?.[1];
  if (!hex) {
    return "#fafafa";
  }
  const value = Number.parseInt(hex, 16);
  const r = Math.floor(value / 65_536);
  const g = Math.floor(value / 256) % 256;
  const b = value % 256;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 150 ? "#fafafa" : "#0a0a0a";
}

/** Paints one repeat of the strap: the text, then the logo. Returns its length. */
function paintStrap(
  canvas: HTMLCanvasElement,
  content: BadgeContent,
  images: Images,
  fonts: Fonts,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return 100;
  }
  const font = `600 9px ${fonts.sans}`;
  const spacing = 2.4;
  const gap = 12;
  const mark = 7;
  ctx.font = font;
  const letters = [...content.strapText];
  const widths = letters.map((letter) => ctx.measureText(letter).width);
  const textWidth =
    widths.reduce((sum, w) => sum + w, 0) +
    spacing * Math.max(0, letters.length - 1);
  const tile = Math.ceil(textWidth + gap * 2 + mark);
  canvas.width = tile * STRAP_TEXTURE_SCALE;
  canvas.height = STRAP_WIDTH * STRAP_TEXTURE_SCALE;
  ctx.setTransform(STRAP_TEXTURE_SCALE, 0, 0, STRAP_TEXTURE_SCALE, 0, 0);
  ctx.fillStyle = content.strapColor;
  ctx.fillRect(0, 0, tile, STRAP_WIDTH);
  const ink = inkFor(ctx, content.strapColor);
  ctx.fillStyle = ink;
  ctx.font = font;
  ctx.textBaseline = "middle";
  let x = gap / 2;
  letters.forEach((letter, i) => {
    ctx.fillText(letter, x, STRAP_WIDTH / 2 + 0.5);
    x += (widths[i] ?? 0) + spacing;
  });
  drawMark(
    ctx,
    gap / 2 + textWidth + gap,
    (STRAP_WIDTH - mark) / 2,
    mark,
    ink,
    images.logo,
  );
  return tile;
}

function paintCard(
  canvas: HTMLCanvasElement,
  draw: typeof drawFront,
  content: BadgeContent,
  images: Images,
  fonts: Fonts,
  width: number,
  height: number,
) {
  const scale = Math.min(TEXTURE_SCALE, 2048 / Math.max(width, height));
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  draw(ctx, content, images, fonts, width, height);
}

/* ------------------------------------------------------------------ */
/* The 3D scene.                                                       */
/* ------------------------------------------------------------------ */

function roundedRect(width: number, height: number, radius: number) {
  const shape = new Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

/** A flat face in the card's outline, with the texture stretched over it. */
function faceGeometry(shape: Shape, width: number, height: number) {
  const geometry = new ShapeGeometry(shape, 12);
  const position = geometry.getAttribute("position");
  const uv = geometry.getAttribute("uv");
  for (let i = 0; i < position.count; i++) {
    uv.setXY(
      i,
      position.getX(i) / width + 0.5,
      position.getY(i) / height + 0.5,
    );
  }
  uv.needsUpdate = true;
  return geometry;
}

function canvasTexture(canvas: HTMLCanvasElement, anisotropy: number) {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = anisotropy;
  return texture;
}

interface CardMesh {
  group: Group;
  pickable: Object3D[];
  bodyMaterial: MeshStandardMaterial;
}

function createCardMesh(
  width: number,
  height: number,
  front: Texture,
  back: Texture,
  environment: Texture,
  track: (item: { dispose: () => void }) => void,
): CardMesh {
  const group = new Group();
  group.matrixAutoUpdate = false;
  const shape = roundedRect(width, height, CARD_RADIUS);

  const bodyMaterial = new MeshStandardMaterial({ roughness: 0.6 });
  const bodyGeometry = new ExtrudeGeometry(shape, {
    depth: CARD_DEPTH,
    bevelEnabled: true,
    bevelThickness: BEVEL,
    bevelSize: BEVEL,
    bevelSegments: 2,
    curveSegments: 12,
  }).translate(0, 0, -CARD_DEPTH / 2);
  const body = new Mesh(bodyGeometry, bodyMaterial);

  const faces = faceGeometry(shape, width, height);
  const faceOffset = CARD_DEPTH / 2 + BEVEL + 0.05;
  const frontMaterial = new MeshPhysicalMaterial({
    map: front,
    roughness: 0.6,
    clearcoat: 0.3,
    clearcoatRoughness: 0.35,
  });
  const backMaterial = frontMaterial.clone();
  backMaterial.map = back;
  const frontFace = new Mesh(faces, frontMaterial);
  frontFace.position.z = faceOffset;
  const backFace = new Mesh(faces, backMaterial);
  backFace.position.z = -faceOffset;
  backFace.rotation.y = Math.PI;

  // A metal clip over the top edge and a swivel ring for the strap.
  const metal = new MeshStandardMaterial({
    color: "#9a9aa4",
    metalness: 0.9,
    roughness: 0.35,
    envMap: environment,
  });
  const plateGeometry = new BoxGeometry(26, 12, CARD_DEPTH + 6);
  const plate = new Mesh(plateGeometry, metal);
  plate.position.y = height / 2 + 1;
  const ringGeometry = new TorusGeometry(5.5, 1.5, 10, 28);
  const ring = new Mesh(ringGeometry, metal);
  ring.rotation.y = Math.PI / 2;
  ring.position.y = height / 2 + 11;

  group.add(body, frontFace, backFace, plate, ring);
  for (const item of [
    bodyMaterial,
    bodyGeometry,
    faces,
    frontMaterial,
    backMaterial,
    metal,
    plateGeometry,
    ringGeometry,
  ]) {
    track(item);
  }
  return { group, pickable: [body, frontFace, backFace], bodyMaterial };
}

interface StrapMesh {
  mesh: Mesh;
  update: (
    samples: Vector3[],
    twistAngle: number,
    width: number,
    tile: number,
  ) => void;
}

/** A flat ribbon along the rope that twists toward the card at its end. */
function createStrapMesh(
  texture: Texture,
  track: (item: { dispose: () => void }) => void,
): StrapMesh {
  const count = (STRAP_SAMPLES + 1) * 2;
  const geometry = new BufferGeometry();
  const positions = new BufferAttribute(new Float32Array(count * 3), 3);
  const normals = new BufferAttribute(new Float32Array(count * 3), 3);
  const uvs = new BufferAttribute(new Float32Array(count * 2), 2);
  for (const attribute of [positions, normals, uvs]) {
    attribute.setUsage(DynamicDrawUsage);
  }
  geometry.setAttribute("position", positions);
  geometry.setAttribute("normal", normals);
  geometry.setAttribute("uv", uvs);
  const index: number[] = [];
  for (let i = 0; i < STRAP_SAMPLES; i++) {
    const a = i * 2;
    index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  geometry.setIndex(index);
  const material = new MeshStandardMaterial({
    map: texture,
    roughness: 0.8,
    side: DoubleSide,
  });
  const mesh = new Mesh(geometry, material);
  mesh.frustumCulled = false;
  track(geometry);
  track(material);

  const tangent = new Vector3();
  const facing = new Vector3();
  const side = new Vector3();
  const normal = new Vector3();
  const update = (
    samples: Vector3[],
    twistAngle: number,
    width: number,
    tile: number,
  ) => {
    let along = 0;
    samples.forEach((p, i) => {
      const previous = samples[i - 1] ?? p;
      const next = samples[i + 1] ?? p;
      along += p.distanceTo(previous);
      tangent.subVectors(next, previous).normalize();
      // The twist gathers toward the card, where the clip turns the strap.
      const share = (i / STRAP_SAMPLES) ** 2;
      facing.set(Math.sin(twistAngle * share), 0, Math.cos(twistAngle * share));
      side.crossVectors(tangent, facing);
      if (side.lengthSq() < 1e-8) {
        side.set(1, 0, 0);
      }
      side.normalize().multiplyScalar(width / 2);
      normal.crossVectors(side, tangent).normalize();
      positions.setXYZ(i * 2, p.x - side.x, p.y - side.y, p.z - side.z);
      positions.setXYZ(i * 2 + 1, p.x + side.x, p.y + side.y, p.z + side.z);
      normals.setXYZ(i * 2, normal.x, normal.y, normal.z);
      normals.setXYZ(i * 2 + 1, normal.x, normal.y, normal.z);
      uvs.setXY(i * 2, along / tile, 1);
      uvs.setXY(i * 2 + 1, along / tile, 0);
    });
    positions.needsUpdate = true;
    normals.needsUpdate = true;
    uvs.needsUpdate = true;
  };
  return { mesh, update };
}

interface SceneOptions extends SimOptions {
  dropIn: boolean;
  content: BadgeContent;
  fonts: Fonts;
  onFlip: (flipped: boolean) => void;
}

interface LanyardScene {
  setContent: (content: BadgeContent, fonts: Fonts) => void;
  setGravity: (gravity: number) => void;
  flip: () => void;
  kick: (direction: number) => void;
  dispose: () => void;
}

function createRenderer() {
  try {
    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = NoToneMapping;
    renderer.setClearColor(0x00_00_00, 0);
    return renderer;
  } catch {
    return null;
  }
}

/** Builds the scene in the container and runs it. Returns null without WebGL. */
function createLanyardScene(
  container: HTMLDivElement,
  options: SceneOptions,
): LanyardScene | null {
  const renderer = createRenderer();
  if (!renderer) {
    return null;
  }
  const canvas = renderer.domElement;
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%";
  canvas.setAttribute("aria-hidden", "true");
  container.appendChild(canvas);

  const disposables: { dispose: () => void }[] = [];
  const track = (item: { dispose: () => void }) => {
    disposables.push(item);
  };

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04).texture;
  room.dispose();
  pmrem.dispose();
  track(environment);
  // Plain light on the card and strap, so a card that faces you shows its
  // true colors. Only the metal clip reflects the room.
  const light = new DirectionalLight("#ffffff", 1.2);
  light.position.set(-300, 400, 900);
  scene.add(new AmbientLight("#ffffff", 2), light);
  const camera = new PerspectiveCamera(FOV, 1, 1, 8000);

  const anisotropy = renderer.capabilities.getMaxAnisotropy();
  const canvases = {
    front: document.createElement("canvas"),
    back: document.createElement("canvas"),
    strap: document.createElement("canvas"),
  };
  const textures = {
    front: canvasTexture(canvases.front, anisotropy),
    back: canvasTexture(canvases.back, anisotropy),
    strap: canvasTexture(canvases.strap, anisotropy),
  };
  textures.strap.wrapS = RepeatWrapping;
  for (const texture of Object.values(textures)) {
    track(texture);
  }

  const cardMesh = createCardMesh(
    options.cardWidth,
    options.cardHeight,
    textures.front,
    textures.back,
    environment,
    track,
  );
  const strap = createStrapMesh(textures.strap, track);
  scene.add(cardMesh.group, strap.mesh);

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const anchorFor = (height: number): Vec => ({
    x: 0,
    y: height / 2 + 8,
    z: 0,
  });
  const sim = createSim(
    options,
    anchorFor(container.clientHeight),
    fitScale(container.clientWidth, options.cardWidth),
    options.dropIn && !reduceMotion,
  );

  let raf = 0;
  let last = 0;
  let carry = 0;
  let visible = true;
  let tile = 100;
  let strapTwist = 0;
  let renderYaw = 0;

  const ropeVectors = sim.rope.map((p) => new Vector3(p.x, p.y, p.z));
  const curve = new CatmullRomCurve3(ropeVectors, false, "centripetal");
  const right = new Vector3();
  const up = new Vector3();
  const normal = new Vector3();
  const center = new Vector3();
  const scale = new Vector3();

  const draw = () => {
    const { card } = sim;
    center.set(
      (card.top.x + card.bottom.x) / 2,
      (card.top.y + card.bottom.y) / 2,
      (card.top.z + card.bottom.z) / 2,
    );
    up.set(
      card.top.x - card.bottom.x,
      card.top.y - card.bottom.y,
      card.top.z - card.bottom.z,
    ).normalize();
    right.set(
      card.right.x - card.left.x,
      card.right.y - card.left.y,
      card.right.z - card.left.z,
    );
    right.addScaledVector(up, -right.dot(up)).normalize();
    normal.crossVectors(right, up);
    scale.setScalar(sim.fit);
    cardMesh.group.matrix
      .makeBasis(right, up, normal)
      .scale(scale)
      .setPosition(center);
    cardMesh.group.matrixWorldNeedsUpdate = true;

    // Count every turn the card makes, so the strap twists the whole way.
    const yaw = cardYaw(card);
    strapTwist += wrapAngle(yaw - renderYaw);
    renderYaw = yaw;
    sim.rope.forEach((p, i) => {
      ropeVectors[i]?.set(p.x, p.y, p.z);
    });
    strap.update(curve.getPoints(STRAP_SAMPLES), strapTwist, STRAP_WIDTH, tile);
    renderer.render(scene, camera);
  };

  const loop = (time: number) => {
    if (!last) {
      last = time;
    }
    carry += Math.min(64, time - last);
    last = time;
    while (carry >= STEP_MS) {
      step(sim);
      carry -= STEP_MS;
    }
    draw();
    // Stop once the badge has hung still for half a second.
    if (sim.still > 30 || !visible) {
      raf = 0;
      last = 0;
      return;
    }
    raf = requestAnimationFrame(loop);
  };

  const wake = () => {
    if (reduceMotion) {
      draw();
      return;
    }
    if (!raf && visible) {
      sim.still = 0;
      raf = requestAnimationFrame(loop);
    }
  };

  const settle = () => {
    for (let i = 0; i < 600; i++) {
      step(sim);
    }
    draw();
  };

  const resize = () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (!(width && height)) {
      return;
    }
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.set(0, 0, height / 2 / Math.tan((FOV * Math.PI) / 360));
    camera.updateProjectionMatrix();
    // Move everything with the anchor so a resize does not jolt the strap.
    const shift = anchorFor(height).y - sim.anchor.y;
    for (const p of [...sim.rope, ...sim.cardPoints]) {
      p.y += shift;
      p.py += shift;
    }
    setFit(sim, fitScale(width, options.cardWidth));
    wake();
  };

  // Images load once each and repaint the textures when they arrive.
  const images: Images = {};
  const loading = new Map<string, HTMLImageElement>();
  let content = options.content;
  let fonts = options.fonts;

  const paint = () => {
    paintCard(
      canvases.front,
      drawFront,
      content,
      images,
      fonts,
      options.cardWidth,
      options.cardHeight,
    );
    paintCard(
      canvases.back,
      drawBack,
      content,
      images,
      fonts,
      options.cardWidth,
      options.cardHeight,
    );
    tile = paintStrap(canvases.strap, content, images, fonts);
    for (const texture of Object.values(textures)) {
      texture.needsUpdate = true;
    }
    cardMesh.bodyMaterial.color.set(content.cardColor);
    wake();
  };

  const loadImages = () => {
    for (const key of ["logo", "photo", "frontImage", "backImage"] as const) {
      const url = content[key];
      const image = url ? loading.get(url) : undefined;
      if (!url) {
        delete images[key];
      } else if (image) {
        images[key] = image.complete && image.naturalWidth ? image : undefined;
      } else {
        const next = new Image();
        next.crossOrigin = "anonymous";
        next.decoding = "async";
        next.onload = () => {
          if (content[key] === url) {
            images[key] = next;
            paint();
          }
        };
        next.src = url;
        loading.set(url, next);
      }
    }
  };

  // Pointer handling: grab the card where you press, flip it on a click.
  const raycaster = new Raycaster();
  const ndc = new Vector2();
  const plane = new Plane(new Vector3(0, 0, 1), 0);
  const hitPoint = new Vector3();
  let downAt = { x: 0, y: 0 };
  let moved = false;
  // A touch that lands on the card holds the page still; elsewhere it scrolls.
  let holding = false;
  const onTouch = (event: TouchEvent) => {
    if (holding) {
      event.preventDefault();
    }
  };

  const pointAt = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    ndc.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(ndc, camera);
  };

  const flip = () => {
    sim.flipped = !sim.flipped;
    options.onFlip(sim.flipped);
    if (reduceMotion) {
      flipAtOnce(sim);
    }
    wake();
  };

  const onPointerDown = (event: PointerEvent) => {
    pointAt(event);
    const hit = raycaster.intersectObjects(cardMesh.pickable, false)[0];
    if (!hit) {
      return;
    }
    downAt = { x: event.clientX, y: event.clientY };
    moved = false;
    holding = true;
    canvas.setPointerCapture(event.pointerId);
    canvas.style.cursor = "grabbing";
    if (reduceMotion) {
      return;
    }
    const { top, bottom } = sim.card;
    const ax = bottom.x - top.x;
    const ay = bottom.y - top.y;
    const az = bottom.z - top.z;
    const along =
      ((hit.point.x - top.x) * ax +
        (hit.point.y - top.y) * ay +
        (hit.point.z - top.z) * az) /
      (ax * ax + ay * ay + az * az || 1);
    sim.grab = clamp(along, 0.05, 0.95);
    plane.constant = -hit.point.z;
    sim.pointer = { x: hit.point.x, y: hit.point.y, z: hit.point.z };
    sim.dragging = true;
    wake();
  };

  const onPointerMove = (event: PointerEvent) => {
    pointAt(event);
    if (!canvas.hasPointerCapture(event.pointerId)) {
      const over =
        raycaster.intersectObjects(cardMesh.pickable, false).length > 0;
      canvas.style.cursor = over ? "grab" : "";
      return;
    }
    if (
      Math.hypot(event.clientX - downAt.x, event.clientY - downAt.y) >
      CLICK_SLOP
    ) {
      moved = true;
    }
    if (sim.dragging && raycaster.ray.intersectPlane(plane, hitPoint)) {
      sim.pointer = { x: hitPoint.x, y: hitPoint.y, z: hitPoint.z };
    }
  };

  const onPointerUp = (event: PointerEvent) => {
    if (!canvas.hasPointerCapture(event.pointerId)) {
      return;
    }
    canvas.releasePointerCapture(event.pointerId);
    canvas.style.cursor = "grab";
    holding = false;
    sim.dragging = false;
    if (!moved) {
      flip();
    }
    wake();
  };

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);
  canvas.addEventListener("touchstart", onTouch, { passive: false });
  canvas.addEventListener("touchmove", onTouch, { passive: false });

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? true;
    if (visible) {
      wake();
    }
  });
  visibility.observe(container);

  loadImages();
  paint();
  resize();
  if (reduceMotion) {
    settle();
  }

  return {
    setContent: (next, nextFonts) => {
      content = next;
      fonts = nextFonts;
      loadImages();
      paint();
    },
    setGravity: (gravity) => {
      sim.gravity = gravity;
      wake();
    },
    flip,
    kick: (direction) => {
      if (reduceMotion) {
        return;
      }
      // Moving the previous positions back gives the card a sideways push.
      for (const p of sim.cardPoints) {
        p.px -= direction * 14;
      }
      wake();
    },
    dispose: () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibility.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("touchstart", onTouch);
      canvas.removeEventListener("touchmove", onTouch);
      for (const item of disposables) {
        item.dispose();
      }
      renderer.dispose();
      canvas.remove();
    },
  };
}

function initialsOf(name: string) {
  return name
    .split(WHITESPACE)
    .filter(Boolean)
    .map((word) => word[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** The page's own fonts, so the badge matches the text around it. */
function readFonts(
  container: HTMLElement,
  monoProbe: HTMLElement | null,
): Fonts {
  return {
    sans: getComputedStyle(container).fontFamily || "system-ui, sans-serif",
    mono:
      (monoProbe && getComputedStyle(monoProbe).fontFamily) ||
      "ui-monospace, monospace",
  };
}

/**
 * An ID badge on a strap, in 3D. Drag the card and it swings on a simulated
 * strap that twists as the card turns; click it to flip it over.
 */
export function Lanyard3D({
  name = "Alex Rivera",
  jobTitle = "Design Engineer",
  badgeId = "CX-0042",
  label = "STAFF",
  initials,
  photo,
  brand = "Cortexcn",
  logo,
  backText = "ui.cortexcn.dev",
  frontImage,
  backImage,
  strapText = "CORTEXCN",
  strapColor = "#0a0a0a",
  cardColor = "#ffffff",
  inkColor = "#0a0a0a",
  strapLength = 200,
  cardWidth = 232,
  cardHeight = 320,
  gravity = 0.55,
  dropIn = true,
  className,
}: Lanyard3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const monoRef = useRef<HTMLSpanElement>(null);
  const sceneRef = useRef<LanyardScene | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [failed, setFailed] = useState(false);

  const content = useMemo<BadgeContent>(
    () => ({
      name,
      jobTitle,
      badgeId,
      label,
      initials: initials ?? initialsOf(name),
      brand,
      backText,
      strapText,
      strapColor,
      cardColor,
      inkColor,
      logo,
      photo,
      frontImage,
      backImage,
    }),
    [
      name,
      jobTitle,
      badgeId,
      label,
      initials,
      brand,
      backText,
      strapText,
      strapColor,
      cardColor,
      inkColor,
      logo,
      photo,
      frontImage,
      backImage,
    ],
  );
  const latest = useRef({ content, gravity });
  latest.current = { content, gravity };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const scene = createLanyardScene(container, {
      strapLength,
      cardWidth,
      cardHeight,
      dropIn,
      gravity: latest.current.gravity,
      content: latest.current.content,
      fonts: readFonts(container, monoRef.current),
      onFlip: setFlipped,
    });
    if (!scene) {
      setFailed(true);
      return;
    }
    sceneRef.current = scene;
    // Text drawn before the web fonts arrive is drawn again once they do.
    let active = true;
    document.fonts?.ready.then(() => {
      if (active) {
        scene.setContent(
          latest.current.content,
          readFonts(container, monoRef.current),
        );
      }
    });
    return () => {
      active = false;
      scene.dispose();
      sceneRef.current = null;
    };
  }, [strapLength, cardWidth, cardHeight, dropIn]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      sceneRef.current?.setContent(
        content,
        readFonts(container, monoRef.current),
      );
    }
  }, [content]);

  useEffect(() => {
    sceneRef.current?.setGravity(gravity);
  }, [gravity]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      sceneRef.current?.flip();
      return;
    }
    const push = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
    if (push) {
      event.preventDefault();
      sceneRef.current?.kick(push);
    }
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: the box holds a canvas the pointer drags, which a button element cannot
    <div
      aria-label={`${name}'s badge, ${jobTitle}. Press Enter to flip it, or the arrow keys to swing it.`}
      aria-pressed={flipped}
      className={cn(
        "relative h-[560px] w-full select-none overflow-hidden rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        className,
      )}
      data-slot="lanyard-3d"
      onKeyDown={onKeyDown}
      ref={containerRef}
      role="button"
      tabIndex={0}
    >
      <span aria-hidden="true" className="hidden font-mono" ref={monoRef} />
      {failed ? (
        <p className="absolute inset-0 grid place-items-center p-6 text-center text-muted-foreground text-sm">
          This badge needs WebGL, which this browser has turned off.
        </p>
      ) : null}
    </div>
  );
}
