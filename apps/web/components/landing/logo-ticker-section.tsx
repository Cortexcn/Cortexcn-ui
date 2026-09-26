import { Marquee } from "@bklitui/ui/components/marquee";
import Image from "next/image";

import { DashedLine, FrameCorner } from "./dashed-line";
import { Container } from "./primitives";

interface StackLogo {
  name: string;
  slug: string;
  /** Wordmarks already contain the name; icons get a text label beside them. */
  kind: "wordmark" | "icon";
  /**
   * Themed logos ship `<slug>-light.svg` (for light backgrounds) and
   * `<slug>-dark.svg` (for dark backgrounds). Others use one `<slug>.svg`.
   */
  themed: boolean;
  /** Intrinsic viewBox ratio (width / height). */
  ratio: number;
}

/** Tools Cortexcn is built on and the AI coding tools it works with. */
const LOGOS: StackLogo[] = [
  {
    name: "Vercel",
    slug: "vercel",
    kind: "wordmark",
    themed: true,
    ratio: 262 / 52,
  },
  { name: "Next.js", slug: "nextjs", kind: "icon", themed: true, ratio: 1 },
  {
    name: "React",
    slug: "react",
    kind: "wordmark",
    themed: true,
    ratio: 600 / 180.77,
  },
  {
    name: "Tailwind CSS",
    slug: "tailwindcss",
    kind: "wordmark",
    themed: true,
    ratio: 262 / 33,
  },
  { name: "shadcn/ui", slug: "shadcn", kind: "icon", themed: true, ratio: 1 },
  { name: "VS Code", slug: "vscode", kind: "icon", themed: false, ratio: 1 },
  {
    name: "Cursor",
    slug: "cursor",
    kind: "icon",
    themed: true,
    ratio: 466.73 / 532.09,
  },
  {
    name: "Claude",
    slug: "claude",
    kind: "wordmark",
    themed: true,
    ratio: 512 / 110,
  },
  {
    name: "OpenAI",
    slug: "openai",
    kind: "wordmark",
    themed: true,
    ratio: 956.9 / 260.8,
  },
];

const WORDMARK_HEIGHT = 26;
const ICON_HEIGHT = 26;
const LOGO_DIR = "/logos/stack";

function LogoImage({
  logo,
  src,
  height,
  className,
}: {
  logo: StackLogo;
  src: string;
  height: number;
  className?: string;
}) {
  return (
    <Image
      alt={logo.kind === "wordmark" ? logo.name : ""}
      className={className}
      height={height}
      // Copies scroll in from off-screen; lazy loading would pop them in late.
      loading="eager"
      src={src}
      style={{ height, width: "auto" }}
      unoptimized
      width={Math.round(height * logo.ratio)}
    />
  );
}

function StackLogoMark({ logo }: { logo: StackLogo }) {
  const height = logo.kind === "wordmark" ? WORDMARK_HEIGHT : ICON_HEIGHT;
  const mark = logo.themed ? (
    <>
      <LogoImage
        className="dark:hidden"
        height={height}
        logo={logo}
        src={`${LOGO_DIR}/${logo.slug}-light.svg`}
      />
      <LogoImage
        className="hidden dark:block"
        height={height}
        logo={logo}
        src={`${LOGO_DIR}/${logo.slug}-dark.svg`}
      />
    </>
  ) : (
    <LogoImage
      height={height}
      logo={logo}
      src={`${LOGO_DIR}/${logo.slug}.svg`}
    />
  );

  return (
    <span className="flex shrink-0 items-center gap-2.5 opacity-75 transition-opacity hover:opacity-100">
      {mark}
      {logo.kind === "icon" ? (
        <span className="whitespace-nowrap font-semibold text-foreground text-xl tracking-tight">
          {logo.name}
        </span>
      ) : null}
    </span>
  );
}

export function LogoTickerSection() {
  return (
    <section aria-labelledby="logo-ticker-title" className="relative w-full">
      <Container className="relative">
        <DashedLine className="top-0" orientation="horizontal" />
        <DashedLine className="left-0 hidden lg:block" orientation="vertical" />
        <DashedLine
          className="right-0 hidden lg:block"
          orientation="vertical"
        />
        <FrameCorner className="-top-1 -left-1 hidden lg:block" />
        <FrameCorner className="-top-1 -right-1 hidden lg:block" />

        <div className="py-10 lg:px-10">
          <p
            className="text-center text-muted-foreground text-sm"
            id="logo-ticker-title"
          >
            Works with the stack and AI tools you already use
          </p>

          <div className="relative mt-8 overflow-hidden">
            <Marquee
              className="p-0 [--duration:45s] [--gap:5rem] motion-reduce:[&>div]:[animation-play-state:paused]"
              pauseOnHover
              repeat={3}
            >
              {LOGOS.map((logo) => (
                <StackLogoMark key={logo.slug} logo={logo} />
              ))}
            </Marquee>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-linear-to-r from-background to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 w-1/5 bg-linear-to-l from-background to-transparent"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
