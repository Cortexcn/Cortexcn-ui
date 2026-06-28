"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, ChevronRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Studio", href: "/" },
  { name: "Components", href: "/docs/components" },
  { name: "Blocks", href: "/docs/blocks" },
  { name: "Contact", href: "/contact" },
];

// Simple staggered fade-in helper. Each child gets a slightly later delay.
const fadeUp = {
  hidden: { opacity: 0, filter: "blur(10px)", y: 12 },
  visible: (delay: number) => ({
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      duration: 0.8,
      delay,
      ease: [0.21, 0.47, 0.32, 0.98] as const,
    },
  }),
};

function HeroHeader() {
  const [menuState, setMenuState] = useState(false);

  return (
    <header>
      <nav
        data-state={menuState ? "active" : undefined}
        className="fixed z-20 w-full border-b border-border bg-background/70 backdrop-blur-xl"
      >
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
              <a
                href="/"
                aria-label="home"
                className="flex items-center space-x-2 text-lg font-semibold tracking-tight text-foreground"
              >
                <span className="grid size-7 place-items-center rounded-md bg-foreground text-sm font-bold text-background">
                  C
                </span>
                <span>Cortexcn</span>
              </a>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu
                  className={cn(
                    "m-auto size-6 duration-200",
                    menuState && "rotate-180 scale-0 opacity-0",
                  )}
                />
                <X
                  className={cn(
                    "absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200",
                    menuState && "rotate-0 scale-100 opacity-100",
                  )}
                />
              </button>

              <div className="hidden lg:block">
                <ul className="flex gap-8 text-sm">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.href}
                        className="block text-muted-foreground duration-150 hover:text-foreground"
                      >
                        <span>{item.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div
              className={cn(
                "mb-6 w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-border bg-background p-6 shadow-2xl shadow-black/5 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none",
                menuState ? "flex" : "hidden lg:flex",
              )}
            >
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.href}
                        className="block text-muted-foreground duration-150 hover:text-foreground"
                      >
                        <span>{item.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Button asChild variant="outline" size="sm">
                  <a href="/docs">
                    <span>Get started</span>
                  </a>
                </Button>
                <Button asChild size="sm">
                  <a href="/docs/components">
                    <span>Browse components</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default function HeroSection2() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        {/* Soft ambient glows in the corner, purely decorative. */}
        <div
          aria-hidden
          className="absolute inset-0 isolate hidden contain-strict lg:block"
        >
          <div className="absolute left-0 top-0 h-[20rem] w-[35rem] -translate-y-[20rem] -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,55%,.08)_0,hsla(0,0%,45%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="absolute left-0 top-0 h-[80rem] w-[15rem] -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,55%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
        </div>

        <section>
          <div className="relative pt-24">
            <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]" />
            <div className="mx-auto max-w-5xl px-6">
              <div className="sm:mx-auto lg:mr-auto lg:mt-0">
                <motion.span
                  variants={fadeUp}
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  className="mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-sm text-muted-foreground lg:mt-16"
                >
                  <span className="size-1.5 rounded-full bg-foreground" />
                  Built on shadcn/ui, owned by you
                  <ChevronRight className="size-3" />
                </motion.span>

                <motion.h1
                  variants={fadeUp}
                  custom={0.1}
                  initial="hidden"
                  animate="visible"
                  className="mt-8 max-w-2xl text-balance text-5xl font-medium tracking-tight text-foreground md:text-6xl"
                >
                  Components and blocks you copy, then truly own.
                </motion.h1>

                <motion.p
                  variants={fadeUp}
                  custom={0.25}
                  initial="hidden"
                  animate="visible"
                  className="mt-8 max-w-2xl text-pretty text-lg text-muted-foreground"
                >
                  Cortexcn is a studio of beautifully crafted, accessible
                  building blocks. Paste them straight into your project, tweak
                  every line, and keep the code as your own. No lock in, no
                  runtime dependency.
                </motion.p>

                <motion.div
                  variants={fadeUp}
                  custom={0.4}
                  initial="hidden"
                  animate="visible"
                  className="mt-12 flex flex-col items-start gap-3 sm:flex-row sm:items-center"
                >
                  <div className="rounded-[calc(var(--radius)+0.25rem)] border border-border bg-foreground/5 p-0.5">
                    <Button
                      asChild
                      size="lg"
                      className="rounded-xl px-5 text-base"
                    >
                      <a href="/docs/components">
                        <span className="text-nowrap">Browse components</span>
                        <ArrowRight className="size-4" />
                      </a>
                    </Button>
                  </div>
                  <Button
                    asChild
                    size="lg"
                    variant="ghost"
                    className="rounded-xl px-5 text-base"
                  >
                    <a href="/docs">
                      <span className="text-nowrap">Get started</span>
                    </a>
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Tasteful self contained preview card replaces the screenshot. */}
            <motion.div
              variants={fadeUp}
              custom={0.6}
              initial="hidden"
              animate="visible"
              className="relative mt-12 px-6 sm:mt-16 md:mt-20"
            >
              <div className="mx-auto max-w-5xl">
                <div className="relative overflow-hidden rounded-2xl border border-border bg-background p-2 shadow-xl shadow-black/5 ring-1 ring-border/50">
                  <div className="relative flex aspect-[15/8] flex-col overflow-hidden rounded-xl border border-border bg-gradient-to-br from-muted/60 via-background to-muted/30">
                    <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                      <span className="size-3 rounded-full bg-muted-foreground/30" />
                      <span className="size-3 rounded-full bg-muted-foreground/30" />
                      <span className="size-3 rounded-full bg-muted-foreground/30" />
                      <span className="ml-3 text-xs text-muted-foreground">
                        cortexcn.studio
                      </span>
                    </div>
                    <div className="grid flex-1 grid-cols-2 gap-4 p-6 sm:grid-cols-3">
                      {[
                        "Button",
                        "Card",
                        "Timeline",
                        "Hero blocks",
                        "Command",
                        "Charts",
                      ].map((label) => (
                        <div
                          key={label}
                          className="flex items-center justify-center rounded-lg border border-border bg-background/70 px-3 py-6 text-center text-sm font-medium text-foreground/80"
                        >
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Plain text label row replaces the brand logo cloud. */}
        <section className="bg-background pb-16 pt-16 md:pb-24">
          <div className="m-auto max-w-5xl px-6">
            <p className="text-center text-sm text-muted-foreground">
              Crafted with the tools you already trust
            </p>
            <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm font-medium text-muted-foreground/80">
              {[
                "shadcn/ui",
                "Tailwind CSS",
                "Radix UI",
                "React",
                "Next.js",
                "Motion",
              ].map((name) => (
                <span key={name} className="duration-150 hover:text-foreground">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
