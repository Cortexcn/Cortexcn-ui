"use client";

import { motion } from "motion/react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ServicesAction {
  label: string;
  href: string;
}

export interface ServiceItem {
  title: string;
  href: string;
  image: { src: string; alt: string };
}

export interface ServicesImageGridProps {
  heading?: string;
  description?: string;
  action?: ServicesAction;
  /** The first two are tall cards; the rest sit three to a row beneath them. */
  services?: ServiceItem[];
  className?: string;
}

/** The flower paintings from the Cortexcn site. */
const ART_BASE = "https://www.cortexcn.dev/images/ui-home";

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    title: "Landing pages",
    href: "#",
    image: {
      src: `${ART_BASE}/watercolor-wildflowers.webp`,
      alt: "A watercolor of tall wildflowers in soft blue and gold",
    },
  },
  {
    title: "Websites",
    href: "#",
    image: {
      src: `${ART_BASE}/wildflower-meadow.webp`,
      alt: "A painted meadow of wildflowers bending in the wind",
    },
  },
  {
    title: "Web applications",
    href: "#",
    image: {
      src: `${ART_BASE}/blue-white-flowers.webp`,
      alt: "A painting of white flowers against a pale blue sky",
    },
  },
  {
    title: "E-commerce stores",
    href: "#",
    image: {
      src: `${ART_BASE}/pastel-daisies.webp`,
      alt: "A painting of daisies in pastel greens and creams",
    },
  },
  {
    title: "AI pipelines",
    href: "#",
    image: {
      src: `${ART_BASE}/white-blossoms.webp`,
      alt: "A painting of white blossoms on a leafy branch",
    },
  },
];

/** How many services lead the grid as tall cards. */
const FEATURED_COUNT = 2;

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

function ServiceCard({
  service,
  featured,
}: {
  service: ServiceItem;
  featured: boolean;
}) {
  return (
    <motion.a
      className="group block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      href={service.href}
      transition={{ duration: 0.2, ease: "easeOut" }}
      whileHover={{ opacity: 0.8 }}
    >
      <Card
        className={cn("relative py-0", featured ? "aspect-3/4" : "aspect-4/3")}
      >
        {/* biome-ignore lint/performance/noImgElement: framework-agnostic registry block */}
        <img
          alt={service.image.alt}
          className="absolute inset-0 size-full object-cover"
          decoding="async"
          height={featured ? 1067 : 450}
          loading="lazy"
          src={service.image.src}
          width={featured ? 800 : 600}
        />
        {/* Keeps the title readable on light photos. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-black/60 to-transparent"
        />
        <CardHeader className={cn("relative", featured ? "p-6" : "p-4")}>
          <CardTitle
            className={cn(
              "pr-4 font-semibold text-white",
              featured ? "text-base" : "text-sm",
            )}
          >
            {service.title}
          </CardTitle>
          <CardAction>
            <ArrowUpRightIcon
              className={cn(
                "text-white transition-transform duration-200 ease-out motion-safe:group-hover:scale-110",
                featured ? "size-6" : "size-5",
              )}
            />
          </CardAction>
        </CardHeader>
      </Card>
    </motion.a>
  );
}

export function ServicesImageGrid({
  heading = "What we build",
  description = "Landing pages, websites, and full web apps, designed and built by one small team. Tell us what you need and get a written quote.",
  action = { label: "View all services", href: "#" },
  services = DEFAULT_SERVICES,
  className,
}: ServicesImageGridProps) {
  return (
    <section className={cn("px-6 py-24 sm:py-32", className)}>
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-3">
        <div className="flex flex-col justify-between gap-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-balance font-semibold text-4xl tracking-tight md:text-5xl">
              {heading}
            </h2>
            <p className="max-w-xs text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
          <a
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-fit gap-1.5 px-4",
            )}
            href={action.href}
          >
            {action.label}
            <ArrowUpRightIcon />
          </a>
        </div>

        <ul className="grid gap-4 sm:grid-cols-6 lg:col-span-2">
          {services.map((service, index) => {
            const featured = index < FEATURED_COUNT;
            return (
              <li
                className={featured ? "sm:col-span-3" : "sm:col-span-2"}
                key={service.title}
              >
                <ServiceCard featured={featured} service={service} />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
