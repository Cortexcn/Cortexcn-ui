import { Accordion, type AccordionItemData } from "@/components/ui/accordion";

import { Container, Section, SectionHeading } from "./primitives";

const faqs: AccordionItemData[] = [
  {
    question: "How quickly do you integrate with our existing systems?",
    answer:
      "Most integrations connect to your current stack within the first few weeks. A typical rollout runs 4 to 8 weeks from audit to live.",
  },
  {
    question: "Do we need special technical knowledge to work with you?",
    answer:
      "No. We handle the architecture and the build. Your team describes the workflows and reviews the results.",
  },
  {
    question: "How is data security handled?",
    answer:
      "Your data stays in your environment. We work with your keys and follow your access, retention, and compliance policies.",
  },
  {
    question: "Can workflows be customized to our specific needs?",
    answer:
      "Yes. Every system is built around your actual workflows and tools, not a generic template.",
  },
  {
    question: "What results can we expect after implementation?",
    answer:
      "Fewer manual tasks, faster decisions, and clearer reporting. We define the target metrics with you up front so the results are measurable.",
  },
  {
    question: "Does it support multi-team collaboration?",
    answer:
      "Yes. Systems are designed for multiple teams, with shared visibility and role-based access.",
  },
];

export function FaqSection() {
  return (
    <Section id="faq">
      <Container>
        <SectionHeading
          description="Clear, practical answers before we start."
          eyebrow="FAQ"
          title="Questions, answered"
        />

        <div className="mx-auto mt-12 max-w-3xl">
          <Accordion items={faqs} />
        </div>
      </Container>
    </Section>
  );
}
