import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Page-width wrapper for the landing sections: 1200px of content with 16, 24,
 * and 32px gutters. The site header lines its items up with it on the home page.
 */
export function Container({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1264px] px-4 sm:px-6 lg:px-8",
        className,
      )}
      {...props}
    />
  );
}
