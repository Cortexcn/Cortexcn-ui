/**
 * Builds design-systems/<id>/ from a DESIGN.md (`bun run ds:ingest [ids]`):
 * - DESIGN.md: fetched with the getdesign CLI and kept verbatim, plus a
 *   source comment right after the front matter (which must stay first);
 * - tokens.json: extracted from the YAML front matter, mapped to the schema;
 * - meta.json: tags, fonts, provenance, and every gap;
 * - theme.css: generated from tokens.json.
 *
 * An existing DESIGN.md is reused; pass --refetch to fetch it again.
 */
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { checkContrast, lightness } from "../../design-systems/_schema/color";
import { themeCss } from "../../design-systems/_schema/css";
import { type DesignMeta, metaSchema } from "../../design-systems/_schema/meta";
import {
  type DesignTokens,
  RADIUS_KEYS,
  type Recipes,
  tokensSchema,
} from "../../design-systems/_schema/tokens";
import { documentedMode, type Mode, otherMode } from "./colors";
import { formatFiles } from "./format";
import { Provenance } from "./provenance";
import {
  firstFamily,
  type Group,
  lineHeightRatio,
  parsePadding,
  parseSource,
  reference,
  type Source,
  shadowsIn,
  toPx,
  trackingEm,
} from "./source";
import { type Category, SYSTEMS, type SystemConfig } from "./systems";

const ROOT = resolve(import.meta.dirname, "../../design-systems");
const CLI = "getdesign@0.6.25";
const LICENSE = "MIT (github.com/VoltAgent/awesome-design-md)";

type RadiusKey = (typeof RADIUS_KEYS)[number];
type Weight = "regular" | "medium" | "bold";

const GENERIC: Record<Category, string> = {
  sans: "ui-sans-serif, system-ui, sans-serif",
  serif: "ui-serif, Georgia, serif",
  mono: "ui-monospace, SFMono-Regular, Menlo, monospace",
};

const DEFAULT_ELEVATION = {
  "1": "0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  "2": "0 4px 12px -2px rgba(0, 0, 0, 0.12)",
  "3": "0 16px 32px -8px rgba(0, 0, 0, 0.24)",
};

const DEFAULT_MOTION = {
  fast: "120ms",
  base: "200ms",
  slow: "320ms",
  easing: "cubic-bezier(0.2, 0, 0, 1)",
};

/** Patterns that find a role among a DESIGN.md's own key names, best first. */
const KEYS = {
  button: [/^button-primary/, /^button/],
  input: [/^text-input$/, /input/],
  inputSkip: /focus|error/,
  card: [
    /^card-base$/,
    /^card-content$/,
    /^feature-card$/,
    /^card-feature/,
    /card/,
  ],
  cardSkip:
    /pricing|testimonial|logo|mockup|code|cookie|hero|dashboard|screenshot|image|photo|stat|gradient|spotlight|illustrat|window/,
  badge: [/^badge/, /status-badge/, /tag/, /chip/],
  tabs: [/segmented-tab/, /product-tab/, /category-tab/, /pill-tab/, /tab/],
  tabsSkip: /active|selected/,
  accordion: [/accordion/, /faq/, /disclosure/],
  dialog: [/modal/, /dialog/],
  display: [/^display/, /^hero-display/, /^heading/],
  body: [/^body-md$/, /^body$/, /^body/],
  buttonType: [/^button/],
  mono: [/mono/, /^code/],
};
const FRONT_MATTER = /^---\n[\s\S]*?\n---\n/;
const FETCHED_AT = /Fetched: (\d{4}-\d{2}-\d{2})/;

const sourceUrl = (slug: string) => `https://getdesign.md/${slug}/design-md`;
const disclaimer = (name: string) =>
  `Unofficial and inspired by ${name}'s public website; not affiliated with or endorsed by ${name}.`;

