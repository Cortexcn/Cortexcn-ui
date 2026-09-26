import Image from "next/image";

import { cn } from "@/lib/utils";

export interface Brand {
  name: string;
  slug: string;
  /** Themed brands ship `-light` and `-dark` files; the rest are one file. */
  themed?: boolean;
}

/** Logos from public/logos used by the docs demos. */
export const DEMO_BRANDS: Brand[] = [
  { name: "Vercel", slug: "vercel", themed: true },
  { name: "Next.js", slug: "nextjs" },
  { name: "React", slug: "react", themed: true },
  { name: "shadcn/ui", slug: "shadcn", themed: true },
  { name: "Tailwind CSS", slug: "tailwindcss" },
  { name: "TypeScript", slug: "typescript" },
  { name: "Supabase", slug: "supabase" },
  { name: "Stripe", slug: "stripe" },
  { name: "GitHub", slug: "github", themed: true },
  { name: "OpenAI", slug: "openai", themed: true },
  { name: "Claude", slug: "claude" },
  { name: "Cursor", slug: "cursor", themed: true },
];

const MARK_SIZE = 20;

function BrandMark({ brand }: { brand: Brand }) {
  if (!brand.themed) {
    return (
      <Image
        alt=""
        className="size-5 object-contain"
        height={MARK_SIZE}
        src={`/logos/${brand.slug}.svg`}
        unoptimized
        width={MARK_SIZE}
      />
    );
  }

  return (
    <>
      <Image
        alt=""
        className="size-5 object-contain dark:hidden"
        height={MARK_SIZE}
        src={`/logos/${brand.slug}-light.svg`}
        unoptimized
        width={MARK_SIZE}
      />
      <Image
        alt=""
        className="hidden size-5 object-contain dark:block"
        height={MARK_SIZE}
        src={`/logos/${brand.slug}-dark.svg`}
        unoptimized
        width={MARK_SIZE}
      />
    </>
  );
}

/** Brand mark plus name, sized for marquee rows and logo grids. */
export function BrandLogo({
  brand,
  className,
}: {
  brand: Brand;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-medium text-foreground/80 text-sm",
        className,
      )}
    >
      <BrandMark brand={brand} />
      {brand.name}
    </span>
  );
}
