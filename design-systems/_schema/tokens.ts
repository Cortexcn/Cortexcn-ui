/**
 * The token contract every design system in `design-systems/<id>/tokens.json`
 * follows. One schema for all of them, so a component styled from these
 * tokens renders in any system without code changes.
 *
 * Values are CSS-ready strings or plain numbers (pixels). References inside
 * component recipes name a key from another group, such as `"md"` for
 * `radius.md` or `"2"` for `elevation.2`, the same way Stitch DESIGN.md files
 * write `{rounded.md}`.
 */
import { z } from "zod";

/** Colors are kept in the notation the source used: hex or a CSS color function. */
export const colorValue = z
  .string()
  .regex(
    /^(#[0-9a-fA-F]{3,8}|(rgba?|hsla?|oklch|oklab)\([^)]*\))$/,
    "Expected a hex color or an rgb(), hsl(), oklch(), or oklab() value",
  );

const cssLength = z
  .string()
  .regex(
    /^(0|-?\d*\.?\d+(px|rem|em|%))$/,
    "Expected a CSS length, such as 8px, 0.5rem, -0.02em, or 0",
  );

const duration = z
  .string()
  .regex(/^\d+(\.\d+)?m?s$/, "Expected a duration such as 120ms");

const easing = z
  .string()
  .regex(
    /^(linear|ease|ease-in|ease-out|ease-in-out|cubic-bezier\(\s*-?[\d.]+\s*,\s*-?[\d.]+\s*,\s*-?[\d.]+\s*,\s*-?[\d.]+\s*\))$/,
    "Expected a CSS easing keyword or cubic-bezier()",
  );

/** Characters that would end a declaration or open a block. */
const CSS_BREAK = /[;{}]/;

const shadow = z
  .string()
  .min(1)
  .refine((value) => !CSS_BREAK.test(value), "A shadow must be one CSS value");

const px = z.number().nonnegative();
const weight = z.number().int().min(100).max(900);

/**
 * Color roles with a shadcn CSS variable of the same name, plus the extra
 * roles cortexcn components need (written as `--ds-<role>`).
 */
export const SHADCN_COLOR_ROLES = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
] as const;

export const EXTRA_COLOR_ROLES = [
  "primary-hover",
  "success",
  "warning",
  "overlay",
] as const;

export const COLOR_ROLES = [
  ...SHADCN_COLOR_ROLES,
  ...EXTRA_COLOR_ROLES,
] as const;

export type ColorRole = (typeof COLOR_ROLES)[number];

const colorSet = z.object(
  Object.fromEntries(COLOR_ROLES.map((role) => [role, colorValue])) as Record<
    ColorRole,
    typeof colorValue
  >,
);

export const RADIUS_KEYS = [
  "none",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "full",
] as const;
export const ELEVATION_KEYS = ["0", "1", "2", "3"] as const;
export const WEIGHT_KEYS = ["regular", "medium", "bold"] as const;
export const MOTION_KEYS = ["fast", "base", "slow"] as const;

const radiusRef = z.enum(RADIUS_KEYS);
const elevationRef = z.enum(ELEVATION_KEYS);
const weightRef = z.enum(WEIGHT_KEYS);
const motionRef = z.enum(MOTION_KEYS);
const textTransform = z.enum(["none", "uppercase"]);

const font = z.object({
  /** The family the DESIGN.md names, which may be proprietary. */
  family: z.string().min(1),
  /** The open-licensed family used in its place (recorded in meta.json). */
  fallback: z.string().min(1),
  /** The CSS font-family value components get. */
  stack: z.string().min(1),
});

export const recipesSchema = z.object({
  button: z.object({
    radius: radiusRef,
    height: z.object({ xs: px, sm: px, md: px, lg: px }),
    paddingX: px,
    weight: weightRef,
    textTransform,
    tracking: cssLength,
    shadow: elevationRef,
  }),
  input: z.object({
    radius: radiusRef,
    height: px,
    paddingX: px,
    /** Which surface fills the field. */
    background: z.enum(["transparent", "input", "card", "muted"]),
    shadow: elevationRef,
  }),
  card: z.object({
    radius: radiusRef,
    padding: px,
    shadow: elevationRef,
    border: z.boolean(),
    background: z.enum(["card", "background", "muted"]),
  }),
  badge: z.object({
    radius: radiusRef,
    paddingX: px,
    weight: weightRef,
    textTransform,
  }),
  tabs: z.object({
    radius: radiusRef,
    /** segmented: a filled list with a raised active tab. underline: a bar under the active tab. */
    style: z.enum(["segmented", "underline"]),
  }),
  accordion: z.object({
    dividers: z.boolean(),
    triggerWeight: weightRef,
    chevron: z.enum(["rotate-180", "rotate-90"]),
    duration: motionRef,
    paddingY: px,
  }),
  dialog: z.object({
    radius: radiusRef,
    shadow: elevationRef,
    padding: px,
  }),
  menu: z.object({
    radius: radiusRef,
    itemRadius: radiusRef,
    shadow: elevationRef,
  }),
  control: z.object({
    /** Checkbox corners; radios and switches stay round. */
    radius: radiusRef,
  }),
  tooltip: z.object({ radius: radiusRef }),
  alert: z.object({ radius: radiusRef }),
});

export const tokensSchema = z.object({
  $schema: z.string().optional(),
  id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use a kebab-case id"),
  modes: z.object({ light: colorSet, dark: colorSet }),
  typography: z.object({
    display: font,
    body: font,
    mono: font,
    /** Font sizes in px, smallest first. */
    scale: z.array(z.number().positive()).min(3),
    weights: z.object({ regular: weight, medium: weight, bold: weight }),
    tracking: z.object({ display: cssLength, body: cssLength }),
    lineHeight: z.object({
      display: z.number().positive(),
      body: z.number().positive(),
    }),
  }),
  radius: z.object({
    none: cssLength,
    xs: cssLength,
    sm: cssLength,
    md: cssLength,
    lg: cssLength,
    xl: cssLength,
    full: cssLength,
  }),
  spacing: z.object({
    /** The base step in px. */
    unit: z.number().positive().max(16),
    density: z.enum(["compact", "default", "comfortable"]),
  }),
  elevation: z.object({
    "0": z.literal("none"),
    "1": shadow,
    "2": shadow,
    "3": shadow,
  }),
  motion: z.object({
    fast: duration,
    base: duration,
    slow: duration,
    easing,
  }),
  components: recipesSchema,
});

export type DesignTokens = z.infer<typeof tokensSchema>;
export type ColorSet = DesignTokens["modes"]["light"];
export type Recipes = DesignTokens["components"];
