import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** A desktop app frame with a title bar, for showing live components in context. */
export function AppWindow({
  title,
  className,
  children,
}: {
  title?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-background text-foreground shadow-[0_30px_60px_-24px_rgb(28_26_21/0.35),0_2px_6px_rgb(28_26_21/0.06)] dark:shadow-[0_30px_60px_-24px_rgb(0_0_0/0.7)]",
        className,
      )}
    >
      <div className="flex h-9 items-center gap-3 border-border border-b bg-muted/60 px-3.5">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-(--faint)" />
          <span className="size-2.5 rounded-full bg-(--faint)" />
          <span className="size-2.5 rounded-full bg-(--faint)" />
        </span>
        {title ? (
          <span className="font-medium text-muted-foreground text-xs">
            {title}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

/** Small mono tag naming the registry item a piece of the UI comes from. */
export function RegistryTag({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "pointer-events-none inline-flex items-center whitespace-nowrap rounded-md border border-border bg-background/90 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground leading-none shadow-xs backdrop-blur-sm",
        className,
      )}
    >
      @cortexcn/{name}
    </span>
  );
}
