/**
 * Maps a DESIGN.md's own color names (canvas, ink, hairline, surface-1, ...)
 * onto the shadcn roles, and derives the mode the DESIGN.md does not
 * document. Every choice is written to the Provenance.
 */
import { clampChroma, converter, formatHex } from "culori";
import {
  contrast,
  lightness,
  parseColor,
} from "../../design-systems/_schema/color";
import {
  COLOR_ROLES,
  type ColorRole,
  type ColorSet,
} from "../../design-systems/_schema/tokens";
import type { Provenance } from "./provenance";
import type { SystemConfig } from "./systems";

export type Mode = "light" | "dark";

const toOklch = converter("oklch");

interface Lch {
  l: number;
  c: number;
  h: number;
}

function lch(value: string): Lch {
  const color = toOklch(parseColor(value));
  return { l: color.l ?? 0, c: color.c ?? 0, h: color.h ?? 0 };
}

function oklch(l: number, c: number, h: number) {
  return formatHex(
    clampChroma(
      { mode: "oklch", l: Math.min(1, Math.max(0, l)), c, h },
      "oklch",
    ),
  );
}

const round = (value: number) => Math.round(value * 100) / 100;

/** Source key candidates per role, best first, for the documented mode. */
const CANDIDATES: Partial<Record<ColorRole, string[]>> = {
  background: ["canvas", "background", "page", "canvas-night"],
  foreground: ["ink", "text", "foreground", "body-strong"],
  card: [
    "surface-card",
    "card",
    "surface-1",
    "canvas-elevated",
    "surface-elevated",
    "surface",
  ],
  popover: [
    "surface-elevated",
    "canvas-elevated",
    "surface-2",
    "surface-card",
    "surface-1",
    "surface",
  ],
  secondary: [
    "surface-soft",
    "canvas-soft",
    "surface-1",
    "surface-2",
    "soft-cloud",
    "surface",
    "surface-elevated",
    "surface-card",
  ],
  muted: [
    "surface-soft",
    "canvas-soft",
    "surface-1",
    "surface-2",
    "soft-cloud",
    "surface",
    "surface-elevated",
    "surface-card",
  ],
  accent: [
    "surface-2",
    "surface-strong",
    "surface-soft",
    "canvas-soft",
    "surface-1",
    "soft-cloud",
    "surface-elevated",
    "surface-card",
  ],
  "muted-foreground": [
    "ink-muted",
    "ink-secondary",
    "body",
    "ink-soft",
    "charcoal",
    "slate",
    "mute",
    "muted",
    "ash",
    "steel",
  ],
  primary: ["primary"],
  "primary-foreground": ["on-primary", "primary-on", "button-fg"],
  "primary-hover": [
    "primary-hover",
    "blue-hover",
    "primary-active",
    "primary-pressed",
    "primary-press",
  ],
  destructive: [
    "semantic-error",
    "error",
    "negative",
    "danger",
    "brand-error",
    "accent-red",
    "sale",
    "primary-error-text",
    "ruby",
    "accent-rose",
  ],
  border: ["hairline", "border", "hairline-mid", "divider", "hairline-cool"],
  input: ["hairline-input", "hairline-strong", "border-strong", "hairline"],
  ring: ["ring-focus", "focus-ring", "primary-focus"],
  success: [
    "semantic-success",
    "success",
    "positive",
    "accent-green",
    "green",
    "accent-emerald",
  ],
  warning: [
    "semantic-warning",
    "warning",
    "brand-warn",
    "accent-yellow",
    "accent-amber",
    "lemon",
  ],
  overlay: ["semantic-overlay", "scrim", "overlay-scrim"],
};

/** Source keys that describe the other mode. */
const OTHER_MODE: Record<Mode, Partial<Record<ColorRole, string[]>>> = {
  // Keys a light-first DESIGN.md uses for its dark surfaces.
  dark: {
    background: [
      "inverse-canvas",
      "canvas-dark",
      "surface-dark",
      "surface-canvas-dark",
    ],
    foreground: ["inverse-ink", "on-dark"],
    card: ["inverse-surface-1", "surface-dark-elevated"],
    muted: ["inverse-surface-2", "surface-dark-soft"],
    "muted-foreground": [
      "inverse-ink-muted",
      "on-dark-muted",
      "on-dark-soft",
      "on-inverse-soft",
    ],
    border: ["hairline-dark"],
  },
  // Keys a dark-first DESIGN.md uses for its light surfaces.
  light: {
    background: [
      "inverse-canvas",
      "canvas-light",
      "surface-light",
      "surface-canvas-light",
      "canvas-paper",
    ],
    foreground: ["inverse-ink", "on-light", "on-canvas-light"],
    card: ["inverse-surface-1"],
    muted: ["inverse-surface-2"],
    "muted-foreground": ["inverse-ink-muted", "on-light-mute"],
  },
};

