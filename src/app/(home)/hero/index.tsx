import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

export function Hero() {
  return (
    <section
      id="studio"
      className="flex min-h-svh flex-col items-center justify-center px-4 py-24 text-center sm:py-32"
    >
      <h1
        className="mt-4 font-heading text-6xl leading-[0.9] font-black tracking-tight text-balance sm:text-8xl"
        aria-label="Cortexcn"
      >
        Cortexcn
      </h1>

      <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
        We build pixel-perfect web products for founders.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm">
        <a
          href="mailto:studio@cortexcn.studio"
          className="group inline-flex items-center gap-2 border border-foreground bg-foreground px-4 py-2 text-background transition-colors hover:bg-transparent hover:text-foreground"
        >
          Start a project
          <ArrowUpRight
            weight="bold"
            className="size-4 transition-transform group-hover:-translate-y-px group-hover:translate-x-px"
          />
        </a>
        <a
          href="https://syedmoinuddin.com"
          target="_blank"
          rel="noopener"
          className="group inline-flex items-center gap-2 border border-line px-4 py-2 transition-colors hover:bg-accent-muted"
        >
          About the founder
          <ArrowUpRight
            weight="bold"
            className="size-4 transition-transform group-hover:-translate-y-px group-hover:translate-x-px"
          />
        </a>
      </div>
    </section>
  );
}
