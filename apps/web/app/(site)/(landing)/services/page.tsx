import { LandingFooter } from "@/components/landing/landing-footer";
import { TitleBand } from "@/components/landing/title-band";
import { ServiceGrid } from "@/components/services/service-grid";
import { ServicesCta } from "@/components/services/services-cta";
import { ServicesIntro } from "@/components/services/services-intro";
import { ServicesProcess } from "@/components/services/services-process";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Services",
  description:
    "Hire the team behind Cortexcn for websites, landing pages, stores, web apps, backends, AI pipelines, SEO, and more. Starting prices, how a project runs, and per project or retainer work.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <main className="flex flex-1 flex-col">
        <TitleBand title="Services" />
        <ServicesIntro />
        <ServiceGrid />
        <ServicesProcess />
        <ServicesCta />
      </main>
      <LandingFooter />
    </>
  );
}
