import type { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BentoImage {
  src: string;
  alt: string;
}

interface BentoAction {
  label: string;
  href: string;
}

interface BentoStat {
  value: string;
  /** Smaller text set beside the value, such as "%" or "+". */
  suffix?: string;
  label: string;
}

export interface FeatureBentoGridProps {
  /** The tall photo tile that opens the grid. */
  hero?: { image: BentoImage; label: string };
  /** Caption on the tall tile that shows the logo. */
  logoCaption?: string;
  stat?: BentoStat;
  /** The wide card with a large figure and one call to action. */
  highlight?: { value: string; label: string; action: BentoAction };
  /** The figure over a row of theme swatches. */
  themes?: BentoStat;
  /** The wide photo tile with an icon, title, and two-line caption. */
  closing?: { image: BentoImage; title: string; lines: [string, string] };
  className?: string;
}

/** Sample photo from Unsplash (free to use under the Unsplash License). */
function unsplash(id: string, width: number) {
  return `https://images.unsplash.com/photo-${id}?w=${width}&q=80&auto=format&fit=crop`;
}

const DEFAULT_HERO = {
  image: {
    src: unsplash("1521194263619-39ecc5b55c61", 1000),
    alt: "Sunlight falling in sharp shapes across a concrete wall",
  },
  label: "Designed with intent.",
};

const DEFAULT_STAT: BentoStat = {
  value: "100",
  suffix: "%",
  label: "Open code, copied into your project",
};

const DEFAULT_HIGHLIGHT = {
  value: "1 command",
  label: "Adds any block to your project with the shadcn CLI",
  action: { label: "Browse blocks", href: "#" },
};

const DEFAULT_THEMES: BentoStat = {
  value: "2",
  label: "Themes, light and dark, from one set of tokens",
};

const DEFAULT_CLOSING = {
  image: {
    src: unsplash("1706451822135-e7276f49b06e", 1200),
    alt: "A concrete staircase cut by diagonal light",
  },
  title: "Rapid development",
  lines: ["Build your interface faster", "with ready-to-use components"] as [
    string,
    string,
  ],
};

/** The Cortexcn mark in currentColor: two corner squares and a joined diagonal. */
function CortexcnMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 3 3"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M.17 0H.83A.17 .17 0 0 1 1 .17V.83A.17 .17 0 0 1 .83 1H.17A.17 .17 0 0 1 0 .83V.17A.17 .17 0 0 1 .17 0Z" />
      <path d="M2.17 2H2.83A.17 .17 0 0 1 3 2.17V2.83A.17 .17 0 0 1 2.83 3H2.17A.17 .17 0 0 1 2 2.83V2.17A.17 .17 0 0 1 2.17 2Z" />
      <path d="M2.17 0H2.83A.17 .17 0 0 1 3 .17V.83A.17 .17 0 0 1 2.83 1H2.32A.32 .32 0 0 0 2 1.32V1.83A.17 .17 0 0 1 1.83 2H1.32A.32 .32 0 0 0 1 2.32V2.83A.17 .17 0 0 1 .83 3H.17A.17 .17 0 0 1 0 2.83V2.17A.17 .17 0 0 1 .17 2H.68A.32 .32 0 0 0 1 1.68V1.17A.17 .17 0 0 1 1.17 1H1.68A.32 .32 0 0 0 2 .68V.17A.17 .17 0 0 1 2.17 0Z" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 6v6l4 2" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

const cardClassName =
  "rounded-3xl bg-card text-card-foreground shadow-xs ring-1 ring-foreground/10";

/** A muted tile with the mark in the middle, in place of a product shot. */
function LogoTile({
  className,
  markClassName,
  children,
}: {
  className?: string;
  markClassName?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-3xl border bg-muted",
        className,
      )}
    >
      <CortexcnMark className={cn("size-16 text-foreground", markClassName)} />
      {children}
    </div>
  );
}

function Photo({ image, width }: { image: BentoImage; width: number }) {
  return (
    // biome-ignore lint/performance/noImgElement: framework-agnostic registry block
    <img
      alt={image.alt}
      className="absolute inset-0 size-full object-cover"
      decoding="async"
      height={Math.round(width * 0.75)}
      loading="lazy"
      src={image.src}
      width={width}
    />
  );
}

/** Theme tokens drawn as overlapping swatches. */
const SWATCHES = [
  "bg-background",
  "bg-muted",
  "bg-secondary",
  "bg-primary",
  "bg-foreground",
];

