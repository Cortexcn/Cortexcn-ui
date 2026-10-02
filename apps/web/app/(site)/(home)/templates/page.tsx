import type { Metadata } from "next";
import { BlocksPageHeader } from "@/components/blocks/blocks-page-header";
import { JsonLd } from "@/components/seo/json-ld";
import { TemplateListItem } from "@/components/templates/template-list-item";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { SITE_TEMPLATES } from "@/lib/site-templates";

export const metadata: Metadata = pageMetadata({
  title: "Templates",
  description:
    "Complete websites built with Next.js, Tailwind CSS, and Cortexcn components. Open the live preview, get the code, add your content, and deploy it.",
  path: "/templates",
});

export default function TemplatesPage() {
  return (
    <main className="flex flex-1 flex-col space-y-10 md:space-y-12">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Templates", path: "/templates" },
        ])}
      />
      <section className="relative w-full">
        <div className="container mx-auto w-full overflow-visible">
          <BlocksPageHeader
            description={`${SITE_TEMPLATES.length} complete websites built with Next.js, Tailwind CSS, and Cortexcn components. Open the live preview, get the code, add your content, and deploy it.`}
            title="Cortexcn Templates"
          />
        </div>
      </section>

      <section
        className="relative w-full scroll-mt-28 pb-16 md:pb-24"
        id="templates"
      >
        <div className="container mx-auto flex w-full flex-col gap-8 overflow-visible">
          {SITE_TEMPLATES.map((template) => (
            <TemplateListItem key={template.slug} template={template} />
          ))}
        </div>
      </section>
    </main>
  );
}
