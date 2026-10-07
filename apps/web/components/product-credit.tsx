import { SITE_URL } from "@/lib/site-url";
import { cn } from "@/lib/utils";

/** Where the work is shared as it happens. */
const BUILD_IN_PUBLIC = {
  handle: "@SyedMoinuddin",
  url: "https://x.com/SyedMoin",
};

const linkClassName =
  "font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary";

/** "A product by Cortexcn" and "Building in public at @SyedMoinuddin", for the footers. */
export function ProductCredit({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1.5 text-body text-sm", className)}>
      <p>
        A product by{" "}
        <a className={linkClassName} href={SITE_URL}>
          Cortexcn
        </a>
      </p>
      <p>
        Building in public at{" "}
        <a
          className={linkClassName}
          href={BUILD_IN_PUBLIC.url}
          rel="noopener"
          target="_blank"
        >
          {BUILD_IN_PUBLIC.handle}
        </a>
      </p>
    </div>
  );
}
