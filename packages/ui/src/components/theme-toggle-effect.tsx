"use client";

import { flushSync } from "react-dom";

export const THEME_TOGGLE_EFFECTS = [
  "triangle",
  "triangle-blur",
  "circle",
  "circle-blur",
  "circle-blur-top-left",
  "polygon",
  "polygon-gradient",
] as const;

export type ThemeToggleEffect = (typeof THEME_TOGGLE_EFFECTS)[number];

/**
 * Set on `<html>` only while a theme switch runs, so the effect CSS never
 * touches other view transitions such as page navigations.
 */
const EFFECT_ATTRIBUTE = "data-theme-toggle-effect";

/**
 * Runs `update` (usually your theme setter) inside a View Transition that
 * reveals the new theme with the chosen effect. Browsers without View
 * Transitions, and users who prefer reduced motion, get an instant switch.
 */
export function startThemeTransition(
  update: () => void,
  effect: ThemeToggleEffect = "circle",
) {
  if (
    typeof document === "undefined" ||
    typeof document.startViewTransition !== "function" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    update();
    return;
  }

  const root = document.documentElement;
  root.setAttribute(EFFECT_ATTRIBUTE, effect);

  // flushSync commits the theme change inside the callback, so the browser
  // snapshots the new theme rather than the old one.
  const transition = document.startViewTransition(() => flushSync(update));
  transition.finished.finally(() => root.removeAttribute(EFFECT_ATTRIBUTE));
}
