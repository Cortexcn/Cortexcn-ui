import type { Metadata } from "next";
import { BlockCategoryGrid } from "@/components/blocks/block-examples";
import { BlocksHero } from "@/components/blocks/blocks-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Blocks",
  description:
    "Ready-to-go sections and cards for landing pages and dashboards, built with shadcn/ui and Tailwind CSS. Preview each block live and copy the code.",
  path: "/blocks",
});

export default function BlocksPage() {
  return (
    <main className="flex flex-1 flex-col space-y-24">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blocks", path: "/blocks" },
        ])}
      />
      <section className="relative w-full">
        <div className="container mx-auto w-full overflow-visible">
          <BlocksHero />
        </div>
      </section>

      <section
        className="relative w-full pt-8 pb-16 md:pt-12 md:pb-24"
        id="blocks"
      >
        <div className="container mx-auto w-full overflow-visible">
          <BlockCategoryGrid />
        </div>
      </section>
    </main>
  );
}
