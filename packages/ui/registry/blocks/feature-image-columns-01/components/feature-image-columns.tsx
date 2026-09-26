import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeatureAction {
  label: string;
  href: string;
}

export interface ImageColumnFeature {
  title: string;
  description: string;
  image: { src: string; alt: string };
}

export interface FeatureImageColumnsProps {
  label?: string;
  heading?: string;
  description?: string;
  /** Three columns fill the row on medium screens and up. */
  features?: ImageColumnFeature[];
  /** One call to action shared by the whole section. */
  action?: FeatureAction;
  className?: string;
}

const IMAGE_BASE = "https://www.cortexcn.dev/svgs";

const DEFAULT_FEATURES: ImageColumnFeature[] = [
  {
    title: "See the whole picture",
    description:
      "Break any total into its parts so you can tell at a glance where the growth comes from.",
    image: { src: `${IMAGE_BASE}/pie-chart.svg`, alt: "Pie chart preview" },
  },
  {
    title: "Follow every flow",
    description:
      "Trace how visitors move from first click to checkout and spot where they drop off.",
    image: {
      src: `${IMAGE_BASE}/sankey-chart.svg`,
      alt: "Sankey chart preview",
    },
  },
  {
    title: "Track the goal",
    description:
      "Put the one number that matters front and center, with progress everyone understands.",
    image: { src: `${IMAGE_BASE}/gauge-chart.svg`, alt: "Gauge chart preview" },
  },
];

export function FeatureImageColumns({
  label = "Features",
  heading = "Answers your team can see",
  description = "Clear visuals for the questions that come up every week, ready to drop into your product.",
  features = DEFAULT_FEATURES,
  action = { label: "Explore the components", href: "#" },
  className,
}: FeatureImageColumnsProps) {
  return (
    <section className={cn("px-6 py-24 sm:py-32", className)}>
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="font-medium text-muted-foreground text-sm">{label}</p>
          <h2 className="mt-4 text-balance font-semibold text-4xl tracking-tight sm:text-5xl">
            {heading}
          </h2>
          <p className="mt-5 text-balance text-lg text-muted-foreground">
            {description}
          </p>
        </div>

        <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8 lg:mt-20">
          {features.map((feature) => (
            <li className="text-center" key={feature.title}>
              {/* biome-ignore lint/performance/noImgElement: framework-agnostic registry block */}
              <img
                alt={feature.image.alt}
                className="aspect-4/3 w-full rounded-2xl border bg-muted object-cover object-top"
                decoding="async"
                height={600}
                loading="lazy"
                src={feature.image.src}
                width={800}
              />
              <h3 className="mt-8 font-semibold text-xl tracking-tight">
                {feature.title}
              </h3>
              <p className="mx-auto mt-2 max-w-xs text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-14 flex justify-center lg:mt-20">
          <a
            className={cn(buttonVariants({ size: "lg" }), "h-11 px-6")}
            href={action.href}
          >
            {action.label}
          </a>
        </div>
      </div>
    </section>
  );
}
