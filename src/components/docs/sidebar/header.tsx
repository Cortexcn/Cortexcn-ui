import Link from "next/link";

import packageJson from "../../../../package.json";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { CommandMenu } from "@/components/command-menu";
import { SOCIAL_LINKS } from "@/config/site";

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.2 3.44 9.6 8.21 11.16.6.11.82-.25.82-.56 0-.28-.01-1.02-.02-2-3.34.71-4.04-1.58-4.04-1.58-.55-1.36-1.34-1.73-1.34-1.73-1.09-.73.08-.72.08-.72 1.2.08 1.84 1.21 1.84 1.21 1.07 1.8 2.81 1.28 3.49.98.11-.76.42-1.28.76-1.58-2.67-.3-5.47-1.31-5.47-5.83 0-1.29.47-2.34 1.24-3.16-.13-.3-.54-1.52.12-3.16 0 0 1.01-.32 3.3 1.21a11.6 11.6 0 0 1 3-.39c1.02 0 2.05.13 3 .39 2.28-1.53 3.29-1.21 3.29-1.21.66 1.64.25 2.86.12 3.16.77.82 1.24 1.87 1.24 3.16 0 4.53-2.81 5.52-5.49 5.81.43.36.81 1.08.81 2.18 0 1.58-.01 2.85-.01 3.24 0 .31.21.68.83.56A12.02 12.02 0 0 0 24 12.29C24 5.78 18.63.5 12 .5Z" />
    </svg>
  );
}

export function DocsHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-14 w-full flex-row items-center justify-between border-b bg-background px-3 sm:h-12">
      <div className="flex items-center">
        <SidebarTrigger className="sidebar:hidden" />
      </div>
      <div className="flex items-center gap-1.5">
        <CommandMenu />
        <Link
          href={SOCIAL_LINKS.github}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <GitHubMark />
        </Link>
        <Link
          href="/docs/changelog"
          aria-label={`cortexcn version ${packageJson.version} — changelog`}
          className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          v{packageJson.version}
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
