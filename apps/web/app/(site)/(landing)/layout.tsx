import type { ReactNode } from "react";

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    // Scope the landing theme to this page only; it follows the light/dark toggle.
    // The negative margins pull the background up behind the fixed header and out
    // to the edges on mobile (canceling PageCanvasShell's gutter) so the page
    // reads as one canvas. The landing has its own footer, which carries the
    // "created by" credit the site footer shows elsewhere.
    <div className="syntiq -mx-4 -mt-(--site-header-height) bg-background pt-(--site-header-height) text-foreground sm:mx-0">
      {children}
    </div>
  );
}
