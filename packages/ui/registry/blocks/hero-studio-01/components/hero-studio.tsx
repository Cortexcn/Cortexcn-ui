"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Cta, type CtaProps } from "./hero-cta";

export interface HeroStudioProps {
  /** Short line in the left column, set against the bottom of the copy. */
  tagline?: string;
  title?: string;
  description?: string;
  /** Wide photo under the copy, faded into the page at its top edge. */
  landscapeImage?: string;
  landscapeAlt?: string;
  animation?: "none" | "subtle";
  primaryCTA?: CtaProps;
  /** Shown as a text link unless it sets its own variant. */
  secondaryCTA?: CtaProps;
  variant?: "standard" | "compact";
}

const DEFAULTS = {
  tagline: "Brand, product, and story for teams building something new",
  title:
    "A creative studio for founders who want their work to feel considered.",
  description:
    "We help early stage companies turn rough ideas into clear identities, thoughtful digital products, and messaging people remember. Strategy, design, and execution in one place.",
  // Sample photo from Unsplash (free to use under the Unsplash License).
  landscapeImage:
    "https://images.unsplash.com/photo-1578301978018-3005759f48f7?q=80&w=1600&auto=format&fit=crop",
  landscapeAlt: "A painted landscape of hills and autumn trees",
  primaryCTA: {
    ctaEnabled: false,
    text: "Start a project",
    link: "",
    variant: "default",
  },
  secondaryCTA: {
    ctaEnabled: false,
    text: "View work",
    link: "",
    variant: "link",
  },
} satisfies HeroStudioProps;

const variantStyles = {
  standard: {
    copy: "pt-20 pb-10 sm:pt-28 sm:pb-12 lg:pt-32",
    tagline: "text-sm sm:text-base",
    title: "text-3xl sm:text-4xl md:text-5xl",
    description: "text-sm sm:text-base",
    header: "gap-6 sm:gap-8",
    grid: "gap-10",
  },
  compact: {
    copy: "pt-14 pb-8 sm:pt-20 sm:pb-10 lg:pt-24",
    tagline: "text-sm",
    title: "text-2xl sm:text-3xl md:text-4xl",
    description: "text-sm",
    header: "gap-4 sm:gap-5",
    grid: "gap-8",
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
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
  },
};

const mediaItem: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
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
 * A short tagline beside a serif headline, a pitch, and up to two calls to
 * action, over a wide landscape photo that fades into the page.
 */
export function HeroStudio({
  tagline = DEFAULTS.tagline,
  title = DEFAULTS.title,
  description = DEFAULTS.description,
  landscapeImage = DEFAULTS.landscapeImage,
  landscapeAlt = DEFAULTS.landscapeAlt,
  animation = "subtle",
  primaryCTA = DEFAULTS.primaryCTA,
  secondaryCTA = DEFAULTS.secondaryCTA,
  variant = "standard",
}: Readonly<HeroStudioProps>) {
  const reduce = useReducedMotion();
  const animate = animation === "subtle" && !reduce;
  const vs = variantStyles[variant];
  const hasCtas = primaryCTA?.ctaEnabled || secondaryCTA?.ctaEnabled;

  return (
    <section className="relative isolate w-full overflow-hidden bg-background">
      <motion.div
        className={cn(
          "relative z-10 mx-auto grid max-w-7xl grid-cols-1 px-6 lg:grid-cols-12",
          vs.copy,
          vs.grid,
        )}
        initial={animate ? "hidden" : false}
        variants={animate ? container : undefined}
        viewport={{ once: true, margin: "-80px" }}
        whileInView={animate ? "visible" : undefined}
      >
        <Reveal
          active={animate}
          className="flex lg:col-span-4 lg:col-start-1 lg:items-end lg:self-stretch"
        >
          {tagline && (
            <p
              className={cn(
                "max-w-xs text-balance text-muted-foreground leading-relaxed tracking-tight",
                vs.tagline,
              )}
            >
              {tagline}
            </p>
          )}
        </Reveal>

        <Reveal
          active={animate}
          className={cn(
            "flex flex-col items-start lg:col-span-6 lg:col-start-7",
            vs.header,
          )}
        >
          {title && (
            <h1
              className={cn(
                "text-balance font-normal font-serif text-foreground tracking-tight",
                vs.title,
              )}
            >
              {title}
            </h1>
          )}
          {description && (
            <p
              className={cn(
                "max-w-xl text-balance text-muted-foreground leading-relaxed",
                vs.description,
              )}
            >
              {description}
            </p>
          )}
          {hasCtas && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              {primaryCTA?.ctaEnabled && <Cta cta={primaryCTA} />}
              {secondaryCTA?.ctaEnabled && (
                <Cta
                  cta={{
                    ...secondaryCTA,
                    variant: secondaryCTA.variant ?? "link",
                  }}
                />
              )}
            </div>
          )}
        </Reveal>
      </motion.div>

      {landscapeImage && (
        <Reveal active={animate} className="w-full" variants={mediaItem}>
          <div className="relative w-full overflow-hidden">
            <div className="mask-t-from-80% mask-t-to-95% relative overflow-hidden rounded-b-sm">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-10 bg-background/15 mix-blend-overlay dark:bg-background/30"
              />
              {/* biome-ignore lint/performance/noImgElement: framework-agnostic registry block */}
              <img
                alt={landscapeAlt}
                className="aspect-2/1 w-full object-cover object-center outline outline-black/10 sm:aspect-9/4 dark:outline-white/10 dark:brightness-[0.97] dark:saturate-[0.92]"
                decoding="async"
                height={711}
                src={landscapeImage}
                width={1600}
              />
            </div>
          </div>
        </Reveal>
      )}
    </section>
  );
}
