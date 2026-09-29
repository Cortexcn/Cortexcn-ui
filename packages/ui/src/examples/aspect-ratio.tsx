"use client";

// Examples adapted from the shadcn/ui Aspect Ratio docs (MIT, https://ui.shadcn.com).

import type * as React from "react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "../components/aspect-ratio";

/** Stands in for the shadcn docs frame; the docs page draws its own. */
function Example({
  className,
  children,
}: React.ComponentProps<"div"> & {
  title?: string;
  containerClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col items-start gap-6 *:[div:not([class*='w-'])]:w-full",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Plain <img> for the live preview, so remote avatars and photos need no
 * next/image host config here. The copied code keeps next/image.
 */
function Image({
  fill,
  className,
  alt,
  ...props
}: React.ComponentProps<"img"> & { fill?: boolean }) {
  return (
    // biome-ignore lint/performance/noImgElement: live preview stand-in for next/image
    <img
      alt={alt}
      className={cn(fill && "absolute inset-0 size-full", className)}
      {...props}
    />
  );
}

export function AspectRatio16x9() {
  return (
    <Example className="items-center justify-center" title="16:9">
      <AspectRatio
        className="rounded-lg style-luma:rounded-3xl style-lyra:rounded-none style-sera:rounded-none bg-muted"
        ratio={16 / 9}
      >
        <Image
          alt="Photo"
          className="h-full w-full rounded-lg style-luma:rounded-3xl style-lyra:rounded-none style-sera:rounded-none object-cover grayscale dark:brightness-20"
          fill
          src="https://avatar.vercel.sh/shadcn1"
        />
      </AspectRatio>
    </Example>
  );
}

export function AspectRatio1x1() {
  return (
    <Example className="items-start" title="1:1">
      <AspectRatio
        className="rounded-lg style-luma:rounded-3xl style-lyra:rounded-none style-sera:rounded-none bg-muted"
        ratio={1 / 1}
      >
        <Image
          alt="Photo"
          className="h-full w-full rounded-lg style-luma:rounded-3xl style-lyra:rounded-none style-sera:rounded-none object-cover grayscale dark:brightness-20"
          fill
          src="https://avatar.vercel.sh/shadcn1"
        />
      </AspectRatio>
    </Example>
  );
}

export function AspectRatio9x16() {
  return (
    <Example className="items-center justify-center" title="9:16">
      <AspectRatio
        className="rounded-lg style-luma:rounded-3xl style-lyra:rounded-none style-sera:rounded-none bg-muted"
        ratio={9 / 16}
      >
        <Image
          alt="Photo"
          className="h-full w-full rounded-lg style-luma:rounded-3xl style-lyra:rounded-none style-sera:rounded-none object-cover grayscale dark:brightness-20"
          fill
          src="https://avatar.vercel.sh/shadcn1"
        />
      </AspectRatio>
    </Example>
  );
}

export function AspectRatio21x9() {
  return (
    <Example className="items-center justify-center" title="21:9">
      <AspectRatio
        className="rounded-lg style-luma:rounded-3xl style-lyra:rounded-none style-sera:rounded-none bg-muted"
        ratio={21 / 9}
      >
        <Image
          alt="Photo"
          className="h-full w-full rounded-lg style-luma:rounded-3xl style-lyra:rounded-none style-sera:rounded-none object-cover grayscale dark:brightness-20"
          fill
          src="https://avatar.vercel.sh/shadcn1"
        />
      </AspectRatio>
    </Example>
  );
}
