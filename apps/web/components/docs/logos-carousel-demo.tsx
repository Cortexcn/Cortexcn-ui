import { LogosCarousel } from "@bklitui/ui/components/logos-carousel";
import { BrandLogo, DEMO_BRANDS } from "@/components/docs/brand-logo";

export function LogosCarouselDemo({
  columnCount = 4,
  direction = "ltr",
}: {
  columnCount?: number;
  direction?: "ltr" | "rtl";
}) {
  return (
    <LogosCarousel
      className="h-16 w-full max-w-2xl"
      columnCount={columnCount}
      direction={direction}
    >
      {DEMO_BRANDS.map((brand) => (
        <BrandLogo brand={brand} className="text-base" key={brand.slug} />
      ))}
    </LogosCarousel>
  );
}
