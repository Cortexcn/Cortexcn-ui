/**
 * Turns tokens.json into CSS. Shadcn variable names are used where shadcn has
 * one (`--background`, `--primary`, `--radius`, ...). Everything shadcn lacks
 * is written as `--ds-*`: extra color roles, fonts, the radius and elevation
 * scales, motion, and the component recipes.
 */
import {
  COLOR_ROLES,
  type ColorSet,
  type DesignTokens,
  EXTRA_COLOR_ROLES,
} from "./tokens";

type Declarations = [name: string, value: string][];

const EXTRA = new Set<string>(EXTRA_COLOR_ROLES);

/** The CSS variable a color role is written to. */
export function colorVar(role: string) {
  return EXTRA.has(role) ? `--ds-${role}` : `--${role}`;
}

/** Shadcn's sidebar roles follow the base roles, so the sidebar matches. */
const SIDEBAR_ALIASES: Declarations = [
  ["--sidebar", "var(--card)"],
  ["--sidebar-foreground", "var(--card-foreground)"],
  ["--sidebar-primary", "var(--primary)"],
  ["--sidebar-primary-foreground", "var(--primary-foreground)"],
  ["--sidebar-accent", "var(--accent)"],
  ["--sidebar-accent-foreground", "var(--accent-foreground)"],
  ["--sidebar-border", "var(--border)"],
  ["--sidebar-ring", "var(--ring)"],
];

const pxValue = (value: number) => `${value}px`;
const shadowRef = (key: string) =>
  key === "0" ? "none" : `var(--ds-shadow-${key})`;

const INPUT_BACKGROUND: Record<
  DesignTokens["components"]["input"]["background"],
  string
> = {
  transparent: "transparent",
  input: "var(--input)",
  card: "var(--card)",
  muted: "var(--muted)",
};

function colorDeclarations(colors: ColorSet): Declarations {
  return [
    ...COLOR_ROLES.map((role): [string, string] => [
      colorVar(role),
      colors[role],
    ]),
    ...SIDEBAR_ALIASES,
  ];
}

