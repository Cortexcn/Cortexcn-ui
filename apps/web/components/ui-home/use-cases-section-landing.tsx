import { LogosCarousel } from "@bklitui/ui/components/logos-carousel";
import Image from "next/image";

import { AppWindow, RegistryTag } from "./app-window";

const NAV_ITEMS = ["Product", "Pricing", "Docs"];

interface StackLogo {
  name: string;
  /** File stem in /logos/stack. Themed logos ship `-light` and `-dark` files. */
  slug: string;
  themed: boolean;
  /** Icons get the name beside them; wordmarks already spell it. */
  kind: "wordmark" | "icon";
  /** Intrinsic viewBox ratio (width / height). */
  ratio: number;
  /** Rendered height in px, tuned so the marks read at a similar size. */
  height: number;
}

/** The stack the page is built on, and the editors and agents that work with it. */
const LOGOS: StackLogo[] = [
  {
    name: "Next.js",
    slug: "nextjs",
    themed: true,
    kind: "icon",
    ratio: 1,
    height: 16,
  },
  {
    name: "React",
    slug: "react",
    themed: true,
    kind: "wordmark",
    ratio: 600 / 180.32,
    height: 17,
  },
  {
    name: "shadcn/ui",
    slug: "shadcn",
    themed: true,
    kind: "icon",
    ratio: 1,
    height: 15,
  },
  {
    name: "Vercel",
    slug: "vercel",
    themed: true,
    kind: "wordmark",
    ratio: 262 / 52,
    height: 12,
  },
  {
    name: "Claude",
    slug: "claude",
    themed: true,
    kind: "wordmark",
    ratio: 512 / 110,
    height: 15,
  },
  {
    name: "Cursor",
    slug: "cursor",
    themed: true,
    kind: "icon",
    ratio: 466.73 / 532.09,
    height: 16,
  },
  {
    name: "OpenAI",
    slug: "openai",
    themed: true,
    kind: "wordmark",
    ratio: 956.9 / 260.8,
    height: 16,
  },
  {
    name: "VS Code",
    slug: "vscode",
    themed: false,
    kind: "icon",
    ratio: 1,
    height: 15,
  },
];

function LogoImage({
  logo,
  variant,
  className,
}: {
  logo: StackLogo;
  variant?: "light" | "dark";
  className?: string;
}) {
  const file = variant ? `${logo.slug}-${variant}` : logo.slug;
  return (
    <Image
      alt=""
      className={className}
      height={logo.height}
      src={`/logos/stack/${file}.svg`}
      style={{ height: logo.height, width: "auto" }}
      unoptimized
      width={Math.round(logo.height * logo.ratio)}
    />
  );
}

function Logo({ logo }: { logo: StackLogo }) {
  return (
    <span className="flex items-center gap-1.5 opacity-80 grayscale">
      {logo.themed ? (
        <>
          <LogoImage className="dark:hidden" logo={logo} variant="light" />
          <LogoImage className="hidden dark:block" logo={logo} variant="dark" />
        </>
      ) : (
        <LogoImage logo={logo} />
      )}
      {logo.kind === "icon" ? (
        <span className="whitespace-nowrap font-medium text-[13px] text-foreground tracking-[-0.02em]">
          {logo.name}
        </span>
      ) : null}
    </span>
  );
}

const mockButtonClassName =
  "inline-flex h-8 items-center rounded-lg px-3.5 font-medium text-xs";

/**
 * A small product landing page: a nav bar, a hero, and a live logo carousel
 * cycling through the stack, the kind of page the blocks put together.
 */
export function UseCasesLandingWindow() {
  return (
    <AppWindow className="flex h-full flex-col" title="Landing">
      <div className="@container flex min-h-0 flex-1 flex-col">
        <div className="flex h-12 shrink-0 items-center gap-6 border-border border-b @md:px-5 px-4">
          <span className="flex items-center gap-2 font-medium text-sm">
            <span
              aria-hidden="true"
              className="size-4 rounded-[5px] bg-foreground"
            />
            Acme
          </span>
          <span className="@md:flex hidden items-center gap-5 text-[13px] text-muted-foreground">
            {NAV_ITEMS.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </span>
          <span className="ml-auto inline-flex h-7 items-center rounded-md bg-primary px-3 font-medium text-primary-foreground text-xs">
            Get started
          </span>
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden px-5 text-center">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_72%)]"
          />
          <span className="relative inline-flex items-center gap-2 rounded-full border border-border bg-background py-0.5 pr-2.5 pl-1 text-[11px] text-body">
            <span className="rounded-full bg-muted px-1.5 py-px font-medium text-foreground">
              New
            </span>
            Scheduled reports
          </span>
          <p className="relative @md:mt-4 mt-3.5 max-w-[24rem] text-balance font-medium @md:text-[28px] text-[22px] leading-[1.1] tracking-[-0.035em]">
            Every metric your team needs, on one screen.
          </p>
          <p className="relative mt-3 @sm:block hidden max-w-[21rem] text-pretty text-[13px] text-body leading-relaxed">
            Connect a data source and share a live dashboard in minutes.
          </p>
          <div className="relative mt-5 flex items-center gap-2">
            <span
              className={`${mockButtonClassName} bg-primary text-primary-foreground`}
            >
              Start building
            </span>
            <span
              className={`${mockButtonClassName} border border-border bg-background text-foreground`}
            >
              Book a demo
            </span>
          </div>
        </div>

        <div className="relative shrink-0 border-border border-t @md:px-6 px-4 pt-3 pb-3.5">
          <p className="text-center text-[11px] text-muted-foreground">
            Works with your stack
          </p>
          <p className="sr-only">{LOGOS.map((logo) => logo.name).join(", ")}</p>
          <div aria-hidden="true">
            <LogosCarousel
              className="mt-2 h-8 auto-rows-[100%] overflow-hidden @md:[--column-count:4] [--column-count:2]"
              columnCount={4}
            >
              {LOGOS.map((logo) => (
                <Logo key={logo.slug} logo={logo} />
              ))}
            </LogosCarousel>
          </div>
          <RegistryTag
            className="absolute -top-2 right-3"
            name="logos-carousel"
          />
        </div>
      </div>
    </AppWindow>
  );
}
