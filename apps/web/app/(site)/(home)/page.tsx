import { CtaSection } from "@/components/landing/cta-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LogoCloud } from "@/components/landing/logo-cloud";
import { MetricsSection } from "@/components/landing/metrics-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { TrustSection } from "@/components/landing/trust-section";
import { UseCasesSection } from "@/components/landing/use-cases-section";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <HeroSection />
      <LogoCloud />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorksSection />
      <UseCasesSection />
      <MetricsSection />
      <TrustSection />
      <FaqSection />
      <CtaSection />
      <LandingFooter />
    </main>
  );
}
