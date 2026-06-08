import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Decorative L-shaped bracket drawn in one corner. The four corners are
// produced by mirroring this single shape with scale transforms.
function BorderButtonCorner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute size-3 text-foreground/40 transition-all duration-200 group-hover/button:text-foreground",
        className,
      )}
    >
      <path
        d="M0 0V12"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
      />
      <path
        d="M0 12H12"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
      />
    </svg>
  );
}

function BorderButton({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="outline"
      className={cn(
        "relative overflow-visible rounded-none px-4! shadow-none",
        className,
      )}
      {...props}
    >
      {children}

      {/* Animated corner brackets — they ease outward on hover to highlight
          the button's border. */}
      <BorderButtonCorner className="-bottom-px -left-px group-hover/button:-bottom-0.5 group-hover/button:-left-0.5" />
      <BorderButtonCorner className="-right-px -bottom-px scale-x-[-1] group-hover/button:-right-0.5 group-hover/button:-bottom-0.5" />
      <BorderButtonCorner className="-top-px -left-px scale-y-[-1] group-hover/button:-top-0.5 group-hover/button:-left-0.5" />
      <BorderButtonCorner className="-top-px -right-px scale-[-1] group-hover/button:-top-0.5 group-hover/button:-right-0.5" />
    </Button>
  );
}

export { BorderButton };
