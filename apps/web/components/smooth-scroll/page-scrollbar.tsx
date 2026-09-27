"use client";

import type Lenis from "lenis";
import { useLenis } from "lenis/react";
import { useEffect, useRef } from "react";

/** How long the bar stays after the last scroll, hover, or drag. */
const HIDE_DELAY_MS = 2000;
const MIN_THUMB_PX = 40;
/** Space kept clear above and below the thumb. */
const TRACK_INSET_PX = 4;
/** Where the page is sampled for the thumb color, in from the right edge. */
const SAMPLE_INSET_PX = 5;
/** Backgrounds below this luminance count as dark and get a light thumb. */
const DARK_LUMINANCE = 0.2;

type Rgba = [number, number, number, number];

const colorCache = new Map<string, Rgba | null>();
let colorContext: CanvasRenderingContext2D | null | undefined;

/**
 * Turns any color the browser can compute (hex, rgb, oklch, color-mix) into
 * sRGB bytes by painting it into a 1px canvas.
 */
function toRgba(color: string): Rgba | null {
  const cached = colorCache.get(color);
  if (cached !== undefined) {
    return cached;
  }
  if (colorContext === undefined) {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    colorContext = canvas.getContext("2d", { willReadFrequently: true });
  }
  let rgba: Rgba | null = null;
  if (colorContext) {
    colorContext.clearRect(0, 0, 1, 1);
    colorContext.fillStyle = "transparent";
    colorContext.fillStyle = color;
    colorContext.fillRect(0, 0, 1, 1);
    const [r = 0, g = 0, b = 0, a = 0] = colorContext.getImageData(
      0,
      0,
      1,
      1,
    ).data;
    rgba = [r, g, b, a / 255];
  }
  colorCache.set(color, rgba);
  return rgba;
}

