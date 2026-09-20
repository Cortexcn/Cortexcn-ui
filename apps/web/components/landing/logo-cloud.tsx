import Image from "next/image";

import { Container } from "./primitives";

type Logo = {
  name: string;
  slug: string;
  /** Themed pairs render a light/dark svg swap; single-color logos render as-is. */
  themed: boolean;
};

const logos: Logo[] = [
  { name: "Claude", slug: "claude", themed: false },
  { name: "Cursor", slug: "cursor", themed: true },
  { name: "Codex", slug: "openai", themed: true },
  { name: "Windsurf", slug: "windsurf", themed: true },
  { name: "GitHub Copilot", slug: "copilot", themed: true },
  { name: "v0", slug: "v0", themed: true },
];

export function LogoCloud() {
  return (
    <section className="py-12 md:py-16" id="logos">
      <Container>
        <p className="flex items-center justify-center gap-1 text-center font-mono text-muted-foreground text-xs uppercase tracking-widest">
          Works with the agents you already use
          <span
            aria-hidden
            className="inline-block h-3 w-1.5 animate-caret-blink bg-current align-middle"
          />
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {logos.map((logo) =>
            logo.themed ? (
              <span
                className="inline-flex opacity-70 transition-opacity hover:opacity-100"
                key={logo.slug}
              >
                <Image
                  alt={logo.name}
                  className="h-6 w-auto dark:hidden"
                  height={24}
                  src={`/logos/${logo.slug}-light.svg`}
                  width={96}
                />
                <Image
                  alt=""
                  aria-hidden
                  className="hidden h-6 w-auto dark:block"
                  height={24}
                  src={`/logos/${logo.slug}-dark.svg`}
                  width={96}
                />
              </span>
            ) : (
              <span
                className="inline-flex opacity-70 transition-opacity hover:opacity-100"
                key={logo.slug}
              >
                <Image
                  alt={logo.name}
                  className="h-6 w-auto"
                  height={24}
                  src={`/logos/${logo.slug}.svg`}
                  width={96}
                />
              </span>
            ),
          )}
        </div>
      </Container>
    </section>
  );
}
