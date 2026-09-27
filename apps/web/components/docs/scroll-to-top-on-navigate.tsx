"use client";

import type Lenis from "lenis";
import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** The element a `#hash` in the address points at, if the page has one. */
function hashTarget() {
  const { hash } = window.location;
  if (hash.length < 2) {
    return null;
  }
  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    // A malformed escape in the hash; treat it as no target.
    return null;
  }
}

/**
 * Opens every page at the top, or at its `#hash` target when the link has one.
 * Jumps through Lenis when it runs, so a glide still going on the old page
 * cannot carry over to the new one.
 */
export function ScrollToTopOnNavigate() {
  const pathname = usePathname();
  const lenis = useLenis();
  const lenisRef = useRef<Lenis | undefined>(undefined);

  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname triggers scroll reset on navigation
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const target = hashTarget();
    const instance = lenisRef.current;
    if (instance) {
      // The new page has a new height; measure it before jumping.
      instance.resize();
      instance.scrollTo(target ?? 0, { immediate: true, force: true });
    } else if (target) {
      target.scrollIntoView({ block: "start", behavior: "instant" });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    // pathname is the navigation trigger — not read in the effect body
  }, [pathname]);

  return null;
}
