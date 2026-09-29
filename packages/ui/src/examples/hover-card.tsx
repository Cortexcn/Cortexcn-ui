"use client";

// Examples adapted from the shadcn/ui Hover Card docs (MIT, https://ui.shadcn.com).

import type * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../components/hover-card";

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

const HOVER_CARD_SIDES = ["top", "right", "bottom", "left"] as const;

export function HoverCardSides() {
  return (
    <Example title="Sides">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {HOVER_CARD_SIDES.map((side) => (
          <HoverCard closeDelay={100} key={side} openDelay={100}>
            <HoverCardTrigger asChild>
              <Button
                className="style-sera:uppercase capitalize"
                variant="outline"
              >
                {side}
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-64" side={side}>
              <div className="flex flex-col style-luma:gap-2 style-lyra:gap-1 style-maia:gap-2 style-mira:gap-1 style-nova:gap-1.5 style-sera:gap-2 style-vega:gap-2">
                <h4 className="font-medium style-sera:font-heading style-sera:font-semibold style-sera:tracking-wide">
                  Hover Card
                </h4>
                <p className="style-sera:leading-relaxed">
                  This hover card appears on the {side} side of the trigger.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    </Example>
  );
}

export function HoverCardInDialog() {
  return (
    <Example title="In Dialog">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hover Card Example</DialogTitle>
            <DialogDescription>
              Hover over the button below to see the hover card.
            </DialogDescription>
          </DialogHeader>
          <HoverCard closeDelay={100} openDelay={100}>
            <HoverCardTrigger asChild>
              <Button className="w-fit" variant="outline">
                Hover me
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-64">
              <div className="flex flex-col style-luma:gap-2 style-lyra:gap-1 style-maia:gap-2 style-mira:gap-1 style-nova:gap-1.5 style-sera:gap-2 style-vega:gap-2">
                <h4 className="font-medium style-sera:font-heading style-sera:font-semibold style-sera:tracking-wide">
                  Hover Card
                </h4>
                <p className="style-sera:leading-relaxed">
                  This hover card appears inside a dialog. Hover over the button
                  to see it.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </DialogContent>
      </Dialog>
    </Example>
  );
}
