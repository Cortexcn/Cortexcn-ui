import { InteractiveGrid } from "./interactive-grid";
import { Container } from "./primitives";

/** Light grid band under the header that holds a page title (contact, legal pages). */
export function TitleBand({ title }: { title: string }) {
  return (
    // Pulled up behind the fixed site header so the grid starts at the top edge.
    <section
      aria-labelledby="page-title"
      className="relative -mt-(--site-header-height) w-full border-border border-b"
    >
      <div className="relative flex h-72 items-end pt-(--site-header-height) md:h-90">
        {/* The landing's hover grid, recolored from its dark band to a light one. */}
        <InteractiveGrid className="absolute inset-0 [--band-line:var(--border)] [--band:var(--muted)]" />
        <Container className="pointer-events-none relative pb-10 md:pb-12">
          <h1
            className="font-medium text-[3.5rem] leading-none tracking-[-0.06em] sm:text-7xl lg:text-[5.5rem]"
            id="page-title"
          >
            {title}
          </h1>
        </Container>
      </div>
    </section>
  );
}
