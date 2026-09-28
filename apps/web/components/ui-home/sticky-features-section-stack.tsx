"use client";

import { type ReactNode, type RefObject, useEffect, useRef } from "react";

/** How much a card shrinks for each card stacked over it. */
const SHRINK_PER_LEVEL = 0.04;

/** Where the cards stick. It matches the sticky classes in sticky-features-section.tsx. */
const STACK_QUERY = "(min-width: 48rem) and (min-height: 36rem)";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

function listItems(list: HTMLUListElement) {
  return Array.from(list.children).filter(
    (child): child is HTMLElement => child instanceof HTMLElement,
  );
}

/**
 * While a card slides over the one before it, the covered card shrinks a
 * little toward its top edge, so the stack reads as a deck. Only where the
 * cards stick, and never with reduced motion.
 */
function useDeckScale(listRef: RefObject<HTMLUListElement | null>) {
  useEffect(() => {
    const list = listRef.current;
    if (!list) {
      return;
    }

    const stacked = window.matchMedia(STACK_QUERY);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cards = listItems(list);
    let frame = 0;

    const paint = () => {
      frame = 0;
      // Positions come from the top edges, which the scale never moves, and
      // heights from layout, which ignores transforms.
      const covered = cards.map((card, index) => {
        const next = cards[index + 1];
        if (!next) {
          return 0;
        }
        const top = card.getBoundingClientRect().top;
        const height = card.offsetHeight;
        return clamp01(
          (top + height - next.getBoundingClientRect().top) / height,
        );
      });

      let depth = 0;
      for (let index = cards.length - 1; index >= 0; index -= 1) {
        depth += covered[index] ?? 0;
        const card = cards[index];
        if (card) {
          card.style.transform =
            depth > 0 ? `scale(${1 - depth * SHRINK_PER_LEVEL})` : "";
        }
      }
    };

    const schedule = () => {
      if (!frame) {
        frame = requestAnimationFrame(paint);
      }
    };

    const stop = () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
      frame = 0;
      for (const card of cards) {
        card.style.transform = "";
        card.style.willChange = "";
      }
    };

    const sync = () => {
      stop();
      if (!stacked.matches || reduced.matches) {
        return;
      }
      for (const card of cards) {
        card.style.willChange = "transform";
      }
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
      schedule();
    };

    sync();
    stacked.addEventListener("change", sync);
    reduced.addEventListener("change", sync);

    return () => {
      stacked.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
      stop();
    };
  }, [listRef]);
}

/**
 * A card that a later card slid over still counts as on screen, so the
 * browser does not scroll when keyboard focus moves into it (Shift+Tab, for
 * one). Scroll back to where that card sits uncovered instead.
 */
function useUncoverFocusedCard(listRef: RefObject<HTMLUListElement | null>) {
  useEffect(() => {
    const list = listRef.current;
    if (!list) {
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onFocusIn = (event: FocusEvent) => {
      const target = event.target;
      // Keyboard focus only: a click lands on something already in sight,
      // and the page should not move under the pointer.
      if (!(target instanceof Element && target.matches(":focus-visible"))) {
        return;
      }
      const cards = listItems(list);
      const index = cards.findIndex((card) => card.contains(target));
      const card = cards[index];
      const next = cards[index + 1];
      if (!(card && next) || getComputedStyle(card).position !== "sticky") {
        return;
      }
      if (
        target.getBoundingClientRect().bottom <=
        next.getBoundingClientRect().top
      ) {
        return;
      }

      // Where the card sits in the list before sticking, from layout sizes.
      const gap = Number.parseFloat(getComputedStyle(list).rowGap) || 0;
      let naturalTop = list.getBoundingClientRect().top + window.scrollY;
      for (const earlier of cards.slice(0, index)) {
        naturalTop += earlier.offsetHeight + gap;
      }
      const stickyTop = Number.parseFloat(getComputedStyle(card).top) || 0;

      window.scrollTo({
        top: naturalTop - stickyTop,
        behavior: reduced.matches ? "instant" : "smooth",
      });
    };

    list.addEventListener("focusin", onFocusIn);
    return () => list.removeEventListener("focusin", onFocusIn);
  }, [listRef]);
}

/** The list behind the sticky cards. */
export function StackList({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  useDeckScale(listRef);
  useUncoverFocusedCard(listRef);

  return (
    <ul className={className} ref={listRef}>
      {children}
    </ul>
  );
}
