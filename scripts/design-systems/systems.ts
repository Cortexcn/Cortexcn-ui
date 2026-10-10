/**
 * The systems ingest.ts builds, and the choices a DESIGN.md leaves open:
 * which open-licensed font stands in for a proprietary one, how the look is
 * tagged and described, and, where the default heuristics pick the wrong
 * source token, which one a role reads from.
 */
import type { ColorRole } from "../../design-systems/_schema/tokens";

export type Category = "sans" | "serif" | "mono";

export interface FontPick {
  /** The open-licensed family to use. */
  family: string;
  category: Category;
  license: string;
  provider: "google-fonts" | "next-font-geist";
}

const font = (
  family: string,
  category: Category = "sans",
  license = "OFL-1.1",
): FontPick => ({
  family,
  category,
  license,
  provider: family.startsWith("Geist") ? "next-font-geist" : "google-fonts",
});

const INTER = font("Inter");
const JETBRAINS = font("JetBrains Mono", "mono");

export interface SystemConfig {
  slug: string;
  id: string;
  name: string;
  /** One line about the look, in our words. */
  description: string;
  tags: string[];
  fonts: { display: FontPick; body: FontPick; mono: FontPick };
  /** Which mode the DESIGN.md documents, when its canvas alone misleads. */
  sourceMode?: "light" | "dark";
  /** Source color keys for roles in the documented mode, overriding the heuristics. */
  colors?: Partial<Record<ColorRole, string>>;
  /** Source color keys that describe the other mode (inverse or dark tokens). */
  otherMode?: Partial<Record<ColorRole, string>>;
  /** Source rounded keys for scale steps the DESIGN.md names differently. */
  radius?: Partial<Record<"xs" | "sm" | "md" | "lg" | "xl", string>>;
  /** Source typography keys, overriding the heuristics. */
  typography?: Partial<Record<"display" | "body" | "button" | "mono", string>>;
  /** Source component keys, overriding the heuristics. */
  components?: Partial<
    Record<
      "button" | "input" | "card" | "badge" | "tabs" | "accordion" | "dialog",
      string
    >
  >;
  /**
   * Values the front matter leaves out but the DESIGN.md's prose states,
   * each with the sentence it comes from.
   */
  prose?: { path: string; value: string | number | boolean; quote: string }[];
}

