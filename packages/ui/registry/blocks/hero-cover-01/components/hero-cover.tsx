"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Cta, type CtaProps } from "./hero-cta";

export interface HeroCoverProps {
  title?: string;
  /** Small caps label beside the title, such as a founding year. */
  established?: string;
  description?: string;
  /** Full-bleed photo, darkened toward the bottom so the copy reads. */
  backgroundImage?: string;
  backgroundAlt?: string;
  animation?: "none" | "subtle";
  primaryCTA?: CtaProps;
  variant?: "standard" | "compact";
}

const DEFAULTS = {
  title: "Aspen Ridge",
  established: "Est. 2019",
  description:
    "A secluded mountain retreat set among the aspens, with floor-to-ceiling windows framing uninterrupted views of the Rockies. Wake to still water, quiet forest, and nothing on the schedule.",
  // Sample photo from Unsplash (free to use under the Unsplash License).
  backgroundImage:
    "https://images.unsplash.com/photo-1626849440347-a491d028c0cf?q=80&w=1631&auto=format&fit=crop",
  backgroundAlt: "A calm mountain lake at dusk beneath a forested ridge",
  primaryCTA: {
    ctaEnabled: true,
    text: "Reserve a Stay",
    link: "",
    size: "default",
  },
} satisfies HeroCoverProps;

const variantStyles = {
  standard: {
    section: "min-h-[560px] sm:min-h-[600px]",
    padding: "px-6 py-10 sm:px-10 sm:py-12",
    title: "text-4xl sm:text-5xl md:text-6xl",
    established: "text-xs sm:text-sm",
    description: "max-w-lg text-sm sm:text-base",
    copy: "gap-5 sm:gap-6",
  },
  compact: {
    section: "min-h-[440px] sm:min-h-[480px]",
    padding: "px-6 py-8 sm:px-8 sm:py-10",
    title: "text-3xl sm:text-4xl md:text-5xl",
    established: "text-[0.65rem] sm:text-xs",
    description: "max-w-md text-sm",
    copy: "gap-4 sm:gap-5",
  },
} as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const media: Variants = {
  hidden: { opacity: 0, scale: 1.08 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
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
 * A full-bleed photo with the title, a small label, a short description, and
 * one light call to action set along its bottom edge.
 */
export function HeroCover({
  title = DEFAULTS.title,
  established = DEFAULTS.established,
  description = DEFAULTS.description,
  backgroundImage = DEFAULTS.backgroundImage,
  backgroundAlt = DEFAULTS.backgroundAlt,
  animation = "subtle",
  primaryCTA = DEFAULTS.primaryCTA,
  variant = "standard",
}: Readonly<HeroCoverProps>) {
  const reduce = useReducedMotion();
  const animate = animation === "subtle" && !reduce;
  const vs = variantStyles[variant];

  return (
    <section
      className={cn(
        "relative isolate flex w-full flex-col justify-end overflow-hidden bg-background",
        vs.section,
      )}
    >
      {backgroundImage && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* biome-ignore lint/performance/noImgElement: framework-agnostic registry block */}
          <motion.img
            alt={backgroundAlt}
            className="size-full object-cover"
            decoding="async"
            height={1088}
            initial={animate ? "hidden" : false}
            src={backgroundImage}
            variants={animate ? media : undefined}
            viewport={{ once: true, margin: "-80px" }}
            whileInView={animate ? "visible" : undefined}
            width={1631}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-black/70 via-black/25 to-black/10"
          />
        </div>
      )}

      <motion.div
        className={cn(
          "relative z-10 flex w-full flex-col gap-6 sm:flex-row sm:items-end sm:justify-between",
          vs.padding,
        )}
        initial={animate ? "hidden" : false}
        variants={animate ? container : undefined}
        viewport={{ once: true, margin: "-80px" }}
        whileInView={animate ? "visible" : undefined}
      >
        <Reveal active={animate} className="min-w-0">
          <div className={cn("flex flex-col", vs.copy)}>
            {title && (
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h1
                  className={cn(
                    "text-balance font-normal text-white tracking-tight",
                    vs.title,
                  )}
                >
                  {title}
                </h1>
                {established && (
                  <span
                    className={cn(
                      "font-medium text-white/70 uppercase tracking-widest",
                      vs.established,
                    )}
                  >
                    {established}
                  </span>
                )}
              </div>
            )}
            {description && (
              <p
                className={cn(
                  "text-balance text-white/80 leading-relaxed",
                  vs.description,
                )}
              >
                {description}
              </p>
            )}
          </div>
        </Reveal>

        {primaryCTA?.ctaEnabled && (
          <Reveal active={animate}>
            <Cta className="shrink-0" cta={primaryCTA} invert />
          </Reveal>
        )}
      </motion.div>
    </section>
  );
}
