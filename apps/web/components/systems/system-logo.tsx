import Image from "next/image";
import { CortexcnLogo } from "@/components/icons/cortexcn";
import { cn } from "@/lib/utils";

/** No data-theme: the base Cortexcn tokens. */
export const BASE_SYSTEM = "cortexcn";

interface Logo {
  /** Width over height, from the SVG's viewBox. */
  ratio: number;
  /** svgl has a version for dark backgrounds, saved as `<id>-dark.svg`. */
  dark?: boolean;
  /** Dark ink with no dark version, so it sits on a light chip in dark mode. */
  chip?: boolean;
}

/**
 * Company logos from svgl (https://svgl.app), saved in
 * public/logos/design-systems. Each logo belongs to its company and only
 * names the system here; the systems are unofficial and not endorsed. A
 * system svgl has no logo for shows a swatch in its own colors instead.
 */
const LOGOS: Record<string, Logo> = {
  airbnb: { ratio: 0.93 },
  claude: { ratio: 1 },
  discord: { ratio: 1.29 },
  figma: { ratio: 0.68 },
  framer: { ratio: 0.67, dark: true },
  ibm: { ratio: 2.5 },
  linear: { ratio: 1 },
  mintlify: { ratio: 1 },
  mongodb: { ratio: 0.47, dark: true },
  notion: { ratio: 0.96 },
  posthog: { ratio: 1.67, chip: true },
  raycast: { ratio: 1 },
  resend: { ratio: 1, dark: true },
  sanity: { ratio: 1, dark: true },
  sentry: { ratio: 1.13, chip: true },
  stripe: { ratio: 1 },
  uber: { ratio: 2.88, dark: true },
  vercel: { ratio: 1.15, dark: true },
  warp: { ratio: 1, chip: true },
};

const BOXES = {
  sm: { width: 28, height: 20, swatch: "size-4.5", dot: "size-2" },
  lg: { width: 56, height: 40, swatch: "size-9", dot: "size-4" },
} as const;

/** Room a chip's padding takes on each side. */
const CHIP_INSET = 2;

/**
 * The mark beside a design system's name: its company logo, Cortexcn's own
 * mark for the base tokens, or a tile in the system's background and primary
 * color. Always decorative; the name next to it says which system it is.
 */
export function SystemMark({
  id,
  size = "sm",
}: {
  id: string;
  size?: keyof typeof BOXES;
}) {
  const box = BOXES[size];
  const slotStyle = { width: box.width, height: box.height };
  const slotClassName = "flex shrink-0 items-center justify-center";

  if (id === BASE_SYSTEM) {
    return (
      <span aria-hidden="true" className={slotClassName} style={slotStyle}>
        <CortexcnLogo size={box.height - 2} theme="auto" />
      </span>
    );
  }

  const logo = LOGOS[id];
  if (!logo) {
    return (
      <span aria-hidden="true" className={slotClassName} style={slotStyle}>
        <span
          className={cn(
            "flex items-center justify-center border border-border bg-background",
            box.swatch,
          )}
          data-theme={id}
        >
          <span className={cn("bg-primary", box.dot)} />
        </span>
      </span>
    );
  }

  // Fit the logo inside the slot, keeping its shape.
  const inset = logo.chip ? CHIP_INSET * 2 : 0;
  const height = Math.round(
    Math.min(box.height - inset, (box.width - inset) / logo.ratio),
  );
  const width = Math.round(height * logo.ratio);
  const image = (src: string, className?: string) => (
    <Image
      alt=""
      className={className}
      height={height}
      src={src}
      style={{ width, height }}
      unoptimized
      width={width}
    />
  );

  return (
    <span aria-hidden="true" className={slotClassName} style={slotStyle}>
      <span className={cn("flex", logo.chip && "dark:bg-white dark:p-0.5")}>
        {logo.dark ? (
          <>
            {image(`/logos/design-systems/${id}.svg`, "dark:hidden")}
            {image(`/logos/design-systems/${id}-dark.svg`, "hidden dark:block")}
          </>
        ) : (
          image(`/logos/design-systems/${id}.svg`)
        )}
      </span>
    </span>
  );
}
