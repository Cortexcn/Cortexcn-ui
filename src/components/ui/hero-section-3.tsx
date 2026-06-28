"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Menu, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Studio", href: "/" },
  { name: "Components", href: "/docs/components" },
  { name: "Blocks", href: "/docs/blocks" },
  { name: "Contact", href: "/contact" },
];

// Shared transition for the staggered fade and blur entrance.
const ease = [0.22, 1, 0.36, 1] as const;

function HeroHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header>
      <nav
        data-state={menuOpen ? "active" : undefined}
        className="fixed z-20 w-full px-2"
      >
        <div className="mx-auto mt-2 max-w-6xl rounded-2xl border border-transparent px-6 py-3 transition-all duration-300 lg:px-12">
          <div className="relative flex flex-wrap items-center justify-between gap-6 lg:gap-0">
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center gap-2"
              >
                <span className="grid size-7 place-items-center rounded-lg bg-foreground text-background">
                  <Sparkles className="size-4" />
                </span>
                <span className="text-lg font-semibold tracking-tight text-foreground">
                  Cortexcn
                </span>
              </Link>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu
                  className={cn(
                    "size-6 duration-200",
                    menuOpen && "rotate-180 scale-0 opacity-0",
                  )}
                />
                <X
                  className={cn(
                    "absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200",
                    menuOpen && "rotate-0 scale-100 opacity-100",
                  )}
                />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="block text-muted-foreground duration-150 hover:text-foreground"
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className={cn(
                "mb-6 w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border bg-background p-6 shadow-2xl shadow-black/5 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none",
                menuOpen ? "flex" : "hidden lg:flex",
              )}
            >
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="block text-muted-foreground duration-150 hover:text-foreground"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Button asChild variant="outline" size="sm">
                  <Link href="/docs">
                    <span>Get started</span>
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/docs/components">
                    <span>Browse components</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default function HeroSection3() {
  return (
    <>
      <HeroHeader />

      <main className="overflow-hidden">
        <section>
          <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-32 lg:pt-48">
            <div className="relative z-10 mx-auto max-w-4xl text-center">
              <motion.a
                href="/docs/blocks"
                initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.7, ease }}
                className="mx-auto flex w-fit items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted"
              >
                <Sparkles className="size-3.5" />
                <span>Now shipping: copy-and-own blocks</span>
                <ArrowRight className="size-3.5" />
              </motion.a>

              <motion.h1
                initial={{ opacity: 0, y: 16, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, ease, delay: 0.1 }}
                className="mt-8 text-balance text-5xl font-semibold tracking-tight text-foreground md:text-6xl"
              >
                Ship beautiful interfaces without starting from scratch
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, ease, delay: 0.25 }}
                className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground"
              >
                Cortexcn is a studio of crafted components and full page blocks,
                built on shadcn/ui. Copy them into your project, own the code,
                and make them yours.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, ease, delay: 0.4 }}
                className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
              >
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/docs/components">
                    <span>Browse components</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Link href="/docs">
                    <span>Get started</span>
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.55 }}
                className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
              >
                <span>Built on shadcn/ui</span>
                <span aria-hidden className="text-muted-foreground/40">
                  /
                </span>
                <span>Tailwind native</span>
                <span aria-hidden className="text-muted-foreground/40">
                  /
                </span>
                <span>Copy and own</span>
                <span aria-hidden className="text-muted-foreground/40">
                  /
                </span>
                <span>Fully typed</span>
              </motion.div>
            </div>

            {/* Tasteful bordered placeholder card with a subtle gradient, replaces the screenshot. */}
            <motion.div
              aria-hidden
              initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, ease, delay: 0.6 }}
              className="relative mx-auto mt-16 max-w-4xl"
            >
              <div className="rounded-3xl border bg-gradient-to-b from-muted/60 to-background p-2 shadow-xl shadow-black/5">
                <div className="rounded-2xl border bg-background p-6">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                    <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                    <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    {["Components", "Blocks", "Templates"].map((label) => (
                      <div
                        key={label}
                        className="rounded-xl border bg-gradient-to-b from-muted/50 to-transparent p-5 text-left"
                      >
                        <div className="text-sm font-medium text-foreground">
                          {label}
                        </div>
                        <div className="mt-3 h-2 w-3/4 rounded-full bg-muted-foreground/20" />
                        <div className="mt-2 h-2 w-1/2 rounded-full bg-muted-foreground/10" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
