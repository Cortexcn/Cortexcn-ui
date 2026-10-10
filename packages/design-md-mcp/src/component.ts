/**
 * get_component: one recipe from a system, with every reference resolved to
 * a real value, the CSS variables it sets, and usage snippets.
 */
import { sharedDeclarations } from "../../../design-systems/_schema/css";
import type { LoadedSystem } from "../../../design-systems/_schema/load";
import type {
  ColorSet,
  DesignTokens,
  Recipes,
} from "../../../design-systems/_schema/tokens";

export const COMPONENTS = [
  "button",
  "input",
  "card",
  "badge",
  "tabs",
  "accordion",
  "dialog",
  "menu",
  "control",
  "tooltip",
  "alert",
] as const satisfies readonly (keyof Recipes)[];

export type ComponentName = (typeof COMPONENTS)[number];

const RADIUS_KEY = new Set(["radius", "itemRadius"]);
const SHADOW_KEY = new Set(["shadow"]);
const WEIGHT_KEY = new Set(["weight", "triggerWeight"]);

function resolveRecipe(tokens: DesignTokens, recipe: Record<string, unknown>) {
  const resolved: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(recipe)) {
    if (RADIUS_KEY.has(key)) {
      resolved[key] = tokens.radius[value as keyof DesignTokens["radius"]];
    } else if (SHADOW_KEY.has(key)) {
      resolved[key] =
        tokens.elevation[value as keyof DesignTokens["elevation"]];
    } else if (WEIGHT_KEY.has(key)) {
      resolved[key] =
        tokens.typography.weights[
          value as keyof DesignTokens["typography"]["weights"]
        ];
    } else if (key === "duration") {
      resolved[key] = tokens.motion[value as "fast" | "base" | "slow"];
    } else if (typeof value === "number") {
      resolved[key] = `${value}px`;
    } else if (typeof value === "object" && value !== null) {
      resolved[key] = Object.fromEntries(
        Object.entries(value).map(([k, v]) => [
          k,
          typeof v === "number" ? `${v}px` : v,
        ]),
      );
    } else {
      resolved[key] = value;
    }
  }
  return resolved;
}

function palette(colors: ColorSet) {
  return {
    background: colors.background,
    foreground: colors.foreground,
    card: colors.card,
    primary: colors.primary,
    "primary-foreground": colors["primary-foreground"],
    "primary-hover": colors["primary-hover"],
    muted: colors.muted,
    "muted-foreground": colors["muted-foreground"],
    border: colors.border,
    input: colors.input,
    ring: colors.ring,
  };
}

/** A self-contained snippet with the light-mode values written in. */
function standalone(name: ComponentName, tokens: DesignTokens) {
  const c = tokens.components;
  const light = tokens.modes.light;
  const r = (key: keyof DesignTokens["radius"]) => tokens.radius[key];
  const font = tokens.typography.body.stack.replaceAll(" ", "_");
  switch (name) {
    case "button":
      return `<button className="inline-flex h-[${c.button.height.md}px] items-center justify-center rounded-[${r(c.button.radius)}] bg-[${light.primary}] px-[${c.button.paddingX}px] font-[${tokens.typography.weights[c.button.weight]}] text-[${light["primary-foreground"]}] text-sm ${c.button.textTransform === "uppercase" ? "uppercase " : ""}hover:bg-[${light["primary-hover"]}] font-[family-name:${font}]">Get started</button>`;
    case "input":
      return `<input className="h-[${c.input.height}px] w-full rounded-[${r(c.input.radius)}] border border-[${light.input}] bg-transparent px-[${c.input.paddingX}px] text-sm text-[${light.foreground}] placeholder:text-[${light["muted-foreground"]}] focus-visible:outline-2 focus-visible:outline-[${light.ring}]" placeholder="you@example.com" />`;
    case "card":
      return `<div className="rounded-[${r(c.card.radius)}] bg-[${light[c.card.background]}] p-[${c.card.padding}px] text-[${light.foreground}]${c.card.border ? ` border border-[${light.border}]` : ""}">...</div>`;
    case "badge":
      return `<span className="inline-flex items-center rounded-[${r(c.badge.radius)}] bg-[${light.primary}] px-[${c.badge.paddingX}px] py-0.5 text-[${light["primary-foreground"]}] text-xs font-[${tokens.typography.weights[c.badge.weight]}]${c.badge.textTransform === "uppercase" ? " uppercase" : ""}">New</span>`;
    default:
      return null;
  }
}

export function getComponent(system: LoadedSystem, name: ComponentName) {
  const { tokens } = system;
  const recipe = tokens.components[name] as Record<string, unknown>;
  const prefix = `--ds-${name}-`;
  const variables = Object.fromEntries(
    sharedDeclarations(tokens).filter(([variable]) =>
      variable.startsWith(prefix),
    ),
  );
  return {
    system: system.id,
    component: name,
    recipe,
    resolved: resolveRecipe(tokens, recipe),
    colors: {
      light: palette(tokens.modes.light),
      dark: palette(tokens.modes.dark),
    },
    cssVariables: variables,
    usage: {
      cortexcn: `Cortexcn's ${name} components read these variables through the design-system-recipes registry item. Load the system's theme.css and set data-theme="${system.id}" on <html> (add the .dark class for dark mode); the component code does not change.`,
      afterApply:
        "After apply_design_system, shadcn-style classes (bg-primary, rounded-md, shadow-md, font-sans) resolve to this system, and the --ds-* variables above are available for anything else.",
      standalone: standalone(name, tokens),
    },
    gaps: system.meta.gaps
      .filter((gap) => gap.path.startsWith(`components.${name}.`))
      .map(({ path, kind, note }) => ({ path, kind, note })),
  };
}
