"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useDocsSearch } from "fumadocs-core/search/client";
import { useTheme } from "next-themes";
import { useHotkeys } from "react-hotkeys-hook";
import {
  ArrowUpRightIcon,
  FileTextIcon,
  MailIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";

import { CONTACT_EMAIL, FOUNDER_URL, MAIN_NAV } from "@/config/site";
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";

// Search result content may include <mark> highlight tags — show plain text.
function stripTags(value: string) {
  return value.replace(/<[^>]*>/g, "");
}

export function CommandMenu() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);

  const { search, setSearch, query } = useDocsSearch({ type: "fetch" });

  useHotkeys(
    "mod+k",
    (e) => {
      e.preventDefault();
      setOpen((prev) => !prev);
    },
    { enableOnFormTags: true },
  );

  // Reset the query each time the dialog closes.
  React.useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open, setSearch]);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  const isSearching = search.trim().length > 0;
  const results = Array.isArray(query.data) ? query.data : [];

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

      <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
        <CommandInput
          placeholder="Search the docs or run a command…"
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          {isSearching ? (
            query.isLoading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Searching…
              </div>
            ) : results.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </div>
            ) : (
              <CommandGroup heading="Documentation">
                {results.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={() => runCommand(() => router.push(item.url))}
                    className="flex-col items-start gap-0.5"
                  >
                    <span
                      className={
                        item.type === "page"
                          ? "flex items-center gap-2 font-medium"
                          : "flex items-center gap-2"
                      }
                    >
                      {item.type === "page" && <FileTextIcon />}
                      {stripTags(item.content)}
                    </span>
                    {item.type !== "page" && item.breadcrumbs?.length ? (
                      <span className="pl-7 text-xs text-muted-foreground">
                        {item.breadcrumbs.join(" › ")}
                      </span>
                    ) : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            )
          ) : (
            <>
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
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
