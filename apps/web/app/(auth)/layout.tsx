import type { ReactNode } from "react";

import { onest, SENTIENT_STYLESHEET } from "@/components/ui-home/fonts";
import { cn } from "@/lib/utils";

/**
 * Account screens such as sign-in. They belong to the component library, so
 * they share its theme scope and type (see `.ui-home` in globals.css), but
 * skip the site header and footer so the one task has the screen to itself.
 * `isolate` and the background cover the site's fixed dot grid.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn(
        "ui-home relative isolate flex min-h-dvh flex-col bg-background text-foreground",
        onest.variable,
      )}
    >
      <link href={SENTIENT_STYLESHEET} precedence="default" rel="stylesheet" />
      {children}
    </div>
  );
}
