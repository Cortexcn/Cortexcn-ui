"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useHotkeys } from "react-hotkeys-hook";
import { ArrowUpRightIcon, MailIcon, MoonIcon, SunIcon } from "lucide-react";

import { CONTACT_EMAIL, FOUNDER_URL, MAIN_NAV } from "@/config/site";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";

export function CommandMenu() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);

  useHotkeys(
    "mod+k",
    (e) => {
      e.preventDefault();
      setOpen((prev) => !prev);
    },
    { enableOnFormTags: true },
  );

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        data-slot="command-menu-trigger"
        variant="outline"
        size="sm"
        className="gap-2 text-muted-foreground"
        onClick={() => setOpen(true)}
        aria-label="Open command menu"
      >
        <span className="max-sm:hidden">Search…</span>
        <Kbd className="max-sm:hidden">⌘K</Kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Navigation">
            {MAIN_NAV.map((item) => (
              <CommandItem
                key={item.href}
                value={item.title}
                onSelect={() => runCommand(() => router.push(item.href))}
              >
                {item.title}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Links">
            <CommandItem
              value="Founder · Syed Moinuddin"
              onSelect={() =>
                runCommand(() => window.open(FOUNDER_URL, "_blank"))
              }
            >
              <ArrowUpRightIcon />
              About the founder
            </CommandItem>
            <CommandItem
              value="Email the studio"
              onSelect={() =>
                runCommand(() => {
                  window.location.href = `mailto:${CONTACT_EMAIL}`;
                })
              }
            >
              <MailIcon />
              {CONTACT_EMAIL}
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Theme">
            <CommandItem
              value="Toggle theme"
              onSelect={() =>
                runCommand(() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark"),
                )
              }
            >
              {resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
              Toggle theme
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
