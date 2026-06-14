import Link from "next/link";
import {
  ArrowUpRight,
  Bell,
  Boxes,
  Component,
  Copy,
  LayoutGrid,
  Sparkles,
  Table,
} from "lucide-react";

const PILLS = [
  { icon: Copy, label: "Copy & paste" },
  { icon: Sparkles, label: "Tailwind v4 · React 19" },
  { icon: Boxes, label: "Open source" },
];

const CLUSTER = [Component, LayoutGrid, Bell, Table];

export function Hero() {
  return (
    <section
      id="studio"
      className="relative isolate flex min-h-[92svh] flex-col overflow-hidden bg-neutral-950 text-white"
    >
      {/* Background image (drop a file at public/hero-cover.jpg). Falls back to
          a gradient if the image isn't there yet. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-30 bg-neutral-950 bg-[radial-gradient(80%_55%_at_50%_-10%,rgba(120,119,198,0.3),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-cover.avif')" }}
      />
      {/* Dark overlay so the text stays readable over any image */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-t from-black/85 via-black/45 to-black/30"
      />

      {/* Centered text block */}
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-4 pt-28 pb-12 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          The cortexcn component library
        </span>

        <h1 className="mt-6 max-w-3xl text-5xl leading-[0.95] font-semibold tracking-tight text-balance sm:text-7xl">
          Components you can copy, paste, and ship
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65">
          An open-source library of accessible React + Tailwind components and
          blocks — installable in seconds with the shadcn CLI.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3 text-sm">
          <Link
            href="/docs"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-medium text-neutral-950 transition-transform active:scale-[0.98]"
          >
            Browse components
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
          </Link>
          <Link
            href="/docs/installation"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 font-medium text-white/90 transition-colors hover:bg-white/10"
          >
            Get started
          </Link>
        </div>
      </div>

      {/* Bottom feature bar: stat + icon cluster, divider, glassy pills */}
      <div className="mx-auto w-full max-w-6xl px-4 pb-12">
        <div className="h-px w-full bg-white/10" />
        <div className="mt-6 flex flex-col items-center justify-between gap-6 lg:flex-row">
          <div className="flex items-center gap-4">
            <p className="text-left text-sm leading-snug font-medium text-white/90">
              60+ components
              <br />& blocks ready
            </p>
            <div className="flex -space-x-2">
              {CLUSTER.map((Icon, i) => (
                <div
                  key={i}
                  className="flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur"
                >
                  <Icon className="size-4 text-white/90" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {PILLS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur"
              >
                <Icon className="size-4" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
