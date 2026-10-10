import { COMPONENT_GROUPS } from "@/lib/component-families";

/** Pages in the component sidebars: Components, Cortex, Backgrounds, and Charts. */
const COMPONENT_COUNT = COMPONENT_GROUPS.reduce(
  (count, group) => count + group.slugs.length,
  0,
);

/** Rounded down to the ten, such as "80+", so the claim never runs ahead of the docs. */
export const COMPONENT_COUNT_LABEL = `${Math.floor(COMPONENT_COUNT / 10) * 10}+`;
