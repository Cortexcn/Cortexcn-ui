import componentsMeta from "@/content/docs/components/meta.json";

/** Pages in the components docs sidebar, the same list "Browse components" opens. */
const COMPONENT_COUNT = componentsMeta.pages.filter(
  (page) => !page.startsWith("---"),
).length;

/** Rounded down to the ten, such as "80+", so the claim never runs ahead of the docs. */
export const COMPONENT_COUNT_LABEL = `${Math.floor(COMPONENT_COUNT / 10) * 10}+`;
