import Link from "fumadocs-core/link";
import { cn } from "@/lib/utils";
import { CortexcnLogo } from "../icons/cortexcn";

const PORTFOLIO_URL = "https://syedmoinuddin.com";

/**
 * The credit floats at the bottom of the screen so it stays in view on every
 * scroll position. The footer element keeps its height in the page flow, so
 * the last lines of a page can still scroll clear of it.
 */
export function SiteFooter({
  className,
}: {
  /** Matches the page's side columns, so the credit centers on the content. */
  className?: string;
}) {
  return (
    <footer className="h-24">
      <div
        className={cn(
          "pointer-events-none fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex justify-center px-4 print:hidden",
          className,
        )}
      >
        <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2 rounded-full border border-border bg-card/90 px-4 py-2 text-sm shadow-black/5 shadow-lg backdrop-blur-md">
          {/* "auto" also follows the forced-dark landing scope, not just the site theme. */}
          <CortexcnLogo size={16} theme="auto" />
          <span className="font-medium text-foreground">Cortexcn</span>
          <span aria-hidden className="text-muted-foreground">
            ·
          </span>
          <span className="text-muted-foreground">
            built by{" "}
            <Link
              className="text-foreground underline-offset-4 hover:underline"
              external
              href={PORTFOLIO_URL}
            >
              Syed Moinuddin
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
