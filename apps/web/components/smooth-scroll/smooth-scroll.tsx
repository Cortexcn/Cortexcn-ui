"use client";

import "lenis/dist/lenis.css";

import type { LenisOptions } from "lenis";
import { ReactLenis } from "lenis/react";

/**
 * Dialogs and sheets lock the page with react-remove-scroll, which marks the
 * body and cancels wheel events outside the dialog. Lenis leaves those alone,
 * so the page behind an open dialog stays put.
 */
function isPageLocked(event: WheelEvent | TouchEvent) {
  return (
    event.defaultPrevented || document.body.hasAttribute("data-scroll-locked")
  );
}

const OPTIONS: LenisOptions = {
  // Same-page links glide to their target and stop at its scroll-margin.
  anchors: true,
  // Sidebars, code blocks, and dialog lists keep their own native scrolling.
  allowNestedScroll: true,
  // A click through to another page ends the glide, so it opens at the top.
  stopInertiaOnNavigate: true,
  virtualScroll: ({ event }) => !isPageLocked(event),
};

/**
 * Smooths wheel scrolling across the site. Touch keeps its native momentum, and
 * Lenis turns the smoothing off for people who prefer reduced motion.
 */
export function SmoothScroll() {
  return <ReactLenis options={OPTIONS} root />;
}
