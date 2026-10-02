"use client";

import { Icon } from "@bklitui/icons";
import Link from "next/link";
import type { BlockSlug } from "@/blocks/manifest";
import { BLOCK_PREVIEWS } from "@/blocks/previews";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

/**
 * One block, full screen, with a floating bar that leads back to its page,
 * switches the theme, and opens its code.
 */
export function BlockLivePreview({
  slug,
  title,
  pageHref,
}: {
  slug: BlockSlug;
  title: string;
  pageHref: string;
}) {
  const Preview = BLOCK_PREVIEWS[slug];

  return (
    <div className="relative flex min-h-svh w-full flex-col bg-background">
      <main className="flex flex-1 items-center justify-center px-4 pt-10 pb-32">
        <Preview />
      </main>

      <div className="fixed bottom-6 left-1/2 z-50 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-1 rounded-full border border-border bg-background/90 p-1.5 shadow-lg backdrop-blur-sm">
        <Button
          className="gap-1.5 rounded-full px-3"
          nativeButton={false}
          render={<Link href={pageHref} />}
          size="sm"
          variant="ghost"
        >
          <Icon className="size-4" name="IconArrowLeft" />
          Blocks
        </Button>
        <span aria-hidden="true" className="h-5 w-px bg-border" />
        <span className="min-w-0 truncate px-3 font-medium text-sm">
          {title}
        </span>
        <span aria-hidden="true" className="h-5 w-px bg-border" />
        <ModeToggle />
        <Button
          className="gap-1.5 rounded-full px-3.5"
          nativeButton={false}
          render={<Link href={`${pageHref}#code`} />}
          size="sm"
        >
          <Icon className="size-4" name="IconCode" />
          Code
        </Button>
      </div>
    </div>
  );
}
