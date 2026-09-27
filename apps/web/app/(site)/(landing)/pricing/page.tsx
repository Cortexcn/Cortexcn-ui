import { LandingFooter } from "@/components/landing/landing-footer";
import { PricingPlans } from "@/components/landing/pricing-section";
import { Container } from "@/components/landing/primitives";
import { TitleBand } from "@/components/landing/title-band";
import { PricingDetails } from "@/components/pricing/pricing-details";
import { ServicePriceList } from "@/components/pricing/service-price-list";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Pricing",
  description:
    "Starting prices in US dollars for landing pages, websites, e-commerce stores, web apps, backends, microservices, AI pipelines, SEO, research paper support, and monthly retainers.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <main className="flex flex-1 flex-col">
        <TitleBand title="Pricing" />
        <section aria-label="Packages" className="w-full py-20 md:py-24">
          <Container>
            <PricingPlans
              heading={["Start with a package.", "Shape it in the quote."]}
            />
          </Container>
        </section>
        <ServicePriceList />
        <PricingDetails />
      </main>
      <LandingFooter />
    </>
  );
}
