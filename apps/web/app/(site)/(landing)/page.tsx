import { CtaSection } from "@/components/landing/cta-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { MetricsSection } from "@/components/landing/metrics-section";
import { NewsletterSection } from "@/components/landing/newsletter-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { ReviewsSection } from "@/components/landing/reviews-section";
import { StackSection } from "@/components/landing/stack-section";
import { UseCasesSection } from "@/components/landing/use-cases-section";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <HeroSection />
      <StackSection />
      <ProblemSection />
      <MetricsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <UseCasesSection />
      <ReviewsSection />
      <PricingSection />
      <NewsletterSection />
      <FaqSection />
      <CtaSection />
      <LandingFooter />
    </main>
  );
}
