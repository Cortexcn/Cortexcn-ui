"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Cta, type CtaProps } from "./hero-cta";
import { DashboardDemo } from "./hero-dashboard-demo";

export interface HeroDashboardProps {
  title?: string;
  /** Starts on its own line under the title. */
  titleLine2?: string;
  description?: string;
  /** Photo behind the product preview, softened by a gradient. */
  washImage?: string;
  animation?: "none" | "subtle";
  primaryCTA?: CtaProps;
  variant?: "standard" | "compact";
}

const DEFAULTS = {
  title: "Every metric that matters,",
  titleLine2: "in one clear view.",
  description:
    "Track revenue, users, and activity in real time, with no setup and no spreadsheets.",
  // Sample photo from Unsplash (free to use under the Unsplash License).
  washImage:
    "https://images.unsplash.com/photo-1578301978018-3005759f48f7?q=80&w=1144&auto=format&fit=crop",
  primaryCTA: {
    ctaEnabled: true,
    text: "Start free",
    link: "",
    variant: "default",
    size: "default",
  },
} satisfies HeroDashboardProps;

const variantStyles = {
  standard: {
    section: "py-20 sm:py-28",
    title: "text-3xl sm:text-4xl md:text-5xl",
    description: "max-w-md text-sm sm:text-base",
    header: "gap-5",
    content: "gap-14 sm:gap-20",
  },
  compact: {
    section: "py-14 sm:py-20",
    title: "text-2xl sm:text-3xl md:text-4xl",
    description: "max-w-sm text-sm",
    header: "gap-4",
    content: "gap-10 sm:gap-14",
  },
} as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const mediaItem: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

function Reveal({
  active,
  variants,
  className,
  children,
}: Readonly<{
  active: boolean;
  variants?: Variants;
  className?: string;
  children: ReactNode;
}>) {
  if (!active) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={variants ?? item}>
      {children}
    </motion.div>
  );
}

/**
 * A serif headline, a short pitch, and one call to action over a framed
 * product dashboard on a soft photo wash.
 */
export function HeroDashboard({
  title = DEFAULTS.title,
  titleLine2 = DEFAULTS.titleLine2,
  description = DEFAULTS.description,
  washImage = DEFAULTS.washImage,
  animation = "subtle",
  primaryCTA = DEFAULTS.primaryCTA,
  variant = "standard",
}: Readonly<HeroDashboardProps>) {
  const reduce = useReducedMotion();
  const animate = animation === "subtle" && !reduce;
  const vs = variantStyles[variant];

  return (
    <section className="relative isolate w-full overflow-hidden bg-background">
      <motion.div
        className={cn(
          "relative z-10 mx-auto flex max-w-6xl flex-col px-6",
          vs.section,
          vs.content,
        )}
        initial={animate ? "hidden" : false}
        variants={animate ? container : undefined}
        viewport={{ once: true, margin: "-80px" }}
        whileInView={animate ? "visible" : undefined}
      >
        <Reveal
          active={animate}
          className={cn("flex max-w-2xl flex-col items-start", vs.header)}
        >
          {title && (
            <h1
              className={cn(
                "text-balance font-normal font-serif text-foreground tracking-tight",
                vs.title,
              )}
            >
              {title}
              {titleLine2 && (
                <>
                  <br />
                  {titleLine2}
                </>
              )}
            </h1>
          )}
          {description && (
            <p
              className={cn(
                "text-balance text-muted-foreground",
                vs.description,
              )}
            >
              {description}
            </p>
          )}
          <Cta cta={primaryCTA} />
        </Reveal>

        <Reveal active={animate} className="w-full" variants={mediaItem}>
          <div className="relative w-full overflow-hidden rounded-md outline outline-black/10 dark:outline-white/10">
            {washImage && (
              // biome-ignore lint/performance/noImgElement: framework-agnostic registry block
              <img
                alt=""
                aria-hidden="true"
                className="absolute inset-0 size-full object-cover"
                decoding="async"
                height={760}
                src={washImage}
                width={1144}
              />
            )}
            <div className="absolute inset-0 bg-linear-to-b from-background/30 via-background/10 to-background/40" />
            <div className="relative flex items-center justify-center px-6 py-12 sm:px-12 sm:py-16">
              <DashboardDemo />
            </div>
          </div>
        </Reveal>
      </motion.div>
    </section>
  );
}