const SURFACE_ROLES = ["secondary", "muted", "accent"] as const;
const TEXT_ON_SURFACE = {
  "card-foreground": "card",
  "popover-foreground": "popover",
  "secondary-foreground": "secondary",
  "accent-foreground": "accent",
} as const;

/** Defaults for semantic roles the DESIGN.md does not name. */
const SEMANTIC_DEFAULTS: Record<
  "destructive" | "success" | "warning" | "overlay",
  Record<Mode, string>
> = {
  destructive: { light: "#d92d20", dark: "#f97066" },
  success: { light: "#15803d", dark: "#4ade80" },
  warning: { light: "#b45309", dark: "#fbbf24" },
  overlay: { light: "rgba(0, 0, 0, 0.4)", dark: "rgba(0, 0, 0, 0.6)" },
};

export interface Picked {
  value: string;
  key: string;
}

function pickKey(
  colors: Record<string, string>,
  keys: string[] | undefined,
  skip: (value: string) => boolean = () => false,
): Picked | undefined {
  for (const key of keys ?? []) {
    const value = colors[key];
    if (value && !skip(value)) {
      return { value, key };
    }
  }
  return;
}

const isDark = (value: string) => lightness(value) < 0.5;

/**
 * OKLCH lightness steps barely show near pure black, so dark surfaces step
 * from at least 0.13, about where a near-black canvas starts to read as gray.
 */
const lift = (l: number, mode: Mode) =>
  mode === "dark" ? Math.max(l, 0.13) : l;

/** A focus ring color: the primary, moved until it shows on the canvas (3:1). */
function focusRing(primary: string, background: string, mode: Mode) {
  const p = lch(primary);
  for (let step = 0; step <= 100; step++) {
    const l = p.l + (mode === "light" ? -1 : 1) * step * 0.01;
    const candidate = oklch(l, p.c, p.h);
    if (contrast(candidate, background) >= 3) {
      return candidate;
    }
  }
  return mode === "light" ? "#000000" : "#ffffff";
}

const CHART_KEY =
  /^(accent|product|block|gradient|brand|link|semantic|positive|negative|warning|success|error)/;
const NOT_CHART_KEY = /soft|bg|glow|pale|deep|dark|text/;

/** Chromatic accents in source order, for chart-2 to chart-5. */
function chartAccents(colors: Record<string, string>, primary: string) {
  const picked: Picked[] = [];
  const hues = [lch(primary).h];
  for (const [key, value] of Object.entries(colors)) {
    if (!CHART_KEY.test(key) || NOT_CHART_KEY.test(key)) {
      continue;
    }
    const color = lch(value);
    const hueGap = (h: number) => {
      const d = Math.abs(color.h - h) % 360;
      return Math.min(d, 360 - d);
    };
    if (color.c < 0.06 || hues.some((h) => hueGap(h) < 25)) {
      continue;
    }
    picked.push({ key, value });
    hues.push(color.h);
    if (picked.length === 4) {
      break;
    }
  }
  return picked;
}

