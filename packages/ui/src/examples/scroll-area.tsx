"use client";

// Examples adapted from the shadcn/ui Scroll Area docs (MIT, https://ui.shadcn.com).

import * as React from "react";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "../components/scroll-area";
import { Separator } from "../components/separator";

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

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`,
);

const works = [
  {
    artist: "Ornella Binni",
    art: "https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80",
  },
  {
    artist: "Tom Byrom",
    art: "https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80",
  },
  {
    artist: "Vladimir Malyav",
    art: "https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80",
  },
] as const;

export function ScrollAreaVertical() {
  return (
    <Example title="Vertical">
      <ScrollArea className="mx-auto h-72 w-48 overflow-hidden rounded-md style-luma:rounded-2xl style-lyra:rounded-none style-maia:rounded-2xl style-rhea:rounded-2xl style-sera:rounded-none border">
        <div className="p-4">
          <h4 className="mb-4 font-medium text-sm leading-none">Tags</h4>
          {tags.map((tag) => (
            <React.Fragment key={tag}>
              <div className="text-sm">{tag}</div>
              <Separator className="my-2" />
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
    </Example>
  );
}

export function ScrollAreaHorizontal() {
  return (
    <Example title="Horizontal">
      <ScrollArea className="mx-auto w-full max-w-96 overflow-hidden rounded-md style-luma:rounded-2xl style-lyra:rounded-none style-maia:rounded-2xl style-rhea:rounded-2xl style-sera:rounded-none border p-4 **:data-[slot=scroll-area-viewport]:rounded-md style-lyra:**:data-[slot=scroll-area-viewport]:rounded-none style-sera:**:data-[slot=scroll-area-viewport]:rounded-none">
        <div className="flex gap-4">
          {works.map((artwork) => (
            <figure className="shrink-0" key={artwork.artist}>
              <div className="overflow-hidden rounded-md style-lyra:rounded-none style-sera:rounded-none">
                <Image
                  alt={`Photo by ${artwork.artist}`}
                  className="aspect-3/4 h-fit w-fit object-cover"
                  height={400}
                  src={artwork.art}
                  width={300}
                />
              </div>
              <figcaption className="pt-2 text-muted-foreground text-xs">
                Photo by{" "}
                <span className="font-semibold text-foreground">
                  {artwork.artist}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Example>
  );
}
