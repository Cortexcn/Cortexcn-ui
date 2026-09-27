import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Both frames share one height so they line up side by side. */
const FRAME_HEIGHT = "h-[min(76vh,800px)]";

/** A browser window whose page scrolls inside it. */
export function BrowserFrame({
  address,
  children,
  className,
  label,
}: {
  address: string;
  children: ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <figure
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border bg-background shadow-sm",
        FRAME_HEIGHT,
        className,
      )}
    >
      <div className="flex h-10 shrink-0 items-center gap-3 border-b bg-muted/50 px-4">
        <div aria-hidden="true" className="flex w-12 gap-1.5">
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
        </div>
        <span className="mx-auto truncate rounded-md bg-background px-3 py-0.5 font-mono text-muted-foreground text-xs">
          {address}
        </span>
        <span aria-hidden="true" className="w-12" />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {children}
      </div>
      <figcaption className="sr-only">{label}</figcaption>
    </figure>
  );
}

/** A phone outline whose page scrolls inside it. */
export function PhoneFrame({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <figure
      className={cn(
        "overflow-hidden rounded-[2.25rem] border-6 border-foreground/85 bg-background shadow-sm",
        FRAME_HEIGHT,
        className,
      )}
    >
      <div className="h-full overflow-y-auto overscroll-contain [scrollbar-width:none]">
        {children}
      </div>
      <figcaption className="sr-only">{label}</figcaption>
    </figure>
  );
}