/** The role values for the mode the DESIGN.md documents. */
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: one pass over the roles, each with its own fallback, reads clearest top to bottom
export function documentedMode(
  colors: Record<string, string>,
  config: SystemConfig,
  mode: Mode,
  provenance: Provenance,
): ColorSet {
  const set: Partial<Record<ColorRole, string>> = {};
  const at = (role: ColorRole) => `modes.${mode}.${role}`;
  const take = (role: ColorRole, picked: Picked | undefined) => {
    if (!picked) {
      return false;
    }
    set[role] = picked.value;
    provenance.from(at(role), `{colors.${picked.key}}`);
    return true;
  };
  const choose = (role: ColorRole, skip?: (value: string) => boolean) => {
    const override = config.colors?.[role];
    return take(
      role,
      pickKey(colors, override ? [override] : CANDIDATES[role], skip),
    );
  };

  for (const role of ["background", "foreground", "primary"] as const) {
    if (!choose(role)) {
      throw new Error(`No source color for ${role}`);
    }
  }
  const background = set.background as string;
  const foreground = set.foreground as string;
  const primary = set.primary as string;
  const shift = mode === "light" ? -1 : 1;
  const bg = lch(background);

  if (!choose("card")) {
    set.card = background;
    provenance.derived(
      at("card"),
      "No raised-surface token; cards use the canvas color.",
    );
  }
  if (!choose("popover", (value) => value === background)) {
    set.popover = set.card;
    provenance.derived(
      at("popover"),
      "No popover surface; uses the card color.",
    );
  }
  for (const role of SURFACE_ROLES) {
    if (!choose(role, (value) => value === background)) {
      set[role] = oklch(lift(bg.l, mode) + shift * 0.06, bg.c, bg.h);
      provenance.derived(
        at(role),
        `No soft surface token; the canvas shifted ${shift < 0 ? "darker" : "lighter"} by 0.06 OKLCH lightness.`,
      );
    }
  }
  if (!choose("muted-foreground", (value) => value === foreground)) {
    const fg = lch(foreground);
    set["muted-foreground"] = oklch(
      fg.l + (mode === "light" ? 0.3 : -0.25),
      fg.c,
      fg.h,
    );
    provenance.derived(
      at("muted-foreground"),
      "No secondary text token; the ink moved toward the canvas in OKLCH lightness.",
    );
  }
  for (const [role, surface] of Object.entries(TEXT_ON_SURFACE) as [
    keyof typeof TEXT_ON_SURFACE,
    ColorRole,
  ][]) {
    set[role] = foreground;
    provenance.from(at(role), provenance.mapping[at("foreground")] ?? "");
    if (contrast(foreground, set[surface] as string) < 3) {
      // A dark card in a light system (or the reverse) keeps text readable.
      set[role] = isDark(set[surface] as string) ? "#ffffff" : "#000000";
      delete provenance.mapping[at(role)];
      provenance.derived(
        at(role),
        `The ink is unreadable on the ${surface} surface, so text there is ${set[role]}.`,
      );
    }
  }
  if (!choose("primary-foreground")) {
    set["primary-foreground"] =
      contrast("#ffffff", primary) >= contrast("#000000", primary)
        ? "#ffffff"
        : "#000000";
    provenance.derived(
      at("primary-foreground"),
      "No on-primary token; white or black, whichever contrasts more with the primary.",
    );
  }
  if (!choose("primary-hover", (value) => value === primary)) {
    const p = lch(primary);
    set["primary-hover"] = oklch(p.l + (p.l > 0.5 ? -0.07 : 0.08), p.c, p.h);
    provenance.derived(
      at("primary-hover"),
      "No hover token; the primary moved 0.07 to 0.08 OKLCH lightness toward the middle.",
    );
  }
  if (!choose("border")) {
    set.border = oklch(lift(bg.l, mode) + shift * 0.1, bg.c, bg.h);
    provenance.derived(
      at("border"),
      "No hairline token; the canvas shifted 0.1 OKLCH lightness.",
    );
  }
  if (!choose("input")) {
    set.input = set.border;
    provenance.derived(
      at("input"),
      "No input border token; uses the hairline.",
    );
  }
  if (!choose("ring")) {
    set.ring = focusRing(primary, background, mode);
    provenance.derived(
      at("ring"),
      "No focus token; the primary, darkened or lightened until it reaches 3:1 on the canvas.",
    );
  }
  if (
    choose("overlay") &&
    parseColor(set.overlay as string).alpha === undefined
  ) {
    // An opaque scrim would hide the page entirely; keep its color, add alpha.
    const { r, g, b } = converter("rgb")(parseColor(set.overlay as string));
    const channel = (value: number | undefined) =>
      Math.round((value ?? 0) * 255);
    set.overlay = `rgba(${channel(r)}, ${channel(g)}, ${channel(b)}, 0.6)`;
    provenance.derived(
      at("overlay"),
      `The DESIGN.md's ${provenance.mapping[at("overlay")]} scrim is opaque; used at 60% alpha.`,
    );
    delete provenance.mapping[at("overlay")];
  }
  for (const role of [
    "destructive",
    "success",
    "warning",
    "overlay",
  ] as const) {
    if (set[role] === undefined && !choose(role)) {
      set[role] = SEMANTIC_DEFAULTS[role][mode];
      provenance.missing(
        at(role),
        `No ${role} token in the DESIGN.md; used the neutral default ${set[role]}.`,
      );
    }
  }

  set["chart-1"] = primary;
  provenance.from(at("chart-1"), provenance.mapping[at("primary")] ?? "");
  const accents = chartAccents(colors, primary);
  const p = lch(primary);
  for (let index = 2; index <= 5; index++) {
    const role = `chart-${index}` as ColorRole;
    const accent = accents[index - 2];
    if (accent) {
      set[role] = accent.value;
      provenance.from(at(role), `{colors.${accent.key}}`);
    } else {
      // Step away from whichever end of the lightness scale is nearer.
      const steps = [0.14, -0.14, 0.26, -0.26];
      let away = 0;
      if (p.l > 0.7) {
        away = -1;
      } else if (p.l < 0.3) {
        away = 1;
      }
      const step = away ? away * 0.12 * (index - 1) : (steps[index - 2] ?? 0);
      set[role] = oklch(p.l + step, Math.max(p.c * 0.8, 0.02), p.h);
      provenance.derived(
        at(role),
        `Not enough distinct accent colors; the primary at ${step >= 0 ? "+" : ""}${step} OKLCH lightness.`,
      );
    }
  }

  return set as ColorSet;
}

