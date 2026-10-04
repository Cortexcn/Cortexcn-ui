"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { useId, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ServicesAction {
  label: string;
  href: string;
}

export interface PreviewService {
  title: string;
  description: string;
  image: { src: string; alt: string };
}

export interface ServicesPreviewListProps {
  /** Pointing at or focusing a service shows its image and description in the side panel. */
  services?: PreviewService[];
  action?: ServicesAction;
  className?: string;
}

/** The flower paintings from the Cortexcn site. */
const ART_BASE = "https://www.cortexcn.dev/images/ui-home";

const DEFAULT_SERVICES: PreviewService[] = [
  {
    title: "Landing pages",
    description:
      "One custom page for a launch, a campaign, or a product, with scroll and hover animations, a contact or waitlist form, and SEO basics. Most ship in one to two weeks.",
    image: {
      src: `${ART_BASE}/neutral-florals.webp`,
      alt: "A painting of white flowers on tall stems",
    },
  },
  {
    title: "Websites",
    description:
      "Five custom pages and a CMS your team can edit on its own, with SEO basics, sitemaps, a contact form, and analytics. Most take three to four weeks.",
    image: {
      src: `${ART_BASE}/pastel-wildflowers.webp`,
      alt: "A painting of golden wildflowers in soft blue light",
    },
  },
  {
    title: "Web applications",
    description:
      "A product with accounts, data, and an admin: sign-in and roles, a database and API, a dashboard, and automated tests and deploys.",
    image: {
      src: `${ART_BASE}/white-blooms.webp`,
      alt: "A painting of white blooms drifting in the wind",
    },
  },
  {
    title: "Backend and APIs",
    description:
      "APIs designed and documented, with the database, auth, and background jobs behind them, ready for your web or mobile app.",
    image: {
      src: `${ART_BASE}/blue-cream-florals.webp`,
      alt: "A painting of cream flowers in a blue field",
    },
  },
  {
    title: "AI pipelines",
    description:
      "Retrieval over your own data, agents that call your tools, and evals that show how well it works before it reaches your users.",
    image: {
      src: `${ART_BASE}/soft-meadow-grass.webp`,
      alt: "A painting of meadow grass and small flowers",
    },
  },
];

/** Wipes the new image up over the one before it. */
const reveal: Variants = {
  hidden: { clipPath: "inset(100% 0% 0% 0%)" },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("size-4", className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7 7h10v10M7 17 17 7" />
    </svg>
  );
}

/** An L-shaped mark for the bottom-left corner; flip it for the others. */
function CornerMark({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none absolute size-3", className)}
      fill="none"
      viewBox="0 0 12 12"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 0V12M0 12H12"
        stroke="currentColor"
        strokeLinecap="square"
        strokeWidth="1"
      />
    </svg>
  );
}

export function ServicesPreviewList({
  services = DEFAULT_SERVICES,
  action = { label: "Get a quote", href: "#" },
  className,
}: ServicesPreviewListProps) {
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState(0);
  const reduce = useReducedMotion();
  const panelId = useId();

  const current = services[active] ?? services[0];
  if (!current) {
    return null;
  }

  function select(index: number) {
    if (index === active) {
      return;
    }
    setPrevious(active);
    setActive(index);
  }

  return (
    <section className={cn("px-6 py-24 sm:py-32", className)}>
      <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:gap-20">
        <div
          className="flex h-fit w-full flex-col gap-6 lg:sticky lg:top-10 lg:max-w-xs"
          id={panelId}
        >
          <div className="relative h-90 overflow-hidden bg-muted">
            {/* Every image loads up front, so the wipe never shows a blank. The
                one underneath is the image being covered. */}
            {services.map((service, index) => (
              // biome-ignore lint/performance/noImgElement: framework-agnostic registry block
              <img
                alt=""
                className={cn(
                  "absolute inset-0 size-full object-cover",
                  index !== previous && "invisible",
                )}
                decoding="async"
                height={720}
                key={service.title}
                src={service.image.src}
                width={640}
              />
            ))}
            <motion.div
              animate="visible"
              className="absolute inset-0"
              initial={reduce ? false : "hidden"}
              key={active}
              variants={reveal}
            >
              {/* biome-ignore lint/performance/noImgElement: framework-agnostic registry block */}
              <img
                alt={current.image.alt}
                className="size-full object-cover"
                decoding="async"
                height={720}
                src={current.image.src}
                width={640}
              />
            </motion.div>
          </div>
          <div aria-live="polite" className="flex flex-col gap-3">
            <p className="font-semibold text-muted-foreground text-sm uppercase tracking-widest">
              {current.title}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {current.description}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-10 xl:pl-20">
          <ul className="w-full">
            {services.map((service, index) => {
              const isActive = index === active;
              return (
                <li className="border-border border-b" key={service.title}>
                  <button
                    aria-controls={panelId}
                    aria-pressed={isActive}
                    className={cn(
                      "w-full py-8 text-left font-semibold text-4xl tracking-tight outline-none transition-opacity duration-300 focus-visible:ring-3 focus-visible:ring-ring/50 sm:text-5xl lg:text-6xl",
                      isActive ? "opacity-100" : "opacity-20",
                    )}
                    onClick={() => select(index)}
                    onFocus={() => select(index)}
                    onPointerEnter={() => select(index)}
                    type="button"
                  >
                    {service.title}
                    <sup className="ml-1 font-normal text-muted-foreground text-sm tabular-nums lg:text-2xl">
                      {`{${String(index + 1).padStart(2, "0")}}`}
                    </sup>
                  </button>
                </li>
              );
            })}
          </ul>
          <a
            className={cn(
              buttonVariants({ variant: "outline" }),
              "relative rounded-none px-4 shadow-none",
            )}
            href={action.href}
          >
            {action.label}
            <ArrowUpRightIcon className="transition-transform duration-300 motion-safe:group-hover/button:rotate-45" />
            <CornerMark className="-bottom-px -left-px" />
            <CornerMark className="-right-px -bottom-px scale-x-[-1]" />
            <CornerMark className="-top-px -left-px scale-y-[-1]" />
            <CornerMark className="-top-px -right-px scale-[-1]" />
          </a>
        </div>
      </div>
    </section>
  );
}
