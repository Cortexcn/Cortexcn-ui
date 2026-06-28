"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Studio", href: "/" },
  { name: "Components", href: "/docs/components" },
  { name: "Blocks", href: "/docs/blocks" },
  { name: "Contact", href: "/contact" },
];

function HeroHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header>
      <nav
        data-state={menuOpen ? "active" : undefined}
        className="fixed top-0 z-20 w-full px-2"
      >
        <div className="mx-auto mt-2 max-w-6xl rounded-2xl border border-transparent px-6 py-3 transition-all duration-300 lg:px-12">
          <div className="relative flex flex-wrap items-center justify-between gap-6 lg:gap-0">
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground"
              >
                <span className="inline-flex size-7 items-center justify-center rounded-lg border bg-foreground text-background text-sm font-bold">
                  C
                </span>
                Cortexcn
              </Link>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu
                  className={cn(
                    "m-auto size-6 duration-200",
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
                {navLinks.map((item) => (
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
                menuOpen ? "block" : "hidden lg:flex",
              )}
            >
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {navLinks.map((item) => (
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

export default function HeroSection1() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        {/* Soft ambient glows, pure CSS, no assets */}
        <div
          aria-hidden
          className="absolute inset-0 isolate hidden opacity-60 lg:block"
        >
          <div className="absolute left-0 top-0 h-[80rem] w-[35rem] -translate-y-1/3 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,55%,.06)_0,hsla(0,0%,45%,.02)_50%,transparent_80%)]" />
          <div className="absolute right-0 top-0 h-[60rem] w-[30rem] translate-x-1/4 rotate-12 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,55%,.05)_0,transparent_80%)]" />
        </div>

        <section>
          <div className="relative pt-24 md:pt-36">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background,hsl(var(--background)))_75%)]"
            />

            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                {/* Eyebrow badge */}
                <motion.div
                  initial={{ opacity: 0, filter: "blur(12px)", y: 12 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                >
                  <Link
                    href="/docs/blocks"
                    className="group mx-auto flex w-fit items-center gap-4 rounded-full border bg-muted p-1 pl-4 shadow-md shadow-black/5 transition-colors duration-300 hover:bg-background"
                  >
                    <span className="text-sm text-foreground">
                      New blocks library, copy and own them
                    </span>
                    <span className="block h-4 w-0.5 border-l bg-border" />
                    <div className="size-6 overflow-hidden rounded-full bg-background duration-500 group-hover:bg-muted">
                      <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>

                {/* Headline */}
                <motion.h1
                  initial={{ opacity: 0, filter: "blur(12px)", y: 16 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
                  className="mx-auto mt-8 max-w-4xl text-balance text-5xl font-semibold tracking-tight md:text-7xl lg:mt-16 xl:text-[5.25rem]"
                >
                  Components and blocks you actually own
                </motion.h1>

                {/* Subtext */}
                <motion.p
                  initial={{ opacity: 0, filter: "blur(12px)", y: 16 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                  className="mx-auto mt-8 max-w-2xl text-balance text-lg text-muted-foreground"
                >
                  Cortexcn is a studio of beautifully crafted components and
                  blocks you can copy straight into your app. Built on
                  shadcn/ui, styled with Tailwind, yours to keep.
                </motion.p>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                  className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
                >
                  <div className="rounded-[calc(var(--radius)+0.625rem)] border bg-foreground/10 p-0.5">
                    <Button
                      asChild
                      size="lg"
                      className="rounded-xl px-5 text-base"
                    >
                      <Link href="/docs/components">
                        <span className="text-nowrap">Browse components</span>
                      </Link>
                    </Button>
                  </div>
                  <Button
                    asChild
                    size="lg"
                    variant="ghost"
                    className="h-[2.625rem] rounded-xl px-5"
                  >
                    <Link href="/docs">
                      <span className="text-nowrap">Get started</span>
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Tasteful bordered placeholder card with subtle gradient, no assets */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.7 }}
            >
              <div className="relative mt-8 overflow-hidden px-2 [mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)] sm:mt-12 md:mt-20">
                <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border bg-background p-4 shadow-lg shadow-black/10 ring-1 ring-background">
                  <div className="relative flex aspect-[15/8] items-center justify-center overflow-hidden rounded-2xl border bg-gradient-to-br from-muted/60 via-background to-muted/30">
                    <div
                      aria-hidden
                      className="absolute inset-0 [background-image:linear-gradient(to_right,hsl(var(--border)/0.4)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.4)_1px,transparent_1px)] [background-size:2.5rem_2.5rem] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
                    />
                    <div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center">
                      <span className="inline-flex size-12 items-center justify-center rounded-xl border bg-foreground text-background text-lg font-bold">
                        C
                      </span>
                      <p className="text-sm font-medium text-foreground">
                        Live preview of every component and block
                      </p>
                      <p className="max-w-sm text-sm text-muted-foreground">
                        Copy the code, paste it in, make it yours. No lock in.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Plain-text label row replacing the brand-SVG logo cloud */}
        <section className="bg-background pb-16 pt-16 md:pb-32">
          <div className="m-auto max-w-5xl px-6">
            <p className="text-center text-sm text-muted-foreground">
              Crafted for the modern stack
            </p>
            <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm font-medium text-muted-foreground">
              <span>shadcn/ui</span>
              <span>Tailwind CSS</span>
              <span>React</span>
              <span>Next.js</span>
              <span>TypeScript</span>
              <span>Radix UI</span>
              <span>Motion</span>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