function fetchDesignMd(slug: string): string {
  const dir = mkdtempSync(join(tmpdir(), "getdesign-"));
  const out = join(dir, "DESIGN.md");
  try {
    execFileSync("npx", ["--yes", CLI, "add", slug, "--out", out], {
      stdio: "ignore",
      shell: process.platform === "win32",
    });
    return readFileSync(out, "utf8").replace(/\r\n/g, "\n");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/** Puts the source comment right after the front matter. */
function withHeader(raw: string, config: SystemConfig, fetchedAt: string) {
  const header = [
    "<!--",
    `  Source: ${sourceUrl(config.slug)} (${LICENSE}).`,
    `  Fetched: ${fetchedAt} with \`npx ${CLI} add ${config.slug}\`. Everything outside this comment is the fetched file, unchanged.`,
    `  ${disclaimer(config.name)}`,
    "-->",
    "",
  ].join("\n");
  const match = raw.match(FRONT_MATTER);
  return match
    ? `${match[0]}${header}${raw.slice(match[0].length)}`
    : `${header}${raw}`;
}

function readOrFetch(config: SystemConfig, refetch: boolean) {
  const path = join(ROOT, config.id, "DESIGN.md");
  if (existsSync(path) && !refetch) {
    const text = readFileSync(path, "utf8").replace(/\r\n/g, "\n");
    const fetchedAt = text.match(FETCHED_AT)?.[1];
    if (fetchedAt) {
      return { text, fetchedAt };
    }
  }
  const fetchedAt = new Date().toISOString().slice(0, 10);
  const text = withHeader(fetchDesignMd(config.slug), config, fetchedAt);
  mkdirSync(join(ROOT, config.id), { recursive: true });
  writeFileSync(path, text);
  return { text, fetchedAt };
}

function firstKey(
  keys: string[],
  patterns: RegExp[],
  avoid?: RegExp,
): string | undefined {
  for (const pattern of patterns) {
    const key = keys.find((k) => pattern.test(k) && !avoid?.test(k));
    if (key) {
      return key;
    }
  }
  return;
}

/** Resolves `{typography.button-md}` on a component to its type entry. */
function typeOf(source: Source, component: Group | undefined) {
  const ref = reference(component?.typography);
  return ref?.[0] === "typography" ? source.typography[ref[1]] : undefined;
}

interface Context {
  source: Source;
  config: SystemConfig;
  provenance: Provenance;
  radius: DesignTokens["radius"];
  weights: DesignTokens["typography"]["weights"];
}

function typography(ctx: Context, keys: Record<string, string | undefined>) {
  const { source, config, provenance } = ctx;
  const entry = (key: string | undefined) =>
    key ? source.typography[key] : undefined;
  const display = entry(keys.display);
  const body = entry(keys.body);
  const button = entry(keys.button);

  const fontFor = (role: "display" | "body" | "mono") => {
    const key = keys[role];
    const named = firstFamily(entry(key)?.fontFamily);
    const pick = config.fonts[role];
    const path = `typography.${role}`;
    const stack = `"${pick.family}", ${GENERIC[pick.category]}`;
    if (!(key && named)) {
      provenance.missing(
        `${path}.*`,
        `No ${role} face in the DESIGN.md; ${pick.family} (${pick.license}) is used.`,
      );
      return { family: pick.family, fallback: pick.family, stack };
    }
    provenance.from(`${path}.family`, `{typography.${key}.fontFamily}`);
    if (named.toLowerCase() === pick.family.toLowerCase()) {
      provenance.from(`${path}.fallback`, `{typography.${key}.fontFamily}`);
      provenance.from(`${path}.stack`, `{typography.${key}.fontFamily}`);
    } else {
      const note = `${named} is not open-licensed or not freely loadable; ${pick.family} (${pick.license}) stands in, following the DESIGN.md's substitute notes where it gives them.`;
      provenance.font(`${path}.fallback`, note);
      provenance.font(`${path}.stack`, note);
    }
    return { family: named, fallback: pick.family, stack };
  };

  const sizes = [
    ...new Set(
      Object.values(source.typography)
        .map((type) => toPx(type.fontSize))
        .filter((size): size is number => size !== undefined && size > 0),
    ),
  ].sort((a, b) => a - b);
  provenance.from("typography.scale", "{typography.*.fontSize}");

  const weight = (
    type: Group | undefined,
    key: string | undefined,
    path: string,
    fallback: number,
  ) => {
    const value = Number(type?.fontWeight);
    if (Number.isInteger(value) && value >= 100 && value <= 900) {
      provenance.from(path, `{typography.${key}.fontWeight}`);
      return value;
    }
    provenance.missing(path, `No weight stated; used ${fallback}.`);
    return fallback;
  };

  const tracking = (
    type: Group | undefined,
    key: string | undefined,
    path: string,
  ) => {
    const value = trackingEm(type);
    if (value !== undefined) {
      provenance.from(path, `{typography.${key}.letterSpacing}`);
      return value;
    }
    provenance.missing(path, "No letter spacing stated; used 0.");
    return "0";
  };

  const leading = (
    type: Group | undefined,
    key: string | undefined,
    path: string,
    fallback: number,
  ) => {
    const value = lineHeightRatio(type);
    if (value !== undefined && value > 0) {
      provenance.from(path, `{typography.${key}.lineHeight}`);
      return Math.round(value * 100) / 100;
    }
    provenance.missing(path, `No line height stated; used ${fallback}.`);
    return fallback;
  };

  return {
    display: fontFor("display"),
    body: fontFor("body"),
    mono: fontFor("mono"),
    scale: sizes.length >= 3 ? sizes : [12, 14, 16, 20, 24, 32],
    weights: {
      regular: weight(body, keys.body, "typography.weights.regular", 400),
      medium: weight(button, keys.button, "typography.weights.medium", 500),
      bold: weight(display, keys.display, "typography.weights.bold", 600),
    },
    tracking: {
      display: tracking(display, keys.display, "typography.tracking.display"),
      body: tracking(body, keys.body, "typography.tracking.body"),
    },
    lineHeight: {
      display: leading(
        display,
        keys.display,
        "typography.lineHeight.display",
        1.1,
      ),
      body: leading(body, keys.body, "typography.lineHeight.body", 1.5),
    },
  };
}

const px = (value: number) => `${Math.round(value * 100) / 100}px`;

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: each scale step has its own stated-or-derived branch
function radiusScale(
  source: Source,
  provenance: Provenance,
  aliases: SystemConfig["radius"] = {},
) {
  const name = (key: string) => aliases[key as keyof typeof aliases] ?? key;
  const stated = (key: string) => toPx(source.rounded[name(key)]);
  const scale: Partial<Record<RadiusKey, string>> = {};
  const sharp = ["xs", "sm", "md", "lg", "xl"].every(
    (key) => stated(key) === undefined,
  );

  scale.none = "0px";
  if (stated("none") === undefined) {
    provenance.derived("radius.none", "Zero by definition.");
  } else {
    provenance.from("radius.none", "{rounded.none}");
  }

  const full = source.rounded.full === undefined ? "pill" : "full";
  const fullValue = toPx(source.rounded[full]);
  if (fullValue === undefined || String(source.rounded[full]).includes("%")) {
    scale.full = "9999px";
    provenance.derived(
      "radius.full",
      "Fully round; written as 9999px so pills keep straight sides.",
    );
  } else {
    scale.full = px(fullValue);
    provenance.from("radius.full", `{rounded.${full}}`);
  }

  if (sharp) {
    for (const key of ["xs", "sm", "md", "lg", "xl"] as const) {
      scale[key] = "0px";
      provenance.derived(
        `radius.${key}`,
        "The DESIGN.md documents only square and fully round corners, so every step is 0.",
      );
    }
    return scale as DesignTokens["radius"];
  }

  const values: Partial<Record<RadiusKey, number>> = {};
  for (const key of ["xs", "sm", "md", "lg", "xl"] as const) {
    const value = stated(key);
    if (value !== undefined) {
      values[key] = value;
      provenance.from(`radius.${key}`, `{rounded.${name(key)}}`);
    }
  }
  const fill = (key: RadiusKey, value: number, note: string) => {
    values[key] = Math.round(value);
    provenance.derived(`radius.${key}`, note);
  };
  if (values.md === undefined) {
    fill(
      "md",
      values.sm !== undefined && values.lg !== undefined
        ? (values.sm + values.lg) / 2
        : (values.sm ?? (values.lg ?? 8) / 1.5) * (values.sm ? 1.33 : 1),
      "No md step; between the stated sm and lg.",
    );
  }
  const md = values.md ?? 8;
  if (values.sm === undefined) {
    fill("sm", md * 0.75, "No sm step; 0.75 of md.");
  }
  if (values.lg === undefined) {
    fill("lg", md * 1.5, "No lg step; 1.5 times md.");
  }
  if (values.xs === undefined) {
    fill("xs", Math.max(2, (values.sm ?? md) / 2), "No xs step; half of sm.");
  }
  if (values.xl === undefined) {
    fill(
      "xl",
      toPx(source.rounded.xxl) ?? (values.lg ?? md) * 1.33,
      "No xl step; the xxl step, or 1.33 times lg.",
    );
  }
  for (const key of ["xs", "sm", "md", "lg", "xl"] as const) {
    scale[key] = px(values[key] ?? md);
  }
  return scale as DesignTokens["radius"];
}

/** Maps a component's `rounded` to a key of the radius scale. */
function radiusRef(
  ctx: Context,
  component: Group | undefined,
  componentKey: string | undefined,
  path: string,
  fallback: RadiusKey,
  note: string,
): RadiusKey {
  const raw = component?.rounded;
  if (raw === undefined) {
    ctx.provenance.missing(path, note);
    return fallback;
  }
  const ref = reference(raw);
  const value = ref ? ctx.source.rounded[ref[1]] : raw;
  const target = String(value).includes("%") ? 9999 : toPx(value);
  ctx.provenance.from(path, `{components.${componentKey}.rounded}`);
  if (ref && (RADIUS_KEYS as readonly string[]).includes(ref[1])) {
    return ref[1] as RadiusKey;
  }
  if (ref?.[1] === "pill" || (target !== undefined && target >= 999)) {
    return "full";
  }
  let best: RadiusKey = fallback;
  let distance = Number.POSITIVE_INFINITY;
  for (const key of RADIUS_KEYS) {
    const d = Math.abs((toPx(ctx.radius[key]) ?? 0) - (target ?? 0));
    if (d < distance) {
      best = key;
      distance = d;
    }
  }
  return best;
}

function weightRef(ctx: Context, type: Group | undefined): Weight {
  const value = Number(type?.fontWeight);
  const entries = Object.entries(ctx.weights) as [Weight, number][];
  if (!Number.isFinite(value)) {
    return "medium";
  }
  return entries.reduce((best, entry) =>
    Math.abs(entry[1] - value) < Math.abs(best[1] - value) ? entry : best,
  )[0];
}

const clampHeight = (value: number) =>
  Math.min(56, Math.max(28, Math.round(value)));

function controlHeight(
  ctx: Context,
  component: Group | undefined,
  key: string | undefined,
  path: string,
  fallbackType: Group | undefined,
) {
  const stated = toPx(component?.height);
  if (stated !== undefined) {
    ctx.provenance.from(path, `{components.${key}.height}`);
    return clampHeight(stated);
  }
  const type = typeOf(ctx.source, component) ?? fallbackType;
  const size = toPx(type?.fontSize) ?? 14;
  const line = lineHeightRatio(type) ?? 1.43;
  const padding = parsePadding(component?.padding)?.y ?? 8;
  const height = clampHeight(size * line + padding * 2);
  ctx.provenance.derived(
    path,
    `No height stated; ${size}px type at ${Math.round(line * 100) / 100} line height plus ${padding}px padding top and bottom, kept between 28 and 56px.`,
  );
  return height;
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: one pass over the eleven recipes, each recording where its values came from
function recipes(
  ctx: Context,
  bodyType: Group | undefined,
  surfaces: { background: string; card: string; muted: string },
): Recipes {
  const { source, config, provenance } = ctx;
  const keys = Object.keys(source.components);
  const named = (
    role: keyof NonNullable<SystemConfig["components"]>,
    patterns: RegExp[],
    avoid?: RegExp,
  ) => config.components?.[role] ?? firstKey(keys, patterns, avoid);
  const get = (key: string | undefined) =>
    key ? source.components[key] : undefined;
  const ref = (key: string | undefined, prop: string) =>
    `{components.${key}.${prop}}`;
  const surfaceOf = (
    value: unknown,
    options: Record<string, string>,
  ): string | undefined => {
    const r = reference(value);
    const color = r?.[0] === "colors" ? source.colors[r[1]] : String(value);
    return Object.entries(options).find(([, v]) => v === color)?.[0];
  };

  // Button
  const buttonKey = named("button", KEYS.button);
  const button = get(buttonKey);
  const buttonType = typeOf(source, button);
  const buttonPadding = parsePadding(button?.padding);
  const md = controlHeight(
    ctx,
    button,
    buttonKey,
    "components.button.height.md",
    buttonType,
  );
  provenance.derived(
    "components.button.height.xs",
    "md minus 12px, the same steps as the base theme.",
  );
  provenance.derived("components.button.height.sm", "md minus 4px.");
  provenance.derived("components.button.height.lg", "md plus 4px.");
  if (buttonPadding) {
    provenance.from("components.button.paddingX", ref(buttonKey, "padding"));
  } else {
    provenance.missing(
      "components.button.paddingX",
      "No padding stated; 16px.",
    );
  }
  const buttonTypeKey = reference(button?.typography)?.[1];
  const typeRef = buttonTypeKey
    ? `{typography.${buttonTypeKey}}`
    : "(no button type)";
  provenance.from("components.button.weight", `${typeRef}.fontWeight`);
  provenance.from(
    "components.button.textTransform",
    `${typeRef}.textTransform (absent means none)`,
  );
  provenance.from(
    "components.button.tracking",
    `${typeRef}.letterSpacing (absent means 0)`,
  );
  provenance.from(
    "components.button.shadow",
    `${ref(buttonKey, "*")} (no shadow listed)`,
  );

  // Input
  const inputKey = named("input", KEYS.input, KEYS.inputSkip);
  const input = get(inputKey);
  const inputBackground =
    surfaceOf(input?.backgroundColor, {
      transparent: surfaces.background,
      card: surfaces.card,
      muted: surfaces.muted,
    }) ?? "transparent";
  if (input?.backgroundColor === undefined) {
    provenance.missing(
      "components.input.background",
      "No input fill stated; transparent on the canvas.",
    );
  } else if (
    surfaceOf(input.backgroundColor, {
      a: surfaces.background,
      b: surfaces.card,
      c: surfaces.muted,
    })
  ) {
    provenance.from(
      "components.input.background",
      ref(inputKey, "backgroundColor"),
    );
  } else {
    provenance.derived(
      "components.input.background",
      "The stated fill matches no surface role; transparent on the canvas.",
    );
  }
  const inputPadding = parsePadding(input?.padding);
  if (inputPadding) {
    provenance.from("components.input.paddingX", ref(inputKey, "padding"));
  } else {
    provenance.missing("components.input.paddingX", "No padding stated; 12px.");
  }
  provenance.from(
    "components.input.shadow",
    `${ref(inputKey, "*")} (no shadow listed)`,
  );

  // Card
  const cardKey = named("card", KEYS.card, KEYS.cardSkip);
  const card = get(cardKey);
  const statedCardPadding = parsePadding(card?.padding);
  const cardPadding = statedCardPadding?.x ? statedCardPadding : undefined;
  if (cardPadding) {
    provenance.from("components.card.padding", ref(cardKey, "padding"));
  } else if (statedCardPadding) {
    provenance.derived(
      "components.card.padding",
      "The card spec has no padding (its content runs edge to edge); 24px for text cards.",
    );
  } else {
    provenance.missing("components.card.padding", "No padding stated; 24px.");
  }
  const cardBackground =
    surfaceOf(card?.backgroundColor, {
      card: surfaces.card,
      background: surfaces.background,
      muted: surfaces.muted,
    }) ?? "card";
  if (
    card?.backgroundColor !== undefined &&
    surfaceOf(card.backgroundColor, {
      a: surfaces.card,
      b: surfaces.background,
      c: surfaces.muted,
    })
  ) {
    provenance.from(
      "components.card.background",
      ref(cardKey, "backgroundColor"),
    );
  } else {
    provenance.derived(
      "components.card.background",
      "The card fill matches no surface role (or is not stated); uses the card surface.",
    );
  }
  const cardBorder =
    card?.border !== undefined || card?.borderColor !== undefined;
  if (cardBorder) {
    provenance.from("components.card.border", ref(cardKey, "border"));
  } else {
    provenance.derived(
      "components.card.border",
      cardBackground === "background" || surfaces.card === surfaces.background
        ? "No border stated, but the card shares the canvas color, so a hairline keeps its edge."
        : "No border stated; the card stands apart by its fill.",
    );
  }
  provenance.from(
    "components.card.shadow",
    `${ref(cardKey, "*")} (no shadow listed)`,
  );

  // Badge
  const badgeKey = named("badge", KEYS.badge);
  const badge = get(badgeKey);
  const badgeType = typeOf(source, badge);
  const badgePadding = parsePadding(badge?.padding);
  if (badgePadding) {
    provenance.from("components.badge.paddingX", ref(badgeKey, "padding"));
  } else {
    provenance.missing("components.badge.paddingX", "No badge padding; 8px.");
  }
  if (badgeType) {
    provenance.from("components.badge.weight", ref(badgeKey, "typography"));
    provenance.from(
      "components.badge.textTransform",
      `${ref(badgeKey, "typography")} (absent means none)`,
    );
  } else {
    provenance.missing("components.badge.weight", "No badge type; medium.");
    provenance.missing(
      "components.badge.textTransform",
      "No badge type; no transform.",
    );
  }

  // Tabs
  const tabsKey = named("tabs", KEYS.tabs, KEYS.tabsSkip);
  const tabs = get(tabsKey);
  const underline =
    tabs?.activeIndicator !== undefined ||
    keys.some(
      (key) => key.includes("tab") && get(key)?.activeIndicator !== undefined,
    );
  if (underline) {
    provenance.from("components.tabs.style", ref(tabsKey, "activeIndicator"));
  } else {
    provenance.derived(
      "components.tabs.style",
      tabs
        ? "The tab spec has no underline indicator, so tabs are segmented."
        : "No tab spec; segmented tabs.",
    );
  }

  // Accordion
  const accordionKey = named("accordion", KEYS.accordion);
  const accordion = get(accordionKey);
  if (
    accordion?.border !== undefined ||
    accordion?.borderColor !== undefined ||
    accordion?.rowBorder !== undefined
  ) {
    provenance.from(
      "components.accordion.dividers",
      ref(accordionKey, "border"),
    );
  } else {
    provenance.derived(
      "components.accordion.dividers",
      "No row rule stated; hairlines divide the rows, as in the base theme.",
    );
  }
  if (accordion) {
    provenance.from(
      "components.accordion.triggerWeight",
      ref(accordionKey, "typography"),
    );
  } else {
    provenance.missing(
      "components.accordion.triggerWeight",
      "No accordion spec; medium trigger text.",
    );
  }
  provenance.missing(
    "components.accordion.chevron",
    "Not stated; the chevron turns 180 degrees.",
  );
  provenance.missing(
    "components.accordion.duration",
    "Not stated; uses the base motion duration.",
  );
  const accordionPadding = parsePadding(accordion?.padding);
  if (accordionPadding) {
    provenance.from(
      "components.accordion.paddingY",
      ref(accordionKey, "padding"),
    );
  } else {
    provenance.missing("components.accordion.paddingY", "Not stated; 16px.");
  }

  // Dialog
  const dialogKey = named("dialog", KEYS.dialog);
  const dialog = get(dialogKey);
  const dialogPadding = parsePadding(dialog?.padding);
  if (dialogPadding) {
    provenance.from("components.dialog.padding", ref(dialogKey, "padding"));
  } else {
    provenance.missing("components.dialog.padding", "Not stated; 24px.");
  }
  provenance.missing(
    "components.dialog.shadow",
    "Not stated; the largest elevation step.",
  );

  const cardRadius = radiusRef(
    ctx,
    card,
    cardKey,
    "components.card.radius",
    "lg",
    "No card spec; lg corners.",
  );
  const order = RADIUS_KEYS.filter((key) => key !== "full");
  const step = (key: RadiusKey, by: number): RadiusKey => {
    if (key === "full") {
      return by < 0 ? "xl" : "full";
    }
    const index = order.indexOf(key) + by;
    return order[Math.min(order.length - 1, Math.max(0, index))] ?? key;
  };
  const menuRadius = cardRadius === "full" ? "xl" : step(cardRadius, -1);
  provenance.derived(
    "components.menu.radius",
    "No menu spec; one step smaller than the card corners.",
  );
  provenance.derived(
    "components.menu.itemRadius",
    "One step smaller than the menu corners.",
  );
  provenance.missing("components.menu.shadow", "Not stated; elevation 2.");
  const smallest = ctx.radius.sm === "0px" ? "none" : "xs";
  provenance.derived(
    "components.control.radius",
    "No checkbox spec; the xs corner (none when the system is square).",
  );
  provenance.derived(
    "components.tooltip.radius",
    "No tooltip spec; the sm corner.",
  );
  provenance.derived(
    "components.alert.radius",
    "No alert spec; the same corners as cards.",
  );

  return {
    button: {
      radius: radiusRef(
        ctx,
        button,
        buttonKey,
        "components.button.radius",
        "md",
        "No button spec; md corners.",
      ),
      height: { xs: Math.max(20, md - 12), sm: md - 4, md, lg: md + 4 },
      paddingX: buttonPadding?.x ?? 16,
      weight: weightRef(ctx, buttonType),
      textTransform:
        buttonType?.textTransform === "uppercase" ? "uppercase" : "none",
      tracking: trackingEm(buttonType) ?? "0",
      shadow: "0",
    },
    input: {
      radius: radiusRef(
        ctx,
        input,
        inputKey,
        "components.input.radius",
        "md",
        "No input spec; md corners.",
      ),
      height: controlHeight(
        ctx,
        input,
        inputKey,
        "components.input.height",
        bodyType,
      ),
      paddingX: inputPadding?.x ?? 12,
      background: inputBackground as Recipes["input"]["background"],
      shadow: "0",
    },
    card: {
      radius: cardRadius,
      padding: cardPadding?.x ?? 24,
      shadow: "0",
      border:
        cardBorder ||
        cardBackground === "background" ||
        surfaces.card === surfaces.background,
      background: cardBackground as Recipes["card"]["background"],
    },
    badge: {
      radius: radiusRef(
        ctx,
        badge,
        badgeKey,
        "components.badge.radius",
        ctx.radius.sm === "0px" ? "none" : "full",
        ctx.radius.sm === "0px"
          ? "No badge spec; square, like the rest of the system."
          : "No badge spec; fully round.",
      ),
      paddingX: badgePadding?.x ?? 8,
      weight: badgeType ? weightRef(ctx, badgeType) : "medium",
      textTransform:
        badgeType?.textTransform === "uppercase" ? "uppercase" : "none",
    },
    tabs: {
      radius: radiusRef(
        ctx,
        tabs,
        tabsKey,
        "components.tabs.radius",
        "md",
        "No tab spec; md corners.",
      ),
      style: underline ? "underline" : "segmented",
    },
    accordion: {
      dividers: true,
      triggerWeight: accordion
        ? weightRef(ctx, typeOf(source, accordion))
        : "medium",
      chevron: "rotate-180",
      duration: "base",
      paddingY: accordionPadding?.y ?? 16,
    },
    dialog: {
      radius: radiusRef(
        ctx,
        dialog,
        dialogKey,
        "components.dialog.radius",
        cardRadius === "full" ? "xl" : cardRadius,
        "No dialog spec; the card corners.",
      ),
      shadow: "3",
      padding: dialogPadding?.x ?? 24,
    },
    menu: {
      radius: menuRadius,
      itemRadius: step(menuRadius, -1),
      shadow: "2",
    },
    control: { radius: smallest },
    tooltip: { radius: ctx.radius.sm === "0px" ? "none" : "sm" },
    alert: { radius: cardRadius === "full" ? "xl" : cardRadius },
  };
}

function spacing(source: Source, provenance: Provenance, buttonHeight: number) {
  const values = Object.values(source.spacing)
    .map(toPx)
    .filter((value): value is number => value !== undefined && value > 0)
    .map(Math.round);
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const step = values.reduce((a, b) => gcd(a, b), 0);
  const unit = step >= 2 && step <= 8 ? step : 4;
  provenance.derived(
    "spacing.unit",
    values.length > 0
      ? `The greatest common step of the spacing scale (${values.join(", ")}px)${unit === step ? "" : ", or 4px when that is under 2 or over 8"}.`
      : "No spacing scale; 4px.",
  );
  let density: DesignTokens["spacing"]["density"] = "default";
  if (buttonHeight <= 32) {
    density = "compact";
  } else if (buttonHeight >= 44) {
    density = "comfortable";
  }
  provenance.derived(
    "spacing.density",
    `From the ${buttonHeight}px button height: 32 or under is compact, 44 or over is comfortable.`,
  );
  return { unit, density };
}

function elevation(source: Source, provenance: Provenance) {
  const stated = shadowsIn(source.text).slice(-3);
  const result: DesignTokens["elevation"] = {
    "0": "none",
    ...DEFAULT_ELEVATION,
  };
  provenance.derived("elevation.0", "No shadow by definition.");
  const levels = ["1", "2", "3"] as const;
  // Quoted shadows fill the steps from the smallest up.
  levels.forEach((level, index) => {
    const shadow = stated[index];
    if (shadow) {
      result[level] = shadow;
      provenance.from(
        `elevation.${level}`,
        "(quoted in the Elevation section)",
      );
    } else {
      provenance.missing(
        `elevation.${level}`,
        `The DESIGN.md quotes no shadow for this step; used the neutral default ${DEFAULT_ELEVATION[level]}.`,
      );
    }
  });
  return result;
}

/** Sets a dotted token path, such as `components.card.border`. */
function applyProse(target: object, path: string, value: unknown) {
  const parts = path.split(".");
  const last = parts.pop();
  let node = target as Record<string, unknown>;
  for (const part of parts) {
    const next = node[part];
    if (typeof next !== "object" || next === null) {
      throw new Error(`prose override ${path}: no ${part}`);
    }
    node = next as Record<string, unknown>;
  }
  if (!(last && last in node)) {
    throw new Error(`prose override ${path}: unknown token`);
  }
  node[last] = value;
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: the pipeline for one system, step by step
function build(config: SystemConfig, refetch: boolean) {
  const { text, fetchedAt } = readOrFetch(config, refetch);
  const source = parseSource(text);
  const provenance = new Provenance();

  const backgroundKey = config.colors?.background ?? "canvas";
  const canvas =
    source.colors[backgroundKey] ?? source.colors.background ?? "#ffffff";
  const mode: Mode =
    config.sourceMode ?? (lightness(canvas) < 0.5 ? "dark" : "light");
  const other: Mode = mode === "light" ? "dark" : "light";

  // The primary button's own fill and text say more about "primary" than a
  // color named primary does (some systems name their canvas that).
  const buttonKey =
    config.components?.button ??
    firstKey(Object.keys(source.components), KEYS.button);
  const button = buttonKey ? source.components[buttonKey] : undefined;
  const colorKey = (value: unknown) => {
    const ref = reference(value);
    return ref?.[0] === "colors" && source.colors[ref[1]] ? ref[1] : undefined;
  };
  const fillKey = colorKey(button?.backgroundColor);
  const filled = fillKey !== undefined && source.colors[fillKey] !== canvas;
  const effective: SystemConfig = {
    ...config,
    colors: {
      primary: filled ? fillKey : undefined,
      "primary-foreground": filled ? colorKey(button?.textColor) : undefined,
      ...config.colors,
    },
  };
  const documented = documentedMode(source.colors, effective, mode, provenance);
  const derived = otherMode(
    source.colors,
    documented,
    effective,
    other,
    provenance,
  );
  const modes =
    mode === "light"
      ? { light: documented, dark: derived }
      : { light: derived, dark: documented };

  const typeKeys = Object.keys(source.typography);
  const keys = {
    display: config.typography?.display ?? firstKey(typeKeys, KEYS.display),
    body: config.typography?.body ?? firstKey(typeKeys, KEYS.body),
    button: config.typography?.button ?? firstKey(typeKeys, KEYS.buttonType),
    mono: config.typography?.mono ?? firstKey(typeKeys, KEYS.mono),
  };
  const ctx: Context = {
    source,
    config,
    provenance,
    radius: radiusScale(source, provenance, config.radius),
    weights: { regular: 400, medium: 500, bold: 600 },
  };
  const type = typography(ctx, keys);
  ctx.weights = type.weights;

  const components = recipes(
    ctx,
    keys.body ? source.typography[keys.body] : undefined,
    {
      background: documented.background,
      card: documented.card,
      muted: documented.muted,
    },
  );

  provenance.missing(
    "motion.*",
    `The DESIGN.md has no motion tokens; used ${DEFAULT_MOTION.fast} / ${DEFAULT_MOTION.base} / ${DEFAULT_MOTION.slow} with ${DEFAULT_MOTION.easing}. Reduced-motion users get 0ms.`,
  );

  const draft = {
    id: config.id,
    modes,
    typography: type,
    radius: ctx.radius,
    spacing: spacing(source, provenance, components.button.height.md),
    elevation: elevation(source, provenance),
    motion: DEFAULT_MOTION,
    components,
  };
  for (const { path, value, quote } of config.prose ?? []) {
    if (!source.text.includes(quote)) {
      throw new Error(`prose override ${path}: quote not in the DESIGN.md`);
    }
    applyProse(draft, path, value);
    provenance.fromProse(path, quote);
  }
  const tokens: DesignTokens = tokensSchema.parse(draft);

  for (const checked of ["light", "dark"] as const) {
    for (const result of checkContrast(tokens.modes[checked])) {
      if (!result.passes) {
        provenance.contrast({
          path: `modes.${checked}.${result.foreground}`,
          against: result.background,
          ratio: result.ratio,
          suggested: result.suggested,
          note: `${result.foreground} on ${result.background} is ${result.ratio}:1, under WCAG AA 4.5:1. The ${checked === mode ? "source" : "derived"} value is kept; ${result.suggested} would pass.`,
        });
      }
    }
  }

  const fonts = (["display", "body", "mono"] as const).map((role) => ({
    role,
    referenced: tokens.typography[role].family,
    fallback: tokens.typography[role].fallback,
    license: config.fonts[role].license,
    provider: config.fonts[role].provider,
  }));

  const meta: DesignMeta = metaSchema.parse({
    id: config.id,
    name: config.name,
    description: config.description,
    tags: config.tags,
    // Both modes count as documented when the other canvas and ink are stated.
    sourceMode:
      provenance.mapping[`modes.${other}.background`] &&
      provenance.mapping[`modes.${other}.foreground`]
        ? "both"
        : mode,
    source: {
      slug: config.slug,
      url: sourceUrl(config.slug),
      fetchedWith: `npx ${CLI} add ${config.slug}`,
      fetchedAt,
      license: LICENSE,
      disclaimer: disclaimer(config.name),
    },
    fonts,
    mapping: provenance.mapping,
    gaps: provenance.gaps,
  });

  const dir = join(ROOT, config.id);
  writeFileSync(
    join(dir, "tokens.json"),
    `${JSON.stringify(tokens, null, 2)}\n`,
  );
  writeFileSync(join(dir, "meta.json"), `${JSON.stringify(meta, null, 2)}\n`);
  writeFileSync(
    join(dir, "theme.css"),
    themeCss(tokens, { name: meta.name, disclaimer: meta.source.disclaimer }),
  );
  return { tokens, meta, mode };
}

const args = process.argv.slice(2);
const refetch = args.includes("--refetch");
const wanted = args.filter((arg) => !arg.startsWith("--"));
const selected = wanted.length
  ? SYSTEMS.filter((s) => wanted.includes(s.id) || wanted.includes(s.slug))
  : SYSTEMS;

let failed = false;
for (const config of selected) {
  try {
    const { tokens, meta, mode } = build(config, refetch);
    const light = tokens.modes.light;
    const dark = tokens.modes.dark;
    const contrastGaps = meta.gaps.filter((gap) => gap.kind === "contrast");
    console.log(
      [
        config.id.padEnd(11),
        mode.padEnd(5),
        `L bg ${light.background} fg ${light.foreground} pri ${light.primary}/${light["primary-foreground"]}`,
        `D bg ${dark.background} fg ${dark.foreground} pri ${dark.primary}/${dark["primary-foreground"]}`,
        `r ${tokens.radius.sm}/${tokens.radius.md}/${tokens.radius.lg} btn ${tokens.components.button.radius} ${tokens.components.button.height.md}px`,
        `gaps ${meta.gaps.length} (contrast ${contrastGaps.length})`,
      ].join(" | "),
    );
  } catch (error) {
    failed = true;
    console.error(`x ${config.id}: ${(error as Error).message}`);
  }
}
formatFiles(
  selected.flatMap((config) =>
    ["tokens.json", "meta.json", "theme.css"].map((file) =>
      join(ROOT, config.id, file),
    ),
  ),
);
process.exit(failed ? 1 : 0);
