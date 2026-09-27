"use client";

import { motion } from "motion/react";
import { useRef } from "react";

import { site } from "@/config/site";

import { Stickers } from "./stickers";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const words = site.role.split(" ");

  return (
    <section
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16"
      id="top"
      ref={ref}
    >
      <Stickers constraints={ref} />

      <h1 className="relative z-10 flex flex-col items-center font-extrabold text-[clamp(3.25rem,15vw,12.5rem)] uppercase leading-[0.82] tracking-[-0.05em]">
        {words.map((word, index) => (
          <span
            className="block overflow-hidden pb-[0.04em]"
            key={`${index}-${word}`}
          >
            <motion.span
              animate={{ y: 0 }}
              className="block"
              initial={{ y: "105%" }}
              transition={{
                duration: 0.9,
                delay: 0.1 + index * 0.12,
                ease: EASE,
              }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </h1>

      <motion.p
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-3 font-mono text-sm uppercase tracking-widest"
        initial={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
      >
        <mark className="bg-accent px-2 py-1 text-accent-foreground">
          /{site.hero.tagline} {site.since}
        </mark>
        <span className="text-muted-foreground">{site.location}</span>
      </motion.p>
    </section>
  );
}
