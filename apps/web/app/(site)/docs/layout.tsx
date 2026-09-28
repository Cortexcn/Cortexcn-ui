import { NextProvider } from "fumadocs-core/framework/next";
import type { ReactNode } from "react";
import { DocsLayout } from "@/components/docs/docs-layout";
import { libraryNavLinks } from "@/lib/library-nav-links";
import { source } from "@/lib/source";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <NextProvider>
      <DocsLayout
        nav={{
          links: [{ text: "Introduction", url: "/docs" }, ...libraryNavLinks],
        }}
        tree={source.pageTree}
      >
        {children}
      </DocsLayout>
    </NextProvider>
  );
}
