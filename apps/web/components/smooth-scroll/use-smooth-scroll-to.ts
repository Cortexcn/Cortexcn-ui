"use client";

import { useLenis } from "lenis/react";
import { useCallback } from "react";

/**
 * Scrolls the page to a position or an element with the same easing as the
 * wheel. Falls back to native scrolling until Lenis has started.
 */
export function useSmoothScrollTo() {
  const lenis = useLenis();

  return useCallback(
    (target: number | HTMLElement) => {
      if (lenis) {
        lenis.scrollTo(target);
        return;
      }
      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches
        ? "instant"
        : "smooth";
      if (typeof target === "number") {
        window.scrollTo({ top: target, behavior });
      } else {
        target.scrollIntoView({ behavior, block: "start" });
      }
    },
    [lenis],
  );
}
