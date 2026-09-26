import { Marquee } from "@bklitui/ui/components/marquee";
import { BrandLogo, DEMO_BRANDS } from "@/components/docs/brand-logo";
import { cn } from "@/lib/utils";

const FEATURES = [
  "Open code",
  "Composable",
  "Beautiful defaults",
  "AI-ready",
  "Dark mode",
  "Copy and paste",
];

const firstRow = DEMO_BRANDS.slice(0, 6);
const secondRow = DEMO_BRANDS.slice(6);

function LogoCard({ brand }: { brand: (typeof DEMO_BRANDS)[number] }) {
  return (
    <div className="rounded-lg border border-border bg-background px-4 py-3 shadow-xs">
      <BrandLogo brand={brand} />
    </div>
  );
}

/** Soft edges so rows fade in and out instead of clipping hard. */
function EdgeFade({ vertical = false }: { vertical?: boolean }) {
  return (
    <>
      <div
        className={cn(
          "pointer-events-none absolute from-card",
          vertical
            ? "inset-x-0 top-0 h-1/4 bg-linear-to-b"
            : "inset-y-0 left-0 w-1/4 bg-linear-to-r",
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute from-card",
          vertical
            ? "inset-x-0 bottom-0 h-1/4 bg-linear-to-t"
            : "inset-y-0 right-0 w-1/4 bg-linear-to-l",
        )}
      />
    </>
  );
}

export function MarqueeDemo() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee className="[--duration:30s]" pauseOnHover>
        {firstRow.map((brand) => (
          <LogoCard brand={brand} key={brand.slug} />
        ))}
      </Marquee>
      <Marquee className="[--duration:30s]" pauseOnHover reverse>
        {secondRow.map((brand) => (
          <LogoCard brand={brand} key={brand.slug} />
        ))}
      </Marquee>
      <EdgeFade />
    </div>
  );
}

export function MarqueeVerticalDemo() {
  return (
    <div className="relative flex h-72 w-full items-center justify-center gap-4 overflow-hidden">
      <Marquee className="[--duration:20s]" pauseOnHover vertical>
        {FEATURES.map((feature) => (
          <div
            className="rounded-lg border border-border bg-background px-4 py-3 font-medium text-foreground/80 text-sm shadow-xs"
            key={feature}
          >
            {feature}
          </div>
        ))}
      </Marquee>
      <Marquee className="[--duration:20s]" pauseOnHover reverse vertical>
        {FEATURES.map((feature) => (
          <div
            className="rounded-lg border border-border bg-background px-4 py-3 font-medium text-foreground/80 text-sm shadow-xs"
            key={feature}
          >
            {feature}
          </div>
        ))}
      </Marquee>
      <EdgeFade vertical />
    </div>
  );
}
