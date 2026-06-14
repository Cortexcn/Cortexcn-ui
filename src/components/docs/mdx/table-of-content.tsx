"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

// Structural shape of a Fumadocs TOC entry (avoids depending on the exact type
// export path across fumadocs versions).
type TocItem = {
  title: React.ReactNode;
  url: string;
  depth: number;
};

export function DocsTableOfContents({ toc }: { toc: TocItem[] }) {
  const [activeId, setActiveId] = React.useState<string>("");

  React.useEffect(() => {
    const ids = toc.map((item) => item.url.replace(/^#/, ""));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "0% 0% -80% 0%", threshold: 1 },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [toc]);

  if (!toc.length) return null;

  return (
    <div className="flex flex-col gap-3 text-sm">
      <p className="text-xs font-medium text-muted-foreground">On This Page</p>
      <ul className="flex flex-col border-l border-border">
        {toc.map((item) => {
          const id = item.url.replace(/^#/, "");
          const active = id === activeId;

          return (
            <li key={item.url} style={{ paddingLeft: (item.depth - 1) * 12 }}>
              <a
                href={item.url}
                className={cn(
                  "-ml-px block border-l border-transparent py-1 pl-3 text-muted-foreground/80 transition-colors hover:text-foreground",
                  active && "border-primary text-foreground",
                )}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
