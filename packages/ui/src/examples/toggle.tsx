"use client";

// Examples adapted from the shadcn/ui Toggle docs (MIT, https://ui.shadcn.com).

import {
  BoldIcon,
  BookmarkIcon,
  ItalicIcon,
  UnderlineIcon,
} from "lucide-react";
import type * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../components/button";
import { Toggle } from "../components/toggle";

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

export function ToggleBasic() {
  return (
    <Example title="Basic">
      <div className="flex flex-wrap items-center gap-2">
        <Toggle aria-label="Toggle bold" defaultPressed>
          <BoldIcon />
        </Toggle>
        <Toggle aria-label="Toggle italic">
          <ItalicIcon />
        </Toggle>
        <Toggle aria-label="Toggle underline">
          <UnderlineIcon />
        </Toggle>
      </div>
    </Example>
  );
}

export function ToggleOutline() {
  return (
    <Example title="Outline">
      <div className="flex flex-wrap items-center gap-2">
        <Toggle aria-label="Toggle italic" variant="outline">
          <ItalicIcon data-icon="inline-start" />
          Italic
        </Toggle>
        <Toggle aria-label="Toggle bold" variant="outline">
          <BoldIcon data-icon="inline-start" />
          Bold
        </Toggle>
      </div>
    </Example>
  );
}

export function ToggleSizes() {
  return (
    <Example title="Sizes">
      <div className="flex flex-wrap items-center gap-2">
        <Toggle aria-label="Toggle small" size="sm" variant="outline">
          Small
        </Toggle>
        <Toggle aria-label="Toggle default" size="default" variant="outline">
          Default
        </Toggle>
        <Toggle aria-label="Toggle large" size="lg" variant="outline">
          Large
        </Toggle>
      </div>
    </Example>
  );
}

export function ToggleWithButtonText() {
  return (
    <Example title="With Button Text">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            Button
          </Button>
          <Toggle aria-label="Toggle sm" size="sm" variant="outline">
            Toggle
          </Toggle>
        </div>
        <div className="flex items-center gap-2">
          <Button size="default" variant="outline">
            Button
          </Button>
          <Toggle aria-label="Toggle default" size="default" variant="outline">
            Toggle
          </Toggle>
        </div>
        <div className="flex items-center gap-2">
          <Button size="lg" variant="outline">
            Button
          </Button>
          <Toggle aria-label="Toggle lg" size="lg" variant="outline">
            Toggle
          </Toggle>
        </div>
      </div>
    </Example>
  );
}

export function ToggleWithButtonIcon() {
  return (
    <Example title="With Button Icon">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button size="icon-sm" variant="outline">
            <BoldIcon />
          </Button>
          <Toggle aria-label="Toggle sm icon" size="sm" variant="outline">
            <BoldIcon />
          </Toggle>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline">
            <ItalicIcon />
          </Button>
          <Toggle
            aria-label="Toggle default icon"
            size="default"
            variant="outline"
          >
            <ItalicIcon />
          </Toggle>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon-lg" variant="outline">
            <UnderlineIcon />
          </Button>
          <Toggle aria-label="Toggle lg icon" size="lg" variant="outline">
            <UnderlineIcon />
          </Toggle>
        </div>
      </div>
    </Example>
  );
}

export function ToggleWithButtonIconText() {
  return (
    <Example title="With Button Icon + Text">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <BoldIcon data-icon="inline-start" />
            Button
          </Button>
          <Toggle aria-label="Toggle sm icon text" size="sm" variant="outline">
            <BoldIcon data-icon="inline-start" />
            Toggle
          </Toggle>
        </div>
        <div className="flex items-center gap-2">
          <Button size="default" variant="outline">
            <ItalicIcon data-icon="inline-start" />
            Button
          </Button>
          <Toggle
            aria-label="Toggle default icon text"
            size="default"
            variant="outline"
          >
            <ItalicIcon data-icon="inline-start" />
            Toggle
          </Toggle>
        </div>
        <div className="flex items-center gap-2">
          <Button size="lg" variant="outline">
            <UnderlineIcon data-icon="inline-start" />
            Button
          </Button>
          <Toggle aria-label="Toggle lg icon text" size="lg" variant="outline">
            <UnderlineIcon data-icon="inline-start" />
            Toggle
          </Toggle>
        </div>
      </div>
    </Example>
  );
}

export function ToggleDisabled() {
  return (
    <Example title="Disabled">
      <div className="flex flex-wrap items-center gap-2">
        <Toggle aria-label="Toggle disabled" disabled>
          Disabled
        </Toggle>
        <Toggle aria-label="Toggle disabled outline" disabled variant="outline">
          Disabled
        </Toggle>
      </div>
    </Example>
  );
}

export function ToggleWithIcon() {
  return (
    <Example title="With Icon">
      <div className="flex flex-wrap items-center gap-2">
        <Toggle aria-label="Toggle bookmark" defaultPressed>
          <BookmarkIcon className="group-data-[state=on]/toggle:fill-accent-foreground" />
        </Toggle>
        <Toggle aria-label="Toggle bookmark outline" variant="outline">
          <BookmarkIcon
            className="group-data-[state=on]/toggle:fill-accent-foreground"
            data-icon="inline-start"
          />
          Bookmark
        </Toggle>
      </div>
    </Example>
  );
}
