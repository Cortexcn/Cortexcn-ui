import {
  COMPONENT_SHAPE,
  CURSOR_SHAPE,
  ExtrudedIcon,
  type ExtrudedShape,
  TERMINAL_SHAPE,
} from "./extruded-icon";
import {
  ActionLink,
  IndexMark,
  MonoTag,
  SectionLabel,
  TypeHeading,
} from "./kit";
import { Container } from "./primitives";

interface Benefit {
  title: string;
  description: string;
  tag: string;
  shape: ExtrudedShape;
}

const BENEFITS: Benefit[] = [
  {
    title: "Real components",
    description:
      "Your agent builds with tested React components from the registry, not markup it made up a minute ago.",
    tag: "No made-up UI",
    shape: COMPONENT_SHAPE,
  },
  {
    title: "One command",
    description:
      "Run one shadcn command and the component lands in your project, typed and ready to use.",
    tag: "Install and go",
    shape: TERMINAL_SHAPE,
  },
  {
    title: "Yours to edit",
    description:
      "The code lives in your repo. Change the markup, the props, or the styles. Tailwind keeps it on theme.",
    tag: "Your code, your rules",
    shape: CURSOR_SHAPE,
  },
];

function BenefitCard({ benefit, index }: { benefit: Benefit; index: number }) {
  return (
    <article className="group flex min-h-100 flex-col justify-between gap-10 border border-border bg-background p-6 md:h-125">
      <div className="flex flex-col gap-10">
        <div className="flex items-start justify-between gap-4">
          <ExtrudedIcon className="size-40" shape={benefit.shape} />
          <IndexMark value={index + 1} />
        </div>
        <div>
          <h3 className="font-medium text-2xl leading-[1.3] tracking-[-0.05em]">
            {benefit.title}
          </h3>
          {/* Shown on hover, like the pixel icon; always shown on touch screens. */}
          <p className="max-w-80 translate-y-2 text-base text-body leading-[1.3] tracking-[-0.05em] opacity-0 transition-[opacity,translate] duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
            {benefit.description}
          </p>
        </div>
      </div>
      <MonoTag className="self-start">{benefit.tag}</MonoTag>
    </article>
  );
}

export function BenefitsSection() {
  return (
    <section aria-label="Why Cortexcn" className="w-full py-20">
      <Container className="flex flex-col gap-6">
        <SectionLabel label="Why Cortexcn" section="benefits" />
        <div className="flex flex-col gap-16">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
            <TypeHeading
              lines={["Less UI from scratch.", "More pages that ship."]}
            />
            <ActionLink href="/docs/installation" label="Get started" />
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            {BENEFITS.map((benefit, index) => (
              <BenefitCard
                benefit={benefit}
                index={index}
                key={benefit.title}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
