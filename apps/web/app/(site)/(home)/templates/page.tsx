import type { Metadata } from "next";
import Link from "next/link";
import { GridPageHero } from "@/components/design/grid-page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { TemplateListItem } from "@/components/templates/template-list-item";
import { Button } from "@/components/ui/button";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { SITE_TEMPLATES } from "@/lib/site-templates";

export const metadata: Metadata = pageMetadata({
  title: "Templates",
  description:
    "Complete websites built with Next.js, Tailwind CSS, and Cortexcn components. Download a template, add your content, and deploy it.",
  path: "/templates",
});

export default function TemplatesPage() {
  return (
    <main className="flex flex-1 flex-col space-y-24">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Templates", path: "/templates" },
        ])}
      />
      <section className="relative w-full">
        <div className="container mx-auto w-full overflow-visible">
          <GridPageHero
            action={
              <Button
                nativeButton={false}
                render={<Link href="#templates" />}
                size="lg"
                variant="white"
              >
                Browse templates
              </Button>
            }
            subtitle="Complete websites you can download and make your own"
            title="Templates"
          />
        </div>
      </section>

      <section
        className="relative w-full pt-8 pb-16 md:pt-12 md:pb-24"
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
