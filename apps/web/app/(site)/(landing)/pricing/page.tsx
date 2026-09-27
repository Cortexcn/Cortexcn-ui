import { LandingFooter } from "@/components/landing/landing-footer";
import { PricingPlans } from "@/components/landing/pricing-section";
import { Container } from "@/components/landing/primitives";
import { TitleBand } from "@/components/landing/title-band";
import { PricingDetails } from "@/components/pricing/pricing-details";
import { ProjectEstimator } from "@/components/pricing/project-estimator";
import { ServicePriceList } from "@/components/pricing/service-price-list";
import { pageMetadata } from "@/lib/seo";
import { COMPONENT_PLAN_PRICES, formatUsd } from "@/lib/service-pricing";

export const metadata = pageMetadata({
  title: "Pricing",
  description: `Cortexcn components are free to start, with Pro at ${formatUsd(COMPONENT_PLAN_PRICES.pro)} and Ultra at ${formatUsd(COMPONENT_PLAN_PRICES.ultra)}, paid once. Plus prices and an estimator for landing pages, websites, stores, web apps, AI pipelines, and more.`,
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <main className="flex flex-1 flex-col">
        <TitleBand title="Pricing" />
        <section aria-label="Plans" className="w-full py-20 md:py-24">
          <Container>
            <PricingPlans
              heading={["Pay once for components.", "Or hire us to build."]}
            />
          </Container>
        </section>
        <ProjectEstimator />
        <ServicePriceList />
        <PricingDetails />
      </main>
      <LandingFooter />
    </>
  );
}
