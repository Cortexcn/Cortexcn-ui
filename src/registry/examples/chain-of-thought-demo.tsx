import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtItem,
  ChainOfThoughtStep,
  ChainOfThoughtTrigger,
} from "@/components/ui/chain-of-thought";

export default function ChainOfThoughtDemo() {
  return (
    <ChainOfThought className="max-w-lg">
      <ChainOfThoughtStep defaultOpen>
        <ChainOfThoughtTrigger>Understanding the request</ChainOfThoughtTrigger>
        <ChainOfThoughtContent>
          <ChainOfThoughtItem>
            The user wants a weekly summary of their sales, grouped by region
            and sorted by revenue.
          </ChainOfThoughtItem>
        </ChainOfThoughtContent>
      </ChainOfThoughtStep>

      <ChainOfThoughtStep>
        <ChainOfThoughtTrigger>Querying the database</ChainOfThoughtTrigger>
        <ChainOfThoughtContent>
          <ChainOfThoughtItem>
            Running an aggregate over the orders table for the last 7 days,
            joining on the regions lookup.
          </ChainOfThoughtItem>
        </ChainOfThoughtContent>
      </ChainOfThoughtStep>

      <ChainOfThoughtStep>
        <ChainOfThoughtTrigger>Composing the answer</ChainOfThoughtTrigger>
        <ChainOfThoughtContent>
          <ChainOfThoughtItem>
            Formatting the results into a table and highlighting the top region
            by revenue.
          </ChainOfThoughtItem>
        </ChainOfThoughtContent>
      </ChainOfThoughtStep>
    </ChainOfThought>
  );
}