/** Other-mode values the DESIGN.md does state (inverse or dark tokens). */
function otherModeSource(
  colors: Record<string, string>,
  config: SystemConfig,
  mode: Mode,
): Partial<Record<ColorRole, Picked>> {
  const found: Partial<Record<ColorRole, Picked>> = {};
  const keys = OTHER_MODE[mode];
  for (const role of COLOR_ROLES) {
    const override = config.otherMode?.[role];
    const picked = pickKey(colors, override ? [override] : keys[role]);
    if (picked) {
      found[role] = picked;
    }
  }
  // A background on the wrong side of the lightness scale is not this mode.
  const background = found.background;
  if (background && isDark(background.value) !== (mode === "dark")) {
    return {};
  }
  return found;
}

/**
 * The other mode: stated tokens where the DESIGN.md has them, the rest
 * derived in OKLCH from the documented mode.
 */
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: one pass over the roles, each with its own derivation, reads clearest top to bottom
export function otherMode(
  colors: Record<string, string>,
  documented: ColorSet,
  config: SystemConfig,
  mode: Mode,
  provenance: Provenance,
): ColorSet {
  const stated = otherModeSource(colors, config, mode);
  const set: Partial<Record<ColorRole, string>> = {};
  const at = (role: ColorRole) => `modes.${mode}.${role}`;
  const dark = mode === "dark";
  const from = dark ? "light" : "dark";

  const use = (role: ColorRole, derive: () => string, note: string) => {
    const picked = stated[role];
    if (picked) {
      set[role] = picked.value;
      provenance.from(at(role), `{colors.${picked.key}}`);
      return;
    }
    set[role] = derive();
    provenance.derived(at(role), note);
  };

  const src = (role: ColorRole) => lch(documented[role]);
  const ground = src("background");
  const tint = Math.min(ground.c, dark ? 0.02 : 0.012);

  use(
    "background",
    () => oklch(dark ? 0.17 : 0.985, tint, ground.h),
    `The DESIGN.md documents ${from} mode only. Canvas set to OKLCH lightness ${dark ? 0.17 : 0.985}, keeping the source canvas hue.`,
  );
  const bg = lch(set.background as string);
  const surface = (offset: number) =>
    oklch(lift(bg.l, mode) + (dark ? offset : -offset), bg.c, bg.h);

  use(
    "card",
    () => (dark ? surface(0.035) : oklch(1, 0, bg.h)),
    dark
      ? "Derived: the canvas raised 0.035 OKLCH lightness."
      : "Derived: white cards on the light canvas.",
  );
  set.popover = dark ? surface(0.06) : (set.card as string);
  provenance.derived(
    at("popover"),
    dark
      ? "Derived: the canvas raised 0.06 OKLCH lightness."
      : "Derived: same as the card.",
  );
  use(
    "muted",
    () => surface(dark ? 0.09 : 0.03),
    `Derived: the canvas shifted ${dark ? 0.09 : 0.03} OKLCH lightness.`,
  );
  for (const role of ["secondary", "accent"] as const) {
    set[role] = set.muted as string;
    provenance.derived(at(role), "Derived: same as the muted surface.");
  }

  const ink = src("foreground");
  use(
    "foreground",
    () => oklch(dark ? 0.96 : 0.18, Math.min(ink.c, 0.02), ink.h),
    `Derived: the ink at OKLCH lightness ${dark ? 0.96 : 0.18}.`,
  );
  const mutedInk = src("muted-foreground");
  use(
    "muted-foreground",
    () => oklch(dark ? 0.72 : 0.47, Math.min(mutedInk.c, 0.03), mutedInk.h),
    `Derived: the secondary text at OKLCH lightness ${dark ? 0.72 : 0.47}.`,
  );
  for (const role of Object.keys(TEXT_ON_SURFACE) as ColorRole[]) {
    set[role] = set.foreground as string;
    provenance.derived(at(role), "Derived: same as the foreground.");
  }

  use(
    "border",
    () => surface(dark ? 0.13 : 0.08),
    `Derived: the canvas shifted ${dark ? 0.13 : 0.08} OKLCH lightness.`,
  );
  set.input = surface(dark ? 0.17 : 0.12);
  provenance.derived(
    at("input"),
    `Derived: the canvas shifted ${dark ? 0.17 : 0.12} OKLCH lightness.`,
  );

  const p = src("primary");
  const background = set.background as string;
  let primary = documented.primary;
  let primaryNote = `Kept the ${from}-mode primary; it reads on this canvas.`;
  if (stated.primary) {
    primary = stated.primary.value;
  } else if (p.c < 0.04 && (dark ? p.l < 0.5 : p.l > 0.5)) {
    primary = oklch(dark ? 0.94 : 0.2, p.c, p.h);
    primaryNote = `The neutral ${from}-mode primary would vanish here, so it is inverted to OKLCH lightness ${dark ? 0.94 : 0.2}.`;
  } else if (p.c < 0.1 && contrast(primary, background) < 3) {
    // Strongly colored primaries stay visible by hue, so only muted ones move.
    primary = oklch(dark ? Math.max(p.l, 0.72) : Math.min(p.l, 0.52), p.c, p.h);
    primaryNote = `The ${from}-mode primary is under 3:1 on this canvas, so its OKLCH lightness moved to ${round(lch(primary).l)}.`;
  }
  set.primary = primary;
  if (stated.primary) {
    provenance.from(at("primary"), `{colors.${stated.primary.key}}`);
  } else {
    provenance.derived(at("primary"), primaryNote);
  }

  const onPrimary = documented["primary-foreground"];
  if (stated["primary-foreground"]) {
    set["primary-foreground"] = stated["primary-foreground"].value;
    provenance.from(
      at("primary-foreground"),
      `{colors.${stated["primary-foreground"].key}}`,
    );
  } else if (contrast(onPrimary, primary) >= 4.5) {
    set["primary-foreground"] = onPrimary;
    provenance.derived(
      at("primary-foreground"),
      `Kept the ${from}-mode on-primary color.`,
    );
  } else {
    set["primary-foreground"] =
      contrast(set.foreground as string, primary) >=
      contrast(background, primary)
        ? (set.foreground as string)
        : background;
    provenance.derived(
      at("primary-foreground"),
      "The foreground or canvas color, whichever contrasts more with the primary.",
    );
  }
  const q = lch(primary);
  set["primary-hover"] = oklch(q.l + (q.l > 0.5 ? -0.07 : 0.08), q.c, q.h);
  provenance.derived(
    at("primary-hover"),
    "Derived: the primary moved 0.07 to 0.08 OKLCH lightness toward the middle.",
  );
  set.ring = focusRing(primary, background, mode);
  provenance.derived(
    at("ring"),
    "Derived: the primary, darkened or lightened until it reaches 3:1 on the canvas.",
  );

  for (const role of ["destructive", "success", "warning"] as const) {
    const c = src(role);
    set[role] = oklch(
      dark ? Math.max(c.l, 0.68) : Math.min(c.l, 0.55),
      c.c,
      c.h,
    );
    provenance.derived(
      at(role),
      `Derived: the ${from}-mode color with OKLCH lightness ${dark ? "at least 0.68" : "at most 0.55"}.`,
    );
  }
  set.overlay = SEMANTIC_DEFAULTS.overlay[mode];
  provenance.missing(
    at("overlay"),
    `No ${mode}-mode scrim; used ${set.overlay}.`,
  );

  for (let index = 1; index <= 5; index++) {
    const role = `chart-${index}` as ColorRole;
    const c = src(role);
    set[role] =
      index === 1
        ? primary
        : oklch(
            // Mirrored, so the series keep their order of lightness.
            dark
              ? Math.min(Math.max(1.25 - c.l, 0.55), 0.85)
              : Math.min(Math.max(1.15 - c.l, 0.35), 0.72),
            c.c,
            c.h,
          );
    provenance.derived(
      at(role),
      index === 1
        ? "Derived: same as this mode's primary."
        : `Derived: the ${from}-mode chart color with its OKLCH lightness mirrored and clamped for this canvas.`,
    );
  }

  return set as ColorSet;
}
