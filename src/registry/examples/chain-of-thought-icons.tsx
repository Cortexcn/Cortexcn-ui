import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtItem,
  ChainOfThoughtStep,
  ChainOfThoughtTrigger,
} from "@/components/ui/chain-of-thought";
import { BookOpen, Lightbulb, Search } from "lucide-react";

export default function ChainOfThoughtIcons() {
  return (
    <ChainOfThought className="max-w-lg">
      <ChainOfThoughtStep>
        <ChainOfThoughtTrigger leftIcon={<Search className="size-4" />}>
          Searching the knowledge base
        </ChainOfThoughtTrigger>
        <ChainOfThoughtContent>
          <ChainOfThoughtItem>
            Found 12 documents matching &quot;billing webhook retries&quot;.
          </ChainOfThoughtItem>
        </ChainOfThoughtContent>
      </ChainOfThoughtStep>

      <ChainOfThoughtStep>
        <ChainOfThoughtTrigger leftIcon={<BookOpen className="size-4" />}>
          Reading the top results
        </ChainOfThoughtTrigger>
        <ChainOfThoughtContent>
          <ChainOfThoughtItem>
            Retries use exponential backoff, capped at 5 attempts over 24 hours.
          </ChainOfThoughtItem>
        </ChainOfThoughtContent>
      </ChainOfThoughtStep>

      <ChainOfThoughtStep defaultOpen>
        <ChainOfThoughtTrigger leftIcon={<Lightbulb className="size-4" />}>
          Drawing a conclusion
        </ChainOfThoughtTrigger>
        <ChainOfThoughtContent>
          <ChainOfThoughtItem>
            The webhook likely failed silently after the last attempt. Enabling
            the dead-letter queue should surface it.
          </ChainOfThoughtItem>
        </ChainOfThoughtContent>
      </ChainOfThoughtStep>
    </ChainOfThought>
  );
}
