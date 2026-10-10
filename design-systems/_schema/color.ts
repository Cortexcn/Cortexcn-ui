/**
 * Color math for the contrast checks and for deriving a missing mode:
 * parsing, WCAG 2 contrast, and OKLCH adjustments.
 */
import {
  blend,
  type Color,
  clampChroma,
  converter,
  formatHex,
  parse,
  wcagContrast,
} from "culori";
import type { ColorSet } from "./tokens";

const toOklch = converter("oklch");

/** WCAG 2 AA for body text. */
export const AA_TEXT = 4.5;

export function parseColor(value: string): Color {
  const color = parse(value);
  if (!color) {
    throw new Error(`Cannot parse color "${value}"`);
  }
  return color;
}

/** Flattens a translucent color onto its backdrop, as the browser paints it. */
export function flatten(value: string, backdrop: string): Color {
  const color = parseColor(value);
  if (color.alpha === undefined || color.alpha >= 1) {
    return color;
  }
  return blend([parseColor(backdrop), color], "normal");
}

export function contrast(foreground: string, background: string) {
  const ground = flatten(background, "#ffffff");
  return wcagContrast(flatten(foreground, formatHex(ground)), ground);
}

/**
 * The nearest color to `foreground` (same hue and chroma, lightness moved
 * away from the background) that reaches `target` against `background`.
 */
export function suggestPassing(
  foreground: string,
  background: string,
  target = AA_TEXT,
): string {
  const start = toOklch(flatten(foreground, background));
  const ground = toOklch(flatten(background, "#ffffff"));
  const direction = (ground.l ?? 0) > 0.6 ? -1 : 1;
  for (let step = 0; step <= 200; step++) {
    const l = Math.min(
      1,
      Math.max(0, (start.l ?? 0) + direction * step * 0.005),
    );
    const candidate = formatHex(clampChroma({ ...start, l }, "oklch"));
    if (contrast(candidate, background) >= target) {
      return candidate;
    }
  }
  return direction < 0 ? "#000000" : "#ffffff";
}

/** The text pairs every system is checked on, as [foreground, background]. */
export const CONTRAST_PAIRS = [
  ["foreground", "background"],
  ["primary-foreground", "primary"],
  ["card-foreground", "card"],
  ["muted-foreground", "background"],
] as const satisfies readonly (readonly [keyof ColorSet, keyof ColorSet])[];

export interface ContrastResult {
  foreground: keyof ColorSet;
  background: keyof ColorSet;
  ratio: number;
  passes: boolean;
  suggested?: string;
}

export function checkContrast(colors: ColorSet): ContrastResult[] {
  return CONTRAST_PAIRS.map(([foreground, background]) => {
    const ratio = contrast(colors[foreground], colors[background]);
    const passes = ratio >= AA_TEXT;
    return {
      foreground,
      background,
      ratio: Math.round(ratio * 100) / 100,
      passes,
      ...(passes
        ? {}
        : {
            suggested: suggestPassing(colors[foreground], colors[background]),
          }),
    };
  });
}

/** Lightness in OKLCH, 0 to 1. */
export function lightness(value: string) {
  return toOklch(flatten(value, "#ffffff")).l ?? 0;
}
