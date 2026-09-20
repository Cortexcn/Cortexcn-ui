import { Accordion, type AccordionItemData } from "@/components/ui/accordion";

import { Container, Section, SectionHeading } from "./primitives";

const faqs: AccordionItemData[] = [
  {
    question: "What is Cortexcn?",
    answer:
      "A component platform your AI coding agent can build with. You connect it to your agent over MCP, pick components, and the agent assembles real pages.",
  },
  {
    question: "How does the MCP server work?",
    answer:
      "Cortexcn runs an MCP server that your agent connects to. The agent can browse the library, read component code, and pull the pieces it needs while it builds.",
  },
  {
    question: "Which agents does it support?",
    answer:
      "Claude, Cursor, and Codex today. Any agent that speaks MCP can connect.",
  },
  {
    question: "Do I need to know how to code?",
    answer:
      "It helps, but you do not need to be an expert. You describe the page, review what the agent builds, and edit from there.",
  },
  {
    question: "Can I use my own components?",
    answer:
      "Yes. Cortexcn works alongside your own components and your existing design system.",
  },
  {
    question: "What does it cost?",
    answer:
      "The components are open source and MIT licensed. Paid plans for teams are coming.",
  },
];

export function FaqSection() {
  return (
    <Section id="faq">
      <Container>
        <SectionHeading
          description="Everything you need to know before you connect Cortexcn."
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