/** Everything that is the same in light and dark mode. */
export function sharedDeclarations(tokens: DesignTokens): Declarations {
  const { typography: type, radius, motion, components: c } = tokens;
  return [
    ["--ds-font-display", type.display.stack],
    ["--ds-font-body", type.body.stack],
    ["--ds-font-mono", type.mono.stack],
    ["--ds-weight-regular", String(type.weights.regular)],
    ["--ds-weight-medium", String(type.weights.medium)],
    ["--ds-weight-bold", String(type.weights.bold)],
    ["--ds-tracking-display", type.tracking.display],
    ["--ds-tracking-body", type.tracking.body],
    ["--ds-leading-display", String(type.lineHeight.display)],
    ["--ds-leading-body", String(type.lineHeight.body)],

    ["--radius", radius.lg],
    ["--ds-radius-none", radius.none],
    ["--ds-radius-xs", radius.xs],
    ["--ds-radius-sm", radius.sm],
    ["--ds-radius-md", radius.md],
    ["--ds-radius-lg", radius.lg],
    ["--ds-radius-xl", radius.xl],
    ["--ds-radius-full", radius.full],

    ["--ds-spacing-unit", pxValue(tokens.spacing.unit)],

    ["--ds-shadow-1", tokens.elevation["1"]],
    ["--ds-shadow-2", tokens.elevation["2"]],
    ["--ds-shadow-3", tokens.elevation["3"]],

    ["--ds-duration-fast", motion.fast],
    ["--ds-duration-base", motion.base],
    ["--ds-duration-slow", motion.slow],
    ["--ds-ease", motion.easing],

    ["--ds-button-radius", `var(--ds-radius-${c.button.radius})`],
    ["--ds-button-h-xs", pxValue(c.button.height.xs)],
    ["--ds-button-h-sm", pxValue(c.button.height.sm)],
    ["--ds-button-h-md", pxValue(c.button.height.md)],
    ["--ds-button-h-lg", pxValue(c.button.height.lg)],
    ["--ds-button-px", pxValue(c.button.paddingX)],
    ["--ds-button-weight", `var(--ds-weight-${c.button.weight})`],
    ["--ds-button-transform", c.button.textTransform],
    ["--ds-button-tracking", c.button.tracking],
    ["--ds-button-shadow", shadowRef(c.button.shadow)],

    ["--ds-input-radius", `var(--ds-radius-${c.input.radius})`],
    ["--ds-input-h", pxValue(c.input.height)],
    ["--ds-input-px", pxValue(c.input.paddingX)],
    ["--ds-input-bg", INPUT_BACKGROUND[c.input.background]],
    ["--ds-input-shadow", shadowRef(c.input.shadow)],

    ["--ds-card-radius", `var(--ds-radius-${c.card.radius})`],
    ["--ds-card-padding", pxValue(c.card.padding)],
    ["--ds-card-shadow", shadowRef(c.card.shadow)],
    ["--ds-card-border-width", c.card.border ? "1px" : "0px"],
    ["--ds-card-bg", `var(--${c.card.background})`],

    ["--ds-badge-radius", `var(--ds-radius-${c.badge.radius})`],
    ["--ds-badge-px", pxValue(c.badge.paddingX)],
    ["--ds-badge-weight", `var(--ds-weight-${c.badge.weight})`],
    ["--ds-badge-transform", c.badge.textTransform],

    ["--ds-tabs-radius", `var(--ds-radius-${c.tabs.radius})`],
    [
      "--ds-tabs-list-bg",
      c.tabs.style === "segmented" ? "var(--muted)" : "transparent",
    ],
    [
      "--ds-tabs-active-bg",
      c.tabs.style === "segmented" ? "var(--background)" : "transparent",
    ],
    // Underline tabs show a bar under the active tab instead of a raised one.
    ["--ds-tabs-underline", c.tabs.style === "underline" ? "1" : "0"],
    [
      "--ds-tabs-active-border",
      c.tabs.style === "underline" ? "transparent" : "var(--input)",
    ],
    [
      "--ds-tabs-active-shadow",
      c.tabs.style === "underline" ? "none" : "var(--ds-shadow-1)",
    ],

    ["--ds-accordion-divider-width", c.accordion.dividers ? "1px" : "0px"],
    ["--ds-accordion-weight", `var(--ds-weight-${c.accordion.triggerWeight})`],
    [
      "--ds-accordion-chevron-rotate",
      c.accordion.chevron === "rotate-90" ? "90deg" : "180deg",
    ],
    ["--ds-accordion-duration", `var(--ds-duration-${c.accordion.duration})`],
    ["--ds-accordion-py", pxValue(c.accordion.paddingY)],

    ["--ds-dialog-radius", `var(--ds-radius-${c.dialog.radius})`],
    ["--ds-dialog-shadow", shadowRef(c.dialog.shadow)],
    ["--ds-dialog-padding", pxValue(c.dialog.padding)],

    ["--ds-menu-radius", `var(--ds-radius-${c.menu.radius})`],
    ["--ds-menu-item-radius", `var(--ds-radius-${c.menu.itemRadius})`],
    ["--ds-menu-shadow", shadowRef(c.menu.shadow)],

    ["--ds-control-radius", `var(--ds-radius-${c.control.radius})`],
    ["--ds-tooltip-radius", `var(--ds-radius-${c.tooltip.radius})`],
    ["--ds-alert-radius", `var(--ds-radius-${c.alert.radius})`],
  ];
}

function block(selector: string, declarations: Declarations, indent = "") {
  const body = declarations
    .map(([name, value]) => `${indent}  ${name}: ${value};`)
    .join("\n");
  return `${indent}${selector} {\n${body}\n${indent}}`;
}

const REDUCED_MOTION: Declarations = [
  ["--ds-duration-fast", "0ms"],
  ["--ds-duration-base", "0ms"],
  ["--ds-duration-slow", "0ms"],
];

interface ThemeCssOptions {
  name: string;
  disclaimer?: string;
}

/**
 * The `theme.css` for one system: a `[data-theme="<id>"]` block for light
 * mode and shared tokens, and a `.dark` block for dark colors. Load it after
 * the base tokens.
 */
