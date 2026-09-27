"use client";

import { MenuIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
}

/** Menu button and dropdown for screens too narrow for the inline links. */
export function MobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  return (
    <div className="sm:hidden" ref={ref}>
      <button
        aria-controls="mobile-nav"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex size-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {open ? <XIcon className="size-4" /> : <MenuIcon className="size-4" />}
      </button>
      <ul
        className={cn(
          "absolute inset-x-0 top-16 flex-col border-border border-b bg-background px-6 pb-4",
          open ? "flex" : "hidden",
        )}
        id="mobile-nav"
      >
        {items.map((item) => (
          <li key={item.href}>
            <a
              className="block py-3 font-mono text-muted-foreground text-sm uppercase tracking-wider transition-colors hover:text-foreground"
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
