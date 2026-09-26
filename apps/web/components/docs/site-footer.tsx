import Link from "fumadocs-core/link";
import { CortexcnLogo } from "../icons/cortexcn";

const PORTFOLIO_URL = "https://syedmoinuddin.com";

export function SiteFooter() {
  return (
    <footer className="py-8">
      <div className="mx-auto flex flex-wrap items-center justify-center gap-2 px-6 text-sm">
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
    </footer>
  );
}
