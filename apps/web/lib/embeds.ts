import { COMPONENT_GROUPS } from "@/lib/component-families";

/*
 * Components that other sites can embed as a live demo at /embed/<slug>,
 * such as the Components section of syedmoinuddin.com. The page frames only
 * on the hosts in EMBED_FRAME_ANCESTORS (see next.config.mjs).
 */

/** Every chart, each previewed by its featured example from the gallery. */
export const EMBED_CHART_SLUGS: ReadonlySet<string> = new Set(
  COMPONENT_GROUPS.find((group) => group.category === "charts")?.slugs ?? [],
);

/** Components previewed by their docs demo. */
export const EMBED_DEMO_SLUGS = [
  "accordion",
  "card",
  "line-nav",
  "logos-carousel",
  "marquee",
  "perspective-marquee",
  "theme-toggle-effect",
  "work-experience",
] as const;

export type EmbedDemoSlug = (typeof EMBED_DEMO_SLUGS)[number];

/**
 * Chart loading states, each previewed by its example from the chart's
 * gallery, found by title.
 */
export const EMBED_CHART_LOADING: ReadonlyMap<
  string,
  { chart: string; example: string }
> = new Map([
  [
    "area-chart-loading",
    { chart: "area-chart", example: "Area Chart - Loading" },
  ],
  ["bar-chart-loading", { chart: "bar-chart", example: "Bar Chart - Loading" }],
  [
    "line-chart-loading",
    { chart: "line-chart", example: "Line Chart - Loading (Sweep)" },
  ],
  [
    "heatmap-chart-loading",
    { chart: "heatmap-chart", example: "Heatmap Chart - Loading" },
  ],
]);

export const EMBED_SLUGS: string[] = [
  ...EMBED_CHART_SLUGS,
  ...EMBED_DEMO_SLUGS,
  ...EMBED_CHART_LOADING.keys(),
];

export function isEmbedSlug(slug: string) {
  return EMBED_SLUGS.includes(slug);
}

/**
 * Sets the theme from `?theme=dark|light` before paint and remembers it, so
 * the theme provider agrees once it hydrates. The parent page passes its own
 * theme, so the demo matches it.
 */
export const EMBED_THEME_SCRIPT = `
(function () {
  try {
    var theme = new URLSearchParams(window.location.search).get("theme");
    if (theme !== "dark" && theme !== "light") {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    localStorage.setItem("theme", theme);
    var root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  } catch (e) {}
})();
`.trim();
