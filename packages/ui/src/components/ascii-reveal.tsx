"use client";

import {
  type AsciiRevealHandle,
  AsciiReveal as AsciiRevealPrimitive,
  type AsciiRevealProps,
  AsciiSkeleton as AsciiSkeletonPrimitive,
  type AsciiSkeletonProps,
} from "ascii-reveal";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Decodes the text, images, and canvases inside it into place through a
 * character grid: on mount, after `loading` turns false, and section by
 * section as the page scrolls. Glyphs take the theme's primary color.
 */
export const AsciiReveal = forwardRef<AsciiRevealHandle, AsciiRevealProps>(
  function AsciiReveal({ className, ...props }, ref) {
    return (
      <AsciiRevealPrimitive
        className={cn("[--ascii-accent:var(--primary)]", className)}
        ref={ref}
        {...props}
      />
    );
  },
);

/**
 * A placeholder drawn in glyphs, as plain markup that paints before any
 * JavaScript runs. In the muted text color, with the same corners as
 * Skeleton.
 */
export function AsciiSkeleton({ className, ...props }: AsciiSkeletonProps) {
  return (
    <AsciiSkeletonPrimitive
      className={cn(
        "[--ars-radius:var(--radius-md)] [--ascii-skeleton:var(--muted-foreground)]",
        className,
      )}
      {...props}
    />
  );
}

export type {
  AsciiRevealHandle,
  AsciiRevealProps,
  AsciiSkeletonProps,
} from "ascii-reveal";
