"use client";

// Examples adapted from the shadcn/ui Carousel docs (MIT, https://ui.shadcn.com).

import type * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../components/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/carousel";

/** Stands in for the shadcn docs frame; the docs page draws its own. */
function Example({
  className,
  children,
}: React.ComponentProps<"div"> & {
  title?: string;
  containerClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col items-start gap-6 *:[div:not([class*='w-'])]:w-full",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CarouselBasic() {
  return (
    <Example title="Basic">
      <Carousel className="mx-auto max-w-xs sm:max-w-sm">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="p-1 style-luma:p-2.5">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="font-semibold text-4xl">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:inline-flex" />
        <CarouselNext className="hidden sm:inline-flex" />
      </Carousel>
    </Example>
  );
}

export function CarouselMultiple() {
  return (
    <Example title="Multiple">
      <Carousel
        className="mx-auto max-w-xs sm:max-w-sm"
        opts={{
          align: "start",
        }}
      >
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem className="sm:basis-1/2 lg:basis-1/3" key={index}>
              <div className="p-1 style-luma:p-2.5">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="font-semibold text-3xl">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:inline-flex" />
        <CarouselNext className="hidden sm:inline-flex" />
      </Carousel>
    </Example>
  );
}

export function CarouselWithGap() {
  return (
    <Example title="With Gap">
      <Carousel className="mx-auto max-w-xs sm:max-w-sm">
        <CarouselContent className="-ml-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem className="pl-1 md:basis-1/2" key={index}>
              <div className="p-1 style-luma:p-2.5">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="font-semibold text-2xl">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:inline-flex" />
        <CarouselNext className="hidden sm:inline-flex" />
      </Carousel>
    </Example>
  );
}