export function FeatureBentoGrid({
  hero = DEFAULT_HERO,
  logoCaption = "Build your interface with open code you can read, change, and keep.",
  stat = DEFAULT_STAT,
  highlight = DEFAULT_HIGHLIGHT,
  themes = DEFAULT_THEMES,
  closing = DEFAULT_CLOSING,
  className,
}: FeatureBentoGridProps) {
  return (
    <section className={cn("w-full px-6 py-24 sm:py-32", className)}>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12">
        <div className="relative h-60 overflow-hidden rounded-3xl bg-muted md:col-span-2 md:row-span-2 md:h-[400px] lg:col-span-4 lg:h-full">
          <Photo image={hero.image} width={1000} />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"
          />
          <p className="absolute bottom-6 left-6 z-10 font-medium text-lg text-white">
            {hero.label}
          </p>
          <span className="absolute top-6 right-6 z-10 flex size-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
            <CortexcnMark className="size-4" />
          </span>
        </div>

        <LogoTile
          className="h-60 md:col-span-2 md:row-span-2 md:h-[400px] lg:col-span-4 lg:h-full"
          markClassName="size-20 lg:size-24"
        >
          <h3 className="absolute right-6 bottom-6 left-6 text-balance font-medium text-sm leading-tight md:text-base lg:text-xl">
            {logoCaption}
          </h3>
        </LogoTile>

        <div
          className={cn(
            cardClassName,
            "flex flex-col justify-center gap-3 p-4 md:col-span-2 md:h-[192px] md:p-6 lg:col-span-2",
          )}
        >
          <p className="font-bold text-4xl tracking-tight lg:text-6xl">
            {stat.value}
            {stat.suffix && (
              <span className="align-top text-2xl md:text-xl lg:text-3xl">
                {stat.suffix}
              </span>
            )}
          </p>
          <p className="text-sm leading-tight">{stat.label}</p>
        </div>

        <LogoTile
          className="h-60 md:col-span-2 md:h-[192px] lg:col-span-2"
          markClassName="size-10"
        />

        <div className="flex flex-col justify-end gap-2 rounded-3xl bg-muted p-4 shadow-xs ring-1 ring-foreground/10 md:col-span-4 md:h-[300px] md:p-5 lg:col-span-4">
          <p className="text-4xl tracking-tight md:text-5xl lg:text-6xl">
            {highlight.value}
          </p>
          <p className="text-muted-foreground">{highlight.label}</p>
          <a
            className={cn(buttonVariants(), "mt-2 self-start")}
            href={highlight.action.href}
          >
            {highlight.action.label}
          </a>
        </div>

        <div
          className={cn(
            cardClassName,
            "flex flex-col justify-center gap-4 p-4 md:col-span-2 md:h-[300px] md:p-5 lg:col-span-3",
          )}
        >
          <div>
            <p className="font-bold text-4xl tracking-tight md:text-3xl lg:text-6xl">
              {themes.value}
              {themes.suffix && (
                <span className="align-top text-2xl md:text-xl lg:text-3xl">
                  {themes.suffix}
                </span>
              )}
            </p>
            <p className="mt-3 text-sm">{themes.label}</p>
          </div>
          <div aria-hidden="true" className="flex -space-x-2">
            {SWATCHES.map((swatch) => (
              <span
                className={cn(
                  "size-8 rounded-full border-2 border-card ring-1 ring-foreground/10 lg:size-10",
                  swatch,
                )}
                key={swatch}
              />
            ))}
          </div>
        </div>

        <LogoTile
          className="h-60 md:col-span-3 md:h-[300px] lg:col-span-5"
          markClassName="size-16 lg:size-20"
        />

        <div className="relative h-60 overflow-hidden rounded-3xl bg-muted md:col-span-3 md:h-[300px] lg:col-span-4">
          <Photo image={closing.image} width={1200} />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-transparent"
          />
          <div className="absolute inset-0 z-10 flex items-center p-4 text-white md:p-6">
            <div>
              <div className="mb-2 flex items-center gap-2 md:gap-3">
                <span className="flex size-6 items-center justify-center rounded-full bg-white/20 md:size-7">
                  <ClockIcon className="size-3 md:size-4" />
                </span>
                <h3 className="font-semibold text-base md:text-lg">
                  {closing.title}
                </h3>
              </div>
              <p className="text-sm opacity-90">
                {closing.lines[0]}
                <br />
                <span className="font-semibold">{closing.lines[1]}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
