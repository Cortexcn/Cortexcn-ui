import defaultMdxComponents from "fumadocs-ui/mdx";
import { Step, Steps } from "fumadocs-ui/components/steps";
import {
  Tab,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "fumadocs-ui/components/tabs";
import type { MDXComponents } from "mdx/types";

import { ComponentPreview } from "@/components/docs/component-preview";
import { ComponentSource } from "@/components/docs/component-source";
import { ComponentsOverview } from "@/components/docs/components-overview";
import { BlocksOverview } from "@/components/docs/blocks-overview";
import { ComingSoon } from "@/components/docs/coming-soon";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Tabs,
    Tab,
    TabsList,
    TabsTrigger,
    TabsContent,
    Steps,
    Step,
    ComponentPreview,
    ComponentSource,
    ComponentsOverview,
    BlocksOverview,
    ComingSoon,
    ...components,
  };
}
