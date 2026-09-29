"use client";

// Examples adapted from the shadcn/ui Sonner docs (MIT, https://ui.shadcn.com).

import type * as React from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "../components/button";

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

export function SonnerBasic() {
  return (
    <Example className="items-center justify-center" title="Basic">
      <Button
        className="w-fit"
        onClick={() => toast("Event has been created")}
        variant="outline"
      >
        Show Toast
      </Button>
    </Example>
  );
}

export function SonnerWithDescription() {
  return (
    <Example className="items-center justify-center" title="With Description">
      <Button
        className="w-fit"
        onClick={() =>
          toast("Event has been created", {
            description: "Monday, January 3rd at 6:00pm",
          })
        }
        variant="outline"
      >
        Show Toast
      </Button>
    </Example>
  );
}
