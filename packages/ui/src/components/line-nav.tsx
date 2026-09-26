/**
 * This component is inspired by Devouring Details and Skiper UI.
 */

"use client";

import { motion } from "motion/react";
import {
  type CSSProperties,
  type MouseEvent,
  type MouseEventHandler,
  memo,
  type Ref,
  useEffect,
  useRef,
} from "react";

import { cn } from "@/lib/utils";

const lineVariants = {
  normal: { width: 24 },
  active: { width: 40 },
  hover: { width: 40 },
};

export interface LineNavItem {
  title: string;
  href: string;
}

export interface LineNavProps {
  className?: string;
  /** @fumadocsHref #linenavitem */
  items: LineNavItem[];
  /** Href of the active item. */
  activeHref?: string;
  /** Scroll the active item into view on mount. */
  scrollActiveIntoView?: boolean;
  /** Called when an item is clicked. */
  onItemClick?: (
    item: LineNavItem,
    event: MouseEvent<HTMLAnchorElement>,
  ) => void;
}

export function LineNav({
  className,
  items,
  activeHref,
  scrollActiveIntoView = true,
  onItemClick,
}: LineNavProps) {
  const activeItemRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (scrollActiveIntoView) {
      activeItemRef.current?.scrollIntoView({ block: "center" });
    }
  }, [scrollActiveIntoView]);

  return (
    <nav
      className={cn("flex flex-col gap-2 py-5.25", className)}
      style={
        {
          "--line-nav-width": `${lineVariants.normal.width}px`,
        } as CSSProperties
      }
    >
      {items.map((item, index) => {
        const isActive = item.href === activeHref;

        return (
          <LineNavItem
            active={isActive}
            href={item.href}
            isLast={index === items.length - 1}
            key={item.href}
            onClick={
              onItemClick ? (event) => onItemClick(item, event) : undefined
            }
            ref={isActive ? activeItemRef : undefined}
            title={item.title}
          />
        );
      })}
    </nav>
  );
}

const LineNavItem = memo(function LineNavItem({
  ref,
  title,
  href,
  active = false,
  isLast = false,
  onClick,
}: {
  ref?: Ref<HTMLAnchorElement>;
  title: string;
  href: string;
  active?: boolean;
  isLast?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <>
      {/*
        Rendered as a plain anchor to stay framework-agnostic. For client-side
        navigation in Next.js, swap `motion.a` for `motion.create(Link)`
        (import Link from "next/link").
      */}
      <motion.a
        animate={active ? "active" : "normal"}
        aria-current={active ? "page" : undefined}
        className="group relative flex h-px items-center gap-3 after:absolute after:top-1/2 after:left-0 after:size-full after:-translate-y-1/2 after:p-3.5"
        href={href}
        initial={false}
        onClick={onClick}
        ref={ref}
        whileHover="hover"
      >
        <motion.span
          className="block h-px shrink-0 bg-foreground/20 transition-[background-color] ease-out group-hover:bg-foreground group-aria-[current=page]:bg-foreground"
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          variants={lineVariants}
        />
        <span className="whitespace-nowrap text-muted-foreground text-sm transition-[color] ease-out group-hover:text-foreground group-aria-[current=page]:text-foreground">
          {title}
        </span>
      </motion.a>

      {!isLast && (
        <>
          <span className="block h-px w-(--line-nav-width) bg-foreground/20" />
          <span className="block h-px w-(--line-nav-width) bg-foreground/20" />
        </>
      )}
    </>
  );
});
