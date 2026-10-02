import { Marquee } from "@cortexcn/ui/components/marquee";
import Image from "next/image";

import { Container } from "./primitives";

interface StackLogo {
  name: string;
  /** File stem in /logos/stack. Themed logos ship `-light` and `-dark` files. */
  slug: string;
  themed: boolean;
  /** Wordmarks already spell the name; icons get a text label beside them. */
  kind: "wordmark" | "icon";
  /** Intrinsic viewBox ratio (width / height). */
  ratio: number;
  /** Rendered height in px, tuned per logo so they read at a similar size. */
  height: number;
}

/** The stack the components are built on, and the editors and agents that install them. */
const LOGOS: StackLogo[] = [
  {
    name: "Next.js",
    slug: "nextjs",
    themed: true,
    kind: "icon",
    ratio: 1,
    height: 22,
  },
  {
    name: "React",
    slug: "react",
    themed: true,
    kind: "wordmark",
    ratio: 600 / 180.32,
    height: 24,
  },
  {
    name: "Tailwind CSS",
    slug: "tailwindcss",
    themed: true,
    kind: "wordmark",
    ratio: 262 / 33,
    height: 16,
  },
  {
    name: "shadcn/ui",
    slug: "shadcn",
    themed: true,
    kind: "icon",
    ratio: 1,
    height: 20,
  },
  {
    name: "Claude",
    slug: "claude",
    themed: true,
    kind: "wordmark",
    ratio: 512 / 110,
    height: 20,
  },
  {
    name: "Cursor",
    slug: "cursor",
    themed: true,
    kind: "icon",
    ratio: 466.73 / 532.09,
    height: 22,
  },
  {
    name: "OpenAI",
    slug: "openai",
    themed: true,
    kind: "wordmark",
    ratio: 956.9 / 260.8,
    height: 22,
  },
  {
    name: "VS Code",
    slug: "vscode",
    themed: false,
    kind: "icon",
    ratio: 1,
    height: 20,
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

function LogoItem({ logo }: { logo: StackLogo }) {
  return (
    <span className="flex shrink-0 items-center gap-2 opacity-75 grayscale">
      {logo.themed ? (
        <>
          <LogoImage className="dark:hidden" logo={logo} variant="light" />
          <LogoImage className="hidden dark:block" logo={logo} variant="dark" />
        </>
      ) : (
        <LogoImage logo={logo} />
      )}
      {logo.kind === "icon" ? (
        <span className="whitespace-nowrap font-medium text-foreground text-lg tracking-[-0.03em]">
          {logo.name}
        </span>
      ) : null}
    </span>
  );
}

/** A slow, edge-faded row of the tools Cortexcn works with. */
export function StackTicker() {
  return (
    <Container className="mt-16 md:mt-20">
      <p className="text-center text-muted-foreground text-sm">
        Built on the stack you already use, and ready for your AI agent
      </p>
      <p className="sr-only">{LOGOS.map((logo) => logo.name).join(", ")}</p>
      <div aria-hidden="true" className="mt-6">
        <Marquee
          className="p-0 [--duration:45s] [--gap:4rem] [mask-image:linear-gradient(to_right,transparent,black_12.5%,black_87.5%,transparent)] motion-reduce:[&_.animate-marquee]:[animation-play-state:paused]"
          repeat={4}
        >
          {LOGOS.map((logo) => (
            <LogoItem key={logo.slug} logo={logo} />
          ))}
        </Marquee>
      </div>
    </Container>
  );
}
