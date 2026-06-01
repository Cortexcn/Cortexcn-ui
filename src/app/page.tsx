import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

export default function Page() {
  return (
    <main className="min-h-svh">
      <div className="mx-auto border-x border-line md:max-w-3xl">
        <header className="screen-line-bottom flex items-center justify-between px-4 py-3">
          <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
            Cortexcn / Studio
          </span>
          <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
            Est. 2026
          </span>
        </header>

        <section className="px-4 py-24 sm:py-32">
          <p className="text-xs tracking-widest uppercase text-muted-foreground">
            A studio by Syed Moinuddin
          </p>

          <h1
            className="mt-4 font-heading text-6xl leading-[0.9] font-black tracking-tight text-balance sm:text-8xl"
            aria-label="Cortexcn"
          >
            Cortexcn.
          </h1>

          <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
            We build pixel-perfect web products with founders who care about the
            small details — interfaces, design systems, and the engineering that
            holds it all together.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3 text-sm">
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

        <footer className="screen-line-top flex items-center justify-between px-4 py-3 text-xs text-muted-foreground">
          <a
            href="mailto:studio@cortexcn.studio"
            className="hover:text-foreground transition-colors"
          >
            studio@cortexcn.studio
          </a>
          <span>Bangalore · Remote</span>
        </footer>
      </div>
    </main>
  );
}
