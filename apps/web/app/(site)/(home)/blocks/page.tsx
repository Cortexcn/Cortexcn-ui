import type { Metadata } from "next";
import { Suspense } from "react";
import {
  BlockGallery,
  BlockGalleryView,
} from "@/components/blocks/block-gallery";
import { BlocksPageHeader } from "@/components/blocks/blocks-page-header";
import { JsonLd } from "@/components/seo/json-ld";
import { getGalleryBlocks, getGalleryCategories } from "@/lib/blocks/gallery";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Blocks",
  description:
    "Ready-to-go sections and cards for landing pages and dashboards, built with shadcn/ui and Tailwind CSS. Preview each block live and copy the code.",
  path: "/blocks",
});

export default function BlocksPage() {
  const blocks = getGalleryBlocks();
  const categories = getGalleryCategories();

  return (
    <main className="flex flex-1 flex-col space-y-10 md:space-y-12">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blocks", path: "/blocks" },
        ])}
      />
      <section className="relative w-full">
        <div className="container mx-auto w-full overflow-visible">
          <BlocksPageHeader
            description={`${blocks.length} ready-to-go sections and cards for landing pages and dashboards, designed and built by Cortexcn. Preview each one live, then copy the code or add it to your project with one command.`}
            title="Cortexcn Blocks"
          />
        </div>
      </section>

      <section
        className="relative w-full scroll-mt-28 pb-16 md:pb-24"
        id="blocks"
      >
        <div className="container mx-auto w-full overflow-visible">
          {/* The URL holds the filters, so the static HTML is the unfiltered
              gallery and the client swaps in the filtered one. */}
          <Suspense
            fallback={
              <BlockGalleryView blocks={blocks} categories={categories} />
            }
          >
            <BlockGallery blocks={blocks} categories={categories} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
