/** Source of each example on the Shimmer docs page, as it reads after install. */
export const code: Record<string, string> = {
  ShimmerDemo:
    '"use client";\n\nimport { Shimmer } from "@/components/shimmer";\n\nexport function ShimmerDemo() {\n  return <Shimmer className="text-lg">Generating your dashboard...</Shimmer>;\n}\n',
  ShimmerHeading:
    '"use client";\n\nimport { Shimmer } from "@/components/shimmer";\n\nexport function ShimmerHeading() {\n  return (\n    <Shimmer as="h3" className="font-semibold text-2xl" duration={3}>\n      Searching 135 components\n    </Shimmer>\n  );\n}\n',
  ShimmerInMessage:
    '"use client";\n\nimport { Shimmer } from "@/components/shimmer";\n\nexport function ShimmerInMessage() {\n  return (\n    <div className="flex w-full max-w-sm flex-col gap-3">\n      <div className="self-end rounded-2xl rounded-br-sm bg-primary px-4 py-2 text-primary-foreground text-sm">\n        Can you add a pricing table to the landing page?\n      </div>\n      <div className="self-start rounded-2xl rounded-bl-sm bg-muted px-4 py-2 text-sm">\n        <Shimmer as="span" duration={1.5} spread={3}>\n          Reading the landing page...\n        </Shimmer>\n      </div>\n    </div>\n  );\n}\n',
};
