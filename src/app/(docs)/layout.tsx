import type { ReactNode } from "react";
import Link from "next/link";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";

import packageJson from "../../../package.json";
import { source } from "@/lib/source";
import { ThemeToggle } from "@/components/theme-toggle";
import { CortexcnMark } from "@/components/cortexcn-mark";

export default function DocsRootLayout({ children }: { children: ReactNode }) {
  return (
    // The app root layout already provides next-themes, so disable Fumadocs' own.
    <RootProvider theme={{ enabled: false }}>
      <DocsLayout
        tree={source.pageTree}
        nav={{ title: <CortexcnMark />, url: "/" }}
        // Replace Fumadocs' default sidebar theme switch with our own footer row
        // so the version badge fills the gap beside the toggle.
        themeSwitch={{ enabled: false }}
        sidebar={{
          footer: (
            <div className="flex items-center justify-between gap-2 rounded-lg border bg-secondary/50 p-0.5 ps-2.5">
              <Link
                href="/docs/changelog"
                aria-label={`cortexcn version ${packageJson.version} — view changelog`}
                className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <span className="font-medium text-foreground/80">
                  @cortexcn
                </span>
                <span aria-hidden>·</span>
                <span className="font-mono">{packageJson.version}</span>
              </Link>
              <ThemeToggle />
            </div>
          ),
        }}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
