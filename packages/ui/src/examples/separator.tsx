"use client";

// Examples adapted from the shadcn/ui Separator docs (MIT, https://ui.shadcn.com).

import type * as React from "react";
import { cn } from "@/lib/utils";
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

export function SeparatorHorizontal() {
  return (
    <Example title="Horizontal">
      <div className="flex flex-col gap-4 style-lyra:text-xs/relaxed text-sm">
        <div className="flex flex-col gap-1">
          <div className="font-medium leading-none">shadcn/ui</div>
          <div className="text-muted-foreground">
            The Foundation for your Design System
          </div>
        </div>
        <Separator />
        <div>
          A set of beautifully designed components that you can customize,
          extend, and build on.
        </div>
      </div>
    </Example>
  );
}

export function SeparatorVertical() {
  return (
    <Example title="Vertical">
      <div className="flex h-5 items-center gap-4 style-lyra:text-xs/relaxed text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </Example>
  );
}

export function SeparatorVerticalMenu() {
  return (
    <Example title="Vertical Menu">
      <div className="flex items-center gap-2 style-lyra:text-xs/relaxed text-sm md:gap-4">
        <div className="flex flex-col gap-1">
          <span className="font-medium">Settings</span>
          <span className="text-muted-foreground text-xs">
            Manage preferences
          </span>
        </div>
        <Separator orientation="vertical" />
        <div className="flex flex-col gap-1">
          <span className="font-medium">Account</span>
          <span className="text-muted-foreground text-xs">
            Profile & security
          </span>
        </div>
        <Separator orientation="vertical" />
        <div className="flex flex-col gap-1">
          <span className="font-medium">Help</span>
          <span className="text-muted-foreground text-xs">Support & docs</span>
        </div>
      </div>
    </Example>
  );
}

export function SeparatorInList() {
  return (
    <Example title="In List">
      <div className="flex flex-col gap-2 style-lyra:text-xs/relaxed text-sm">
        <dl className="flex items-center justify-between">
          <dt>Item 1</dt>
          <dd className="text-muted-foreground">Value 1</dd>
        </dl>
        <Separator />
        <dl className="flex items-center justify-between">
          <dt>Item 2</dt>
          <dd className="text-muted-foreground">Value 2</dd>
        </dl>
        <Separator />
        <dl className="flex items-center justify-between">
          <dt>Item 3</dt>
          <dd className="text-muted-foreground">Value 3</dd>
        </dl>
      </div>
    </Example>
  );
}
