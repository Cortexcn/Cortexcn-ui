"use client";

import { Marquee } from "@cortexcn/ui/components/marquee";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { InteractiveGrid } from "./interactive-grid";
import {
  ActionLink,
  scrambleChar,
  TypedText,
  typedCount,
  useTypeInOnView,
} from "./kit";
import { Container } from "./primitives";

const WORDS = ["website", "store", "web app", "launch"];

const TYPE_DELAY = 80;
const DELETE_DELAY = 45;
const HOLD_DELAY = 1800;
const NEXT_DELAY = 300;

/** Types a word, holds it, deletes it, and moves on to the next one. */
function useCyclingWord(words: string[]) {
  const [text, setText] = useState(words[0] ?? "");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    let wordIndex = 0;
    let length = words[0]?.length ?? 0;
    let deleting = true;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const word = words[wordIndex] ?? "";
      if (deleting) {
        length -= 1;
        setText(word.slice(0, length));
        if (length <= 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          timer = setTimeout(tick, NEXT_DELAY);
          return;
        }
        timer = setTimeout(tick, DELETE_DELAY);
        return;
      }
      length += 1;
      setText(word.slice(0, length));
      if (length >= word.length) {
        deleting = true;
        timer = setTimeout(tick, HOLD_DELAY);
        return;
      }
      timer = setTimeout(tick, TYPE_DELAY);
    };

    timer = setTimeout(tick, HOLD_DELAY);
    return () => clearTimeout(timer);
  }, [words]);

  return text;
}

const FIRST_LINE = "Your next";
const LAST_LINE = "starts with one email.";
const SPOKEN_HEADING =
  "Your next website, store, or web app starts with one email.";
const CHAR_MS = 35;
const LAST_LINE_START = 500;

function CtaHeading() {
  const word = useCyclingWord(WORDS);
  const { ref, elapsed } = useTypeInOnView<HTMLHeadingElement>(
    LAST_LINE_START + (LAST_LINE.length + 1) * CHAR_MS,
    0.4,
  );

  return (
    <h2
      className="flex flex-col items-center text-center font-normal text-[2.75rem] leading-[1.1] tracking-[-0.06em] sm:text-6xl lg:text-[4rem]"
      ref={ref}
    >
      <span className="sr-only">{SPOKEN_HEADING}</span>
      <span aria-hidden="true">
        <TypedText
          scramble={scrambleChar(elapsed, 1)}
          text={FIRST_LINE}
          typed={typedCount(elapsed, 0, FIRST_LINE.length, CHAR_MS)}
        />
      </span>
      <span
        aria-hidden="true"
        className="flex items-center font-pixel text-[0.86em] text-primary tracking-normal sm:text-[1em]"
      >
        <span className="whitespace-pre">[{word}]</span>
        <span className="ml-1 inline-block h-[0.9em] w-[0.44em] animate-caret-blink bg-primary motion-reduce:animate-none" />
      </span>
      <span aria-hidden="true">
        <TypedText
          scramble={scrambleChar(elapsed, 2)}
          text={LAST_LINE}
          typed={typedCount(
            elapsed,
            LAST_LINE_START,
            LAST_LINE.length,
            CHAR_MS,
          )}
        />
      </span>
    </h2>
  );
}

function Ticker({ reverse = false }: { reverse?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-border border-y py-6"
    >
      <Marquee
        className="p-0 [--duration:36s] [--gap:0rem]"
        repeat={4}
        reverse={reverse}
      >
        <span className="flex shrink-0 items-center gap-4 pl-10 font-medium font-mono text-primary text-sm uppercase leading-[1.3] tracking-[-0.04em]">
          <span>[#Websites]</span>
          <span>&amp;</span>
          <span>[#Stores]</span>
          <span className="pl-16">{"//"}</span>
          <span className="pl-6">[#Web apps]</span>
          <span>&amp;</span>
          <span>[#AI features]</span>
          <span className="pr-6 pl-16">{"//"}</span>
        </span>
      </Marquee>
    </div>
  );
}

function CornerSquare({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("absolute size-6 bg-foreground", className)}
    />
  );
}

export function CtaSection() {
  return (
    <section aria-label="Start a project" className="w-full">
      <Ticker />
      <div className="relative">
        <InteractiveGrid className="absolute inset-0" />
        <Container className="pointer-events-none relative py-20">
          <div className="pointer-events-auto relative flex flex-col items-center gap-8 bg-background px-6 py-16 text-foreground sm:px-10">
            <CornerSquare className="top-2 left-2" />
            <CornerSquare className="top-2 right-2" />
            <CornerSquare className="bottom-2 left-2" />
            <CornerSquare className="right-2 bottom-2" />

            <span className="bg-muted px-1 py-0.5 font-medium font-mono text-body text-xs uppercase leading-[1.3] tracking-[-0.04em]">
              Tell me what you are building
            </span>
            <CtaHeading />
            <ActionLink
              className="mt-8"
              href="/contact"
              label="Start a project"
            />
          </div>
        </Container>
      </div>
      <Ticker reverse />
    </section>
  );
}
