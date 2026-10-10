import { SITE_URL } from "@/lib/site-url";
import { cn } from "@/lib/utils";

/** Where the work is shared as it happens. The handle matches the URL. */
export const BUILD_IN_PUBLIC = {
  handle: "@SyedMoin",
  url: "https://x.com/SyedMoin",
};

const linkClassName =
  "font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary";

/** "Built by Syed Moinuddin" and "Building in public at @SyedMoin", for the footers. */
export function ProductCredit({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1.5 text-body text-sm", className)}>
      <p>
        Built by{" "}
        <a className={linkClassName} href={`${SITE_URL}/about`}>
          Syed Moinuddin
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
