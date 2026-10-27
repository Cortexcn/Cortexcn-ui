"use client";

import {
  AnchorProvider,
  ScrollProvider,
  TOCItem,
  type TOCItemType,
} from "fumadocs-core/toc";
import Link from "next/link";
import { useRef } from "react";
import type { RailPromo } from "@/lib/nav-menus";
import { FeatureVisual } from "./header-nav";

interface TableOfContentsProps {
  items: TOCItemType[];
  promo?: RailPromo;
}

function PromoCard({ promo }: { promo: RailPromo }) {
  return (
    <div className="shrink-0 [@media(max-height:760px)]:hidden">
      <div className="group/feature rounded-shell-xl border border-border bg-card p-1.5 shadow-sm">
        <div className="overflow-hidden rounded-shell-lg border border-border bg-muted">
          <FeatureVisual feature={promo.feature} />
        </div>
        <div className="flex flex-col gap-1.5 px-2.5 pt-3 pb-2.5">
          <p className="m-0 text-muted-foreground text-xs">{promo.eyebrow}</p>
          <p className="m-0 font-semibold text-foreground text-sm tracking-tight">
            {promo.feature.title}
          </p>
          <p className="m-0 text-muted-foreground text-xs leading-relaxed">
            {promo.feature.description}
          </p>
          <Link
            className="mt-2 flex h-9 items-center justify-center rounded-shell-sm bg-foreground font-medium text-background text-sm no-underline outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            href={promo.feature.href}
          >
            {promo.cta}
          </Link>
        </div>
      </div>
      <p className="m-0 mt-2.5 px-1 text-muted-foreground text-xs leading-relaxed">
        {promo.note}
      </p>
    </div>
  );
}

/** The right rail: the page's headings, then the templates card. */
export function TableOfContents({ items, promo }: TableOfContentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <aside className="fixed top-(--site-header-height) right-0 hidden h-[calc(100vh-var(--site-header-height))] w-72 overflow-hidden px-5 pt-8 pb-6 xl:block">
      <div className="flex h-full flex-col gap-6">
        {items.length > 0 ? (
          <div className="flex min-h-0 flex-1 flex-col">
            <p className="m-0 mb-2 px-3 font-medium text-foreground text-sm">
              On this page
            </p>
            <AnchorProvider toc={items}>
              <div
                className="min-h-0 flex-1 overflow-y-auto"
                ref={containerRef}
              >
                <ScrollProvider containerRef={containerRef}>
                  <ul className="m-0 ml-3 list-none border-border border-l p-0">
                    {items.map((item) => (
                      <li
                        key={item.url}
                        style={{ paddingLeft: `${(item.depth - 2) * 12}px` }}
                      >
                        <TOCItem
                          className="-ml-px block border-transparent border-l py-1.5 pl-3.5 text-[13px] text-muted-foreground no-underline transition-colors hover:text-foreground data-[active=true]:border-foreground data-[active=true]:text-foreground"
                          href={item.url}
                        >
                          {item.title}
                        </TOCItem>
                      </li>
                    ))}
                  </ul>
                </ScrollProvider>
              </div>
            </AnchorProvider>
          </div>
        ) : (
          <div className="flex-1" />
        )}
        {promo ? <PromoCard promo={promo} /> : null}
      </div>
    </aside>
  );
}
