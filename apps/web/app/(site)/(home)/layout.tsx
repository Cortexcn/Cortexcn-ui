import type { ReactNode } from "react";
import { SiteFooter } from "@/components/docs/site-footer";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    // Scope the Syntiq dark theme to the landing page only. The negative margins
    // pull the navy background up behind the fixed header and out to the edges on
    // mobile (canceling PageCanvasShell's gutter) so the page reads as one canvas.
    <div className="syntiq dark -mt-(--site-header-height) -mx-4 bg-background pt-(--site-header-height) text-foreground sm:mx-0">
      {children}
      <SiteFooter />
    </div>
  );
}
