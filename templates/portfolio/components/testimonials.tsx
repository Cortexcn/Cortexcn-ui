import { site } from "@/config/site";

import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { Marquee } from "./ui/marquee";

type Testimonial = (typeof site.testimonials)[number];

const AVATAR_COLORS = [
  "var(--sticker-1)",
  "var(--sticker-2)",
  "var(--sticker-3)",
];

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) {
  return (
    <figure className="flex w-80 flex-col justify-between gap-8 rounded-3xl border border-border bg-card p-6 md:w-96">
      <blockquote className="text-lg leading-snug">
        “{testimonial.quote}”
      </blockquote>
      <figcaption className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex size-10 items-center justify-center rounded-full border border-(--sticker-ink) font-semibold text-(--sticker-ink)"
          style={{ background: AVATAR_COLORS[index % AVATAR_COLORS.length] }}
        >
          {testimonial.name.charAt(0)}
        </span>
        <span className="flex flex-col">
          <span className="font-medium">{testimonial.name}</span>
          <span className="text-muted-foreground text-sm">
            {testimonial.role}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const half = Math.ceil(site.testimonials.length / 2);
  const rows = [
    site.testimonials.slice(0, half),
    site.testimonials.slice(half),
  ];

  return (
    <section className="overflow-hidden py-24 md:py-32" id="testimonials">
      <div className="px-6">
        <Reveal className="mx-auto max-w-6xl">
          <SectionHeading label="Kind words">Testimonials</SectionHeading>
        </Reveal>
      </div>
      <div className="relative mt-14 flex flex-col gap-4">
        {rows.map((row, rowIndex) => (
          <Marquee
            className="[--duration:60s]"
            key={row[0]?.name ?? rowIndex}
            pauseOnHover
            repeat={3}
            reverse={rowIndex === 1}
          >
            {row.map((testimonial, index) => (
              <TestimonialCard
                index={rowIndex * half + index}
                key={testimonial.name}
                testimonial={testimonial}
              />
            ))}
          </Marquee>
        ))}
        {/* Soft edges so cards fade in and out instead of clipping. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-background md:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-background md:w-40" />
      </div>
    </section>
  );
}
