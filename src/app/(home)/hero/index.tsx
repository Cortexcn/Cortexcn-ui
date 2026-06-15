import {
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
  { icon: Sparkles, label: "Tailwind v4" },
  { icon: Boxes, label: "Open source" },
];

const CLUSTER = [Component, LayoutGrid, Bell, Table];

export function Hero() {
  return (
    <section
      id="studio"
      className="px-2 pt-2 font-[family-name:var(--font-satoshi)]"
    >
      <div className="relative isolate flex min-h-[calc(100svh-5rem)] flex-col justify-end overflow-hidden rounded-3xl bg-neutral-900">
        {/* Background image */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-cover.avif')" }}
        />
        {/* Overlay so the text stays readable */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-black/5"
        />

        <div className="relative w-full px-6 pb-10 sm:px-10 sm:pb-12">
          {/* Heading (left) + subtext (right) */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h1 className="max-w-3xl text-left text-[52px] leading-[1.1] font-normal tracking-[-0.06em] text-[#fafafae6] text-balance sm:text-[72px] lg:text-[96px]">
              Components you can copy, paste &amp; ship
            </h1>
            <p className="max-w-xs text-sm leading-relaxed font-medium text-white/80 lg:text-right">
              An open-source library of accessible React + Tailwind components
              and blocks — installable in seconds with the shadcn CLI.
            </p>
          </div>

          {/* Bottom row: stat + icon cluster · divider · pills */}
          <div className="mt-10 flex flex-col gap-5 lg:flex-row lg:items-center">
            <div className="flex items-center gap-4">
              <p className="text-sm leading-snug font-medium text-white/90">
                60+ Components
                <br />& Blocks Ready
              </p>
              <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 p-1 backdrop-blur">
                {CLUSTER.map((Icon, i) => (
                  <div
                    key={i}
                    className="flex size-9 items-center justify-center rounded-full bg-white/10"
                  >
                    <Icon className="size-4 text-white/90" />
                  </div>
                ))}
              </div>
            </div>

            <div
              aria-hidden
              className="hidden h-px flex-1 bg-white/20 lg:block"
            />

            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              {PILLS.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur"
                >
                  <Icon className="size-4" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
