/**
 * Reading a Stitch-format DESIGN.md: its YAML front matter, `{group.key}`
 * references, and the CSS-ish values inside (sizes, padding, shadows).
 */
import { YAML } from "bun";
import { colorValue } from "../../design-systems/_schema/tokens";

export type Group = Record<string, unknown>;

export interface Source {
  /** The full file, LF line endings. */
  text: string;
  colors: Record<string, string>;
  typography: Record<string, Group>;
  rounded: Record<string, unknown>;
  spacing: Record<string, unknown>;
  components: Record<string, Group>;
}

const FRONT_MATTER = /^---\n([\s\S]*?)\n---\n/;
const COLORS_GROUP = /^colors:/m;
const REFERENCE = /^\{([a-z]+)\.([^}]+)\}$/;
const HEX = /#[0-9a-fA-F]{3,8}\b/;
const COLOR_FUNCTION = /(rgba?|hsla?|oklch)\([^)]*\)/;
const LENGTH = /^(-?\d*\.?\d+)(px|rem|em)?$/;
const WHITESPACE = /\s+/;
const PLAIN_NUMBER = /^\d*\.?\d+$/;
const EM = /^(-?\d*\.?\d+)em$/;
const PERCENT = /^(-?\d*\.?\d+)%$/;
const QUOTES = /^["']|["']$/g;
const ELEVATION_HEADING = /elevation|depth/i;
const CODE_SPAN = /`([^`]+)`/g;
const BOX_SHADOW_PREFIX = /^box-shadow:\s*/i;
const TRAILING_SEMICOLON = /;$/;
const PX_VALUE = /(\d*\.?\d+)px/g;
const SHADOW_PART =
  /(?:-?\d*\.?\d+px\s+){1,3}-?\d*\.?\d+px\s+(?:rgba?|hsla?)\([^)]*\)|(?:rgba?|hsla?)\([^)]*\)\s+(?:-?\d*\.?\d+px\s*){2,4}/g;

function isGroup(value: unknown): value is Group {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function groupOf(value: unknown): Record<string, Group> {
  if (!isGroup(value)) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, Group] =>
      isGroup(entry[1]),
    ),
  );
}

/** A color as written, or the first hex or color function inside it. */
export function cleanColor(value: unknown): string | undefined {
  const raw = String(value ?? "").trim();
  if (colorValue.safeParse(raw).success) {
    return raw;
  }
  const found = raw.match(HEX)?.[0] ?? raw.match(COLOR_FUNCTION)?.[0];
  return found && colorValue.safeParse(found).success ? found : undefined;
}

/**
 * Parses the front matter. A few files have a malformed line in the prose
 * fields at the top; the token groups start at `colors:`, so on failure only
 * that part is read.
 */
function parseFrontMatter(yaml: string): unknown {
  try {
    return YAML.parse(yaml);
  } catch (error) {
    const start = yaml.search(COLORS_GROUP);
    if (start <= 0) {
      throw error;
    }
    return YAML.parse(yaml.slice(start));
  }
}

export function parseSource(text: string): Source {
  const normalized = text.replace(/\r\n/g, "\n");
  const match = normalized.match(FRONT_MATTER);
  if (!match?.[1]) {
    throw new Error("No YAML front matter; this DESIGN.md is too thin to map");
  }
  const data = parseFrontMatter(match[1]);
  if (!isGroup(data)) {
    throw new Error("Front matter is not a mapping");
  }
  const colors: Record<string, string> = {};
  for (const [key, value] of Object.entries(
    isGroup(data.colors) ? data.colors : {},
  )) {
    const color = cleanColor(value);
    if (color) {
      colors[key] = color;
    }
  }
  return {
    text: normalized,
    colors,
    typography: groupOf(data.typography),
    rounded: isGroup(data.rounded) ? data.rounded : {},
    spacing: isGroup(data.spacing) ? data.spacing : {},
    components: groupOf(data.components),
  };
}

/** `{rounded.md}` to `["rounded", "md"]`. */
export function reference(value: unknown): [string, string] | undefined {
  const match = String(value ?? "").match(REFERENCE);
  return match?.[1] && match[2] ? [match[1], match[2]] : undefined;
}

/** A px number from "16px", "1rem", or 16. */
export function toPx(value: unknown): number | undefined {
  if (typeof value === "number") {
    return value;
  }
  const match = String(value ?? "")
    .trim()
    .match(LENGTH);
  if (!match?.[1]) {
    return;
  }
  const amount = Number(match[1]);
  return match[2] === "rem" || match[2] === "em" ? amount * 16 : amount;
}

/** "8px 14px" to { y: 8, x: 14 }. */
export function parsePadding(value: unknown) {
  const parts = String(value ?? "")
    .trim()
    .split(WHITESPACE)
    .map(toPx)
    .filter((part): part is number => part !== undefined);
  if (parts.length === 0) {
    return;
  }
  const [y = 0, x = y] = parts;
  return { y, x };
}

/** A line height as a ratio of the font size. */
export function lineHeightRatio(type: Group | undefined): number | undefined {
  if (!type) {
    return;
  }
  const raw = type.lineHeight;
  if (typeof raw === "number") {
    return raw > 4 ? raw / (toPx(type.fontSize) ?? 16) : raw;
  }
  const text = String(raw ?? "").trim();
  if (PLAIN_NUMBER.test(text)) {
    return Number(text);
  }
  const px = toPx(text);
  const size = toPx(type.fontSize);
  return px !== undefined && size ? px / size : undefined;
}

const round = (value: number, places = 3) =>
  Math.round(value * 10 ** places) / 10 ** places;

/** Letter spacing in em, relative to the font size. */
export function trackingEm(type: Group | undefined): string | undefined {
  if (!type || type.letterSpacing === undefined) {
    return;
  }
  const raw = String(type.letterSpacing).trim();
  if (raw === "0" || raw === "normal" || raw === "0px") {
    return "0";
  }
  const em = raw.match(EM);
  if (em?.[1]) {
    return `${round(Number(em[1]))}em`;
  }
  const percent = raw.match(PERCENT);
  if (percent?.[1]) {
    return `${round(Number(percent[1]) / 100)}em`;
  }
  const px = toPx(raw);
  const size = toPx(type.fontSize);
  if (px === undefined || !size) {
    return;
  }
  const value = round(px / size);
  return value === 0 ? "0" : `${value}em`;
}

/** The first family in a font-family list, without quotes. */
export function firstFamily(value: unknown): string | undefined {
  const first = String(value ?? "")
    .split(",")[0]
    ?.trim()
    .replace(QUOTES, "");
  return first || undefined;
}

/** The body of a `## Heading` section, up to the next `## `. */
export function section(text: string, heading: RegExp): string {
  const lines = text.split("\n");
  const start = lines.findIndex(
    (line) => line.startsWith("## ") && heading.test(line),
  );
  if (start === -1) {
    return "";
  }
  const end = lines.findIndex(
    (line, index) => index > start && line.startsWith("## "),
  );
  return lines.slice(start + 1, end === -1 ? undefined : end).join("\n");
}

const blur = (shadow: string) =>
  [...shadow.matchAll(PX_VALUE)].reduce(
    (sum, match) => sum + Number(match[1]),
    0,
  );

/** Box-shadow values quoted in the Elevation section, smallest first. */
export function shadowsIn(text: string): string[] {
  const body = section(text, ELEVATION_HEADING);
  const spans = [...body.matchAll(CODE_SPAN)]
    .map((match) => match[1] ?? "")
    .map((span) =>
      span.replace(BOX_SHADOW_PREFIX, "").replace(TRAILING_SEMICOLON, ""),
    )
    .filter((span) => {
      const parts = span.match(SHADOW_PART);
      return parts !== null && parts.join("").length > span.length * 0.6;
    });
  return [...new Set(spans)].sort((a, b) => blur(a) - blur(b));
}