function linearChannel(value: number) {
  const channel = value / 255;
  return channel <= 0.04 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function luminance([r, g, b]: Rgba) {
  return (
    0.2126 * linearChannel(r) +
    0.7152 * linearChannel(g) +
    0.0722 * linearChannel(b)
  );
}

/** The top-most mostly opaque background at a point, skipping the scrollbar itself. */
function backgroundAt(x: number, y: number, scrollbar: Element) {
  for (const element of document.elementsFromPoint(x, y)) {
    if (scrollbar.contains(element)) {
      continue;
    }
    const rgba = toRgba(getComputedStyle(element).backgroundColor);
    if (rgba && rgba[3] >= 0.5) {
      return rgba;
    }
  }
  return toRgba(getComputedStyle(document.body).backgroundColor);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/**
 * The page scrollbar. The native one is hidden (see globals.css) so this one
 * can fade in while the page moves, fade out 2 seconds after it stops, and
 * take its color from the section behind it: light on dark bands, dark on light
 * ones, tinted by whatever color is there. Drag the thumb or click the track
 * with a mouse; on touch screens it only shows where you are.
 */
export function PageScrollbar() {
  const rootRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const lenisRef = useRef<Lenis | undefined>(undefined);

  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  useEffect(() => {
    const root = rootRef.current;
    const thumb = thumbRef.current;
    if (!(root && thumb)) {
      return;
    }

    let frame = 0;
    let hideTimer = 0;
    let maxScroll = 0;
    let thumbSize = 0;
    let travel = 0;
    let hovering = false;
    let lastUnder = "";
    let drag: {
      pointerId: number;
      startY: number;
      startScroll: number;
    } | null = null;

    const measure = () => {
      const viewport = window.innerHeight;
      const content = document.documentElement.scrollHeight;
      const track = viewport - TRACK_INSET_PX * 2;
      maxScroll = Math.max(0, content - viewport);
      thumbSize =
        maxScroll > 0
          ? clamp((viewport / content) * track, MIN_THUMB_PX, track)
          : 0;
      travel = track - thumbSize;
      root.dataset.scrollable = String(maxScroll > 1);
      thumb.style.height = `${thumbSize}px`;
    };

    const sampleColor = (y: number) => {
      const rgba = backgroundAt(window.innerWidth - SAMPLE_INSET_PX, y, root);
      if (!rgba) {
        return;
      }
      const under = `rgb(${rgba[0]} ${rgba[1]} ${rgba[2]})`;
      if (under === lastUnder) {
        return;
      }
      lastUnder = under;
      root.style.setProperty("--scrollbar-under", under);
      root.dataset.tone = luminance(rgba) < DARK_LUMINANCE ? "dark" : "light";
    };

    const render = () => {
      frame = 0;
      const scroll = clamp(window.scrollY, 0, maxScroll);
      const y =
        TRACK_INSET_PX + (maxScroll > 0 ? (scroll / maxScroll) * travel : 0);
      thumb.style.transform = `translate3d(0, ${y}px, 0)`;
      if (root.dataset.visible === "true") {
        sampleColor(y + thumbSize / 2);
      }
    };

    const schedule = () => {
      if (!frame) {
        frame = requestAnimationFrame(render);
      }
    };

    const setActive = () => {
      root.dataset.active = String(hovering || drag !== null);
    };

    const hideIfIdle = () => {
      if (!(hovering || drag)) {
        root.dataset.visible = "false";
      }
    };

    const show = () => {
      root.dataset.visible = "true";
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(hideIfIdle, HIDE_DELAY_MS);
      schedule();
    };

    const scrollPageTo = (top: number, smooth: boolean) => {
      const instance = lenisRef.current;
      if (instance) {
        instance.scrollTo(top, smooth ? {} : { immediate: true });
      } else {
        window.scrollTo({ top, behavior: smooth ? "smooth" : "instant" });
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      // Touch keeps its native swipe; the bar is only an indicator there.
      if (event.pointerType === "touch" || event.button !== 0) {
        return;
      }
      event.preventDefault();
      measure();
      let startScroll = window.scrollY;
      if (!thumb.contains(event.target as Node)) {
        // A click on the track brings the thumb's middle to the pointer.
        const offset = event.clientY - TRACK_INSET_PX - thumbSize / 2;
        startScroll = clamp(
          travel > 0 ? (offset / travel) * maxScroll : 0,
          0,
          maxScroll,
        );
        scrollPageTo(startScroll, true);
      }
      drag = { pointerId: event.pointerId, startY: event.clientY, startScroll };
      root.setPointerCapture(event.pointerId);
      root.dataset.dragging = "true";
      setActive();
      show();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!(drag && event.pointerId === drag.pointerId && travel > 0)) {
        return;
      }
      const moved = event.clientY - drag.startY;
      scrollPageTo(
        clamp(drag.startScroll + (moved / travel) * maxScroll, 0, maxScroll),
        false,
      );
    };

    const onPointerEnd = (event: PointerEvent) => {
      if (!(drag && event.pointerId === drag.pointerId)) {
        return;
      }
      drag = null;
      root.dataset.dragging = "false";
      setActive();
      show();
    };

    const onPointerEnter = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        return;
      }
      hovering = true;
      setActive();
      show();
    };

    const onPointerLeave = () => {
      hovering = false;
      setActive();
      show();
    };

    const onResize = () => {
      measure();
      schedule();
    };

    // An open dialog locks the page, so there is nothing to scroll.
    const syncLock = () => {
      root.dataset.locked = String(
        document.body.hasAttribute("data-scroll-locked"),
      );
    };

    // A theme switch changes every background, so sample again.
    const onThemeChange = () => {
      lastUnder = "";
      schedule();
    };

    measure();
    render();
    syncLock();

    window.addEventListener("scroll", show, { passive: true });
    window.addEventListener("resize", onResize);
    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerup", onPointerEnd);
    root.addEventListener("pointercancel", onPointerEnd);
    root.addEventListener("pointerenter", onPointerEnter);
    root.addEventListener("pointerleave", onPointerLeave);

    const contentObserver = new ResizeObserver(onResize);
    contentObserver.observe(document.body);
    const lockObserver = new MutationObserver(syncLock);
    lockObserver.observe(document.body, {
      attributeFilter: ["data-scroll-locked"],
    });
    const themeObserver = new MutationObserver(onThemeChange);
    themeObserver.observe(document.documentElement, {
      attributeFilter: ["class", "style"],
    });

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(hideTimer);
      window.removeEventListener("scroll", show);
      window.removeEventListener("resize", onResize);
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerup", onPointerEnd);
      root.removeEventListener("pointercancel", onPointerEnd);
      root.removeEventListener("pointerenter", onPointerEnter);
      root.removeEventListener("pointerleave", onPointerLeave);
      contentObserver.disconnect();
      lockObserver.disconnect();
      themeObserver.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="page-scrollbar group/scrollbar pointer-coarse:pointer-events-none fixed inset-y-0 right-0 z-60 w-3 select-none opacity-0 transition-opacity duration-300 data-[locked=true]:hidden data-[scrollable=false]:hidden data-[dragging=true]:cursor-grabbing data-[visible=true]:opacity-100 print:hidden"
      data-active="false"
      data-dragging="false"
      data-locked="false"
      data-scrollable="false"
      data-tone="light"
      data-visible="false"
      ref={rootRef}
    >
      <div
        className="absolute top-0 right-0 flex w-full cursor-grab justify-end pr-0.5 will-change-transform group-data-[dragging=true]/scrollbar:cursor-grabbing"
        ref={thumbRef}
      >
        <div className="h-full w-1 bg-(--scrollbar-thumb) opacity-(--scrollbar-thumb-opacity) transition-[width,background-color,opacity] duration-300 group-data-[active=true]/scrollbar:w-1.5" />
      </div>
    </div>
  );
}
