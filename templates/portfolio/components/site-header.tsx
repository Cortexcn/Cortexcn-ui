import { site } from "@/config/site";

import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";

const NAV = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Writing", href: "#writing" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-background/75 px-6 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between">
        <a className="font-semibold tracking-tight" href="#top">
          {site.name}
        </a>
        <nav aria-label="Main" className="flex items-center gap-2 sm:gap-6">
          <ul className="hidden items-center gap-6 font-mono text-muted-foreground text-xs uppercase tracking-wider sm:flex">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  className="transition-colors hover:text-foreground"
                  href={item.href}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <ThemeToggle />
          <MobileNav items={NAV} />
        </nav>
      </div>
    </header>
  );
}