export function themeCss(tokens: DesignTokens, options: ThemeCssOptions) {
  const selector = `[data-theme="${tokens.id}"]`;
  const header = [
    "/*",
    ` * ${options.name} (design-systems/${tokens.id}). Generated from tokens.json`,
    " * by `bun run ds:build`; edit tokens.json, not this file.",
    ...(options.disclaimer ? [` * ${options.disclaimer}`] : []),
    " */",
  ].join("\n");

  return `${[
    header,
    block(selector, [
      ["color-scheme", "light"],
      ...colorDeclarations(tokens.modes.light),
      ...sharedDeclarations(tokens),
    ]),
    block(`${selector}.dark,\n.dark ${selector}`, [
      ["color-scheme", "dark"],
      ...colorDeclarations(tokens.modes.dark),
    ]),
    `@media (prefers-reduced-motion: reduce) {\n${block(selector, REDUCED_MOTION, "  ")}\n}`,
  ].join("\n\n")}\n`;
}

/**
 * The same tokens as a project's default theme, on `:root` and `.dark`,
 * for apply_design_system.
 */
export function rootThemeCss(tokens: DesignTokens, options: ThemeCssOptions) {
  return `${[
    `/* ${options.name} design system${options.disclaimer ? `. ${options.disclaimer}` : ""} */`,
    block(":root", [
      ...colorDeclarations(tokens.modes.light),
      ...sharedDeclarations(tokens),
    ]),
    block(".dark", colorDeclarations(tokens.modes.dark)),
    `@media (prefers-reduced-motion: reduce) {\n${block(":root", REDUCED_MOTION, "  ")}\n}`,
  ].join("\n\n")}\n`;
}

/** Tailwind v4 `@theme inline` entries that expose the tokens as utilities. */
export function tailwindV4Theme() {
  const colors = COLOR_ROLES.map((role): [string, string] => [
    `--color-${role}`,
    `var(${colorVar(role)})`,
  ]);
  return block("@theme inline", [
    ...colors,
    ["--font-sans", "var(--ds-font-body)"],
    ["--font-heading", "var(--ds-font-display)"],
    ["--font-mono", "var(--ds-font-mono)"],
    ["--radius-xs", "var(--ds-radius-xs)"],
    ["--radius-sm", "var(--ds-radius-sm)"],
    ["--radius-md", "var(--ds-radius-md)"],
    ["--radius-lg", "var(--ds-radius-lg)"],
    ["--radius-xl", "var(--ds-radius-xl)"],
    ["--radius-full", "var(--ds-radius-full)"],
    ["--shadow-xs", "var(--ds-shadow-1)"],
    ["--shadow-sm", "var(--ds-shadow-1)"],
    ["--shadow-md", "var(--ds-shadow-2)"],
    ["--shadow-lg", "var(--ds-shadow-3)"],
    ["--ease-ds", "var(--ds-ease)"],
  ]);
}

/** A Tailwind v3 preset with the same mapping, for projects on v3. */
export function tailwindV3Preset(tokens: DesignTokens) {
  const colors = Object.fromEntries(
    COLOR_ROLES.map((role) => [role, `var(${colorVar(role)})`]),
  );
  const preset = {
    darkMode: ["class"],
    theme: {
      extend: {
        colors,
        fontFamily: {
          sans: ["var(--ds-font-body)"],
          heading: ["var(--ds-font-display)"],
          mono: ["var(--ds-font-mono)"],
        },
        fontSize: Object.fromEntries(
          tokens.typography.scale.map((size, index) => [
            `ds-${index + 1}`,
            `${size}px`,
          ]),
        ),
        borderRadius: {
          xs: "var(--ds-radius-xs)",
          sm: "var(--ds-radius-sm)",
          md: "var(--ds-radius-md)",
          lg: "var(--ds-radius-lg)",
          xl: "var(--ds-radius-xl)",
          full: "var(--ds-radius-full)",
        },
        boxShadow: {
          xs: "var(--ds-shadow-1)",
          sm: "var(--ds-shadow-1)",
          md: "var(--ds-shadow-2)",
          lg: "var(--ds-shadow-3)",
        },
        transitionDuration: {
          fast: "var(--ds-duration-fast)",
          base: "var(--ds-duration-base)",
          slow: "var(--ds-duration-slow)",
        },
        transitionTimingFunction: { ds: "var(--ds-ease)" },
      },
    },
  };
  return `/** @type {import('tailwindcss').Config} */\nmodule.exports = ${JSON.stringify(preset, null, 2)};\n`;
}
