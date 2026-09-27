import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GridPageHero } from "@/components/design/grid-page-hero";
import { DocsCodeBlock } from "@/components/docs/docs-code-block";
import { JsonLd } from "@/components/seo/json-ld";
import { BrowserFrame, PhoneFrame } from "@/components/templates/device-frames";
import { TemplateActions } from "@/components/templates/template-actions";
import { TemplateScreenshot } from "@/components/templates/template-screenshot";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import {
  getSiteTemplate,
  SITE_TEMPLATES,
  templateArchiveName,
} from "@/lib/site-templates";

interface TemplatePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return SITE_TEMPLATES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: TemplatePageProps): Promise<Metadata> {
  const template = getSiteTemplate((await params).slug);
  if (!template) {
    notFound();
  }
  return pageMetadata({
    title: `${template.name} template`,
    description: `${template.summary}, built with ${template.stack.slice(0, 3).join(", ")}. ${template.price} to download and use under the MIT license.`,
    path: `/templates/${template.slug}`,
  });
}

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          className="rounded-md bg-muted px-2 py-1 font-mono text-muted-foreground text-xs"
          key={item}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  const template = getSiteTemplate((await params).slug);
  if (!template) {
    notFound();
  }

  const folder = templateArchiveName(template);
  const steps = [
    {
      title: "Download and unzip",
      body: `You get a ${folder} folder with the whole project inside.`,
    },
    {
      title: "Install and run it",
      body: "Use pnpm, npm, or any package manager you like.",
      code: `cd ${folder}\npnpm install\npnpm dev`,
    },
    {
      title: "Make it yours",
      body: template.customize,
    },
    {
      title: "Deploy",
      body: "Push the folder to GitHub and import it on Vercel. No environment variables are needed.",
    },
  ];

  return (
    <main className="flex flex-1 flex-col space-y-16 md:space-y-24">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Templates", path: "/templates" },
          { name: template.name, path: `/templates/${template.slug}` },
        ])}
      />
      <section className="relative w-full">
        <div className="container mx-auto w-full overflow-visible">
          <GridPageHero
            action={<TemplateActions template={template} />}
            subtitle={template.summary}
            title={template.name}
          />
        </div>
      </section>

      <section className="relative w-full">
        <div className="container mx-auto grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <BrowserFrame
            address="example.com"
            label={`The ${template.name} template on a desktop`}
          >
            <TemplateScreenshot
              alt={`The full ${template.name} page on a desktop`}
              image={template.screenshots.desktop}
              sizes="(min-width: 1024px) 70vw, 100vw"
            />
          </BrowserFrame>
          <PhoneFrame
            className="hidden lg:block"
            label={`The ${template.name} template on a phone`}
          >
            <TemplateScreenshot
              alt={`The full ${template.name} page on a phone`}
              image={template.screenshots.mobile}
              sizes="18rem"
            />
          </PhoneFrame>
        </div>
        <p className="container mx-auto mt-4 text-muted-foreground text-sm">
          Scroll inside the frames to see the whole page.
        </p>
      </section>

      <section className="relative w-full pb-16 md:pb-24">
        <div className="container mx-auto grid w-full gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="font-semibold text-2xl tracking-tight">
                What's inside
              </h2>
              <ul className="flex list-disc flex-col gap-2 pl-5 text-muted-foreground marker:text-foreground/40">
                {template.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-medium">Sections</h3>
              <Chips items={template.sections} />
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-medium">Built with</h3>
              <Chips items={template.stack} />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-semibold text-2xl tracking-tight">
              Get started
            </h2>
            <ol className="flex flex-col gap-6">
              {steps.map((step, index) => (
                <li className="flex gap-4" key={step.title}>
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-xs">
                    {index + 1}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-2 pt-0.5">
                    <h3 className="font-medium">{step.title}</h3>
                    <p className="text-muted-foreground">{step.body}</p>
                    {step.code ? (
                      <DocsCodeBlock
                        className="rounded-lg border"
                        code={step.code}
                        lang="bash"
                      />
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
            <p className="text-muted-foreground text-sm">
              {template.price} under the MIT license. Use it for yourself or
              your clients and change anything you like.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