export const SYSTEMS: SystemConfig[] = [
  {
    slug: "linear.app",
    id: "linear",
    name: "Linear",
    description:
      "Near-black canvas, hairline borders, a four-step charcoal surface ladder, and one lavender accent.",
    tags: ["dark-first", "dense", "developer", "minimal"],
    fonts: { display: INTER, body: INTER, mono: JETBRAINS },
    prose: [
      {
        path: "components.card.border",
        value: true,
        quote: "Cards live as charcoal panels (#0f1011) with hairline borders",
      },
    ],
  },
  {
    slug: "raycast",
    id: "raycast",
    name: "Raycast",
    description:
      "Dark launcher chrome with soft-cornered cards, crisp white type, and a red primary.",
    tags: ["dark-first", "developer", "dense", "colorful"],
    fonts: { display: INTER, body: INTER, mono: JETBRAINS },
  },
  {
    slug: "resend",
    id: "resend",
    name: "Resend",
    description:
      "Pure black with translucent hairlines, a serif display face, and monospace details.",
    tags: ["dark-first", "developer", "minimal", "serif", "mono"],
    fonts: {
      display: font("Instrument Serif", "serif"),
      body: INTER,
      mono: font("Geist Mono", "mono"),
    },
  },
  {
    slug: "hashicorp",
    id: "hashicorp",
    name: "HashiCorp",
    description:
      "Black enterprise canvas with charcoal panels, white type, and product-color accents.",
    tags: ["dark-first", "enterprise", "developer", "monochrome"],
    fonts: { display: INTER, body: INTER, mono: JETBRAINS },
  },
  {
    slug: "clickhouse",
    id: "clickhouse",
    name: "ClickHouse",
    description:
      "Technical dark surfaces with a bright yellow primary and dense documentation type.",
    tags: ["dark-first", "dense", "developer", "enterprise"],
    fonts: { display: INTER, body: INTER, mono: JETBRAINS },
  },
  {
    slug: "framer",
    id: "framer",
    name: "Framer",
    description:
      "Near-black canvas, white pill buttons, a bright blue accent, and tight display type.",
    tags: ["dark-first", "minimal", "rounded"],
    fonts: { display: font("Mona Sans"), body: INTER, mono: JETBRAINS },
  },
  {
    slug: "sanity",
    id: "sanity",
    name: "Sanity",
    description:
      "Dark editorial canvas with a red-orange brand accent and monospace eyebrows.",
    tags: ["dark-first", "editorial", "enterprise", "mono"],
    fonts: {
      display: INTER,
      body: INTER,
      mono: font("IBM Plex Mono", "mono"),
    },
    // "ink" is the text color of the light sections; white is the dark ink.
    colors: {
      foreground: "on-primary",
      "muted-foreground": "ash",
      card: "canvas-soft",
      popover: "canvas-soft",
      border: "hairline-soft",
      input: "hairline-soft",
    },
    otherMode: {
      background: "canvas-light",
      foreground: "ink",
      muted: "canvas-paper",
      "muted-foreground": "slate",
      border: "hairline",
      primary: "primary",
      "primary-foreground": "on-primary",
    },
    radius: {
      xs: "app-xs",
      sm: "app-sm",
      md: "app-md",
      lg: "app-lg",
      xl: "marketing",
    },
  },
  {
    slug: "warp",
    id: "warp",
    name: "Warp",
    description:
      "Warm brown-black terminal canvas, small corners, and a muted, IDE-like palette.",
    tags: ["dark-first", "developer", "warm", "sharp"],
    fonts: { display: INTER, body: INTER, mono: font("DM Mono", "mono") },
  },
  {
    slug: "discord",
    id: "discord",
    name: "Discord",
    description:
      "Deep indigo canvas, blurple primary, generous corners, and heavy wide display type.",
    tags: ["dark-first", "playful", "rounded", "colorful"],
    fonts: {
      display: font("Unbounded"),
      body: font("Figtree"),
      mono: JETBRAINS,
    },
    // "muted" is gray text for the light sections; "-" leaves a role to be derived.
    colors: {
      card: "surface-indigo",
      popover: "surface-indigo",
      "muted-foreground": "-",
    },
    otherMode: { foreground: "ink-dark", "muted-foreground": "muted" },
  },
  {
    slug: "sentry",
    id: "sentry",
    name: "Sentry",
    description:
      "Dark violet dashboard surfaces, a purple primary, and chunky display type.",
    tags: ["dark-first", "developer", "dense", "colorful"],
    fonts: {
      display: font("Space Grotesk"),
      body: font("Rubik"),
      mono: font("Ubuntu Mono", "mono", "UFL-1.0"),
    },
    // Two documented canvases: violet midnight and white. On dark, the
    // white button-inverted is the primary; on white, the near-black one.
    sourceMode: "dark",
    colors: {
      background: "surface-canvas-dark",
      foreground: "on-primary",
      card: "surface-night",
      popover: "surface-night",
      "muted-foreground": "on-dark-muted",
      border: "hairline-violet",
      input: "hairline-violet",
      primary: "on-primary",
      "primary-foreground": "ink-deep",
    },
    otherMode: {
      background: "surface-canvas-light",
      foreground: "ink",
      muted: "surface-press-light",
      border: "hairline-cloud",
      primary: "primary",
      "primary-foreground": "on-primary",
    },
    prose: [
      {
        path: "components.button.textTransform",
        value: "uppercase",
        quote: "Buttons and eyebrows almost always run in uppercase",
      },
    ],
  },
  {
    slug: "vercel",
    id: "vercel",
    name: "Vercel",
    description:
      "Black and white precision: Geist type, hairline borders, and almost no color.",
    tags: ["light-first", "developer", "minimal", "monochrome"],
    fonts: {
      display: font("Geist"),
      body: font("Geist"),
      mono: font("Geist Mono", "mono"),
    },
  },
  {
    slug: "stripe",
    id: "stripe",
    name: "Stripe",
    description:
      "Airy white canvas, light-weight display type, deep navy ink, and an indigo primary.",
    tags: ["light-first", "airy", "enterprise"],
    fonts: { display: INTER, body: INTER, mono: JETBRAINS },
  },
  {
    slug: "notion",
    id: "notion",
    name: "Notion",
    description:
      "Warm, quiet white surfaces, soft gray text, and a single blue action color.",
    tags: ["light-first", "warm", "minimal", "airy"],
    fonts: { display: INTER, body: INTER, mono: JETBRAINS },
  },
  {
    slug: "claude",
    id: "claude",
    name: "Claude",
    description:
      "Cream paper canvas, a terracotta primary, and serif display type over a humanist sans.",
    tags: ["light-first", "warm", "editorial", "serif"],
    fonts: {
      display: font("Cormorant Garamond", "serif"),
      body: INTER,
      mono: JETBRAINS,
    },
  },
  {
    slug: "wired",
    id: "wired",
    name: "Wired",
    description:
      "Broadsheet black on white, square corners, a high-contrast serif display, and ink-blue links.",
    tags: ["light-first", "editorial", "sharp", "serif", "monochrome"],
    fonts: {
      display: font("Playfair Display", "serif"),
      body: INTER,
      mono: JETBRAINS,
    },
  },
  {
    slug: "ibm",
    id: "ibm",
    name: "IBM",
    description:
      "Carbon-style enterprise grid: Plex type, square-ish corners, gray layers, and IBM blue.",
    tags: ["light-first", "enterprise", "dense", "sharp"],
    fonts: {
      display: font("IBM Plex Sans"),
      body: font("IBM Plex Sans"),
      mono: font("IBM Plex Mono", "mono"),
    },
  },
  {
    slug: "airbnb",
    id: "airbnb",
    name: "Airbnb",
    description:
      "Friendly white marketplace with a coral primary, rounded cards, and pill controls.",
    tags: ["light-first", "consumer", "rounded", "airy"],
    fonts: { display: INTER, body: INTER, mono: JETBRAINS },
  },
  {
    slug: "wise",
    id: "wise",
    name: "Wise",
    description:
      "Bright lime-green primary on white, heavy display type, and generous rounded corners.",
    tags: ["light-first", "consumer", "rounded", "colorful"],
    fonts: { display: font("Manrope"), body: INTER, mono: JETBRAINS },
  },
  {
    slug: "nike",
    id: "nike",
    name: "Nike",
    description:
      "Monochrome retail: black pills on white, condensed uppercase display, very round corners.",
    tags: ["light-first", "consumer", "pill", "monochrome"],
    fonts: { display: font("Bebas Neue"), body: INTER, mono: JETBRAINS },
  },
  {
    slug: "figma",
    id: "figma",
    name: "Figma",
    description:
      "Black and white base with saturated color blocks and playful, confident type.",
    tags: ["light-first", "playful", "colorful"],
    fonts: { display: INTER, body: INTER, mono: JETBRAINS },
  },
  {
    slug: "zapier",
    id: "zapier",
    name: "Zapier",
    description:
      "Warm off-white canvas, an orange primary, and soft dark-brown ink.",
    tags: ["light-first", "warm", "playful"],
    fonts: { display: font("Mona Sans"), body: INTER, mono: JETBRAINS },
  },
  {
    slug: "mintlify",
    id: "mintlify",
    name: "Mintlify",
    description:
      "Reading-first docs: white canvas, a green brand accent, and calm gray text.",
    tags: ["light-first", "developer", "airy"],
    fonts: { display: INTER, body: INTER, mono: font("Geist Mono", "mono") },
    colors: { "muted-foreground": "steel" },
  },
  {
    slug: "mongodb",
    id: "mongodb",
    name: "MongoDB",
    description:
      "Developer-docs white with a leaf-green primary and a deep teal dark mode.",
    tags: ["light-first", "developer", "enterprise"],
    fonts: {
      display: font("Outfit"),
      body: font("Outfit"),
      mono: font("Source Code Pro", "mono"),
    },
    colors: { "muted-foreground": "steel" },
  },
  {
    slug: "posthog",
    id: "posthog",
    name: "PostHog",
    description:
      "Sage paper canvas, dense Plex type, and a bright orange-yellow primary.",
    tags: ["light-first", "playful", "dense", "warm"],
    fonts: {
      display: font("IBM Plex Sans"),
      body: font("IBM Plex Sans"),
      mono: font("Source Code Pro", "mono"),
    },
    typography: { mono: "code-xs" },
  },
  {
    slug: "uber",
    id: "uber",
    name: "Uber",
    description:
      "Stark black and white, tight bold type, pill buttons, and soft gray fills.",
    tags: ["light-first", "monochrome", "consumer", "pill"],
    fonts: { display: INTER, body: INTER, mono: JETBRAINS },
  },
];
