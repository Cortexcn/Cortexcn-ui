import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtItem,
  ChainOfThoughtStep,
  ChainOfThoughtTrigger,
} from "@/components/ui/chain-of-thought";

export default function ChainOfThoughtOpen() {
  return (
    <ChainOfThought className="max-w-lg">
      <ChainOfThoughtStep defaultOpen>
        <ChainOfThoughtTrigger>Planning the refactor</ChainOfThoughtTrigger>
        <ChainOfThoughtContent>
          <ChainOfThoughtItem>
            Split the monolithic handler into smaller, testable units.
          </ChainOfThoughtItem>
          <ChainOfThoughtItem>
            Extract the validation logic into a shared schema.
          </ChainOfThoughtItem>
          <ChainOfThoughtItem>
            Add unit tests for each unit before wiring them together.
          </ChainOfThoughtItem>
        </ChainOfThoughtContent>
      </ChainOfThoughtStep>

      <ChainOfThoughtStep defaultOpen>
        <ChainOfThoughtTrigger>Applying the changes</ChainOfThoughtTrigger>
        <ChainOfThoughtContent>
          <ChainOfThoughtItem>
            Created schema.ts and moved the validation definitions over.
          </ChainOfThoughtItem>
          <ChainOfThoughtItem>
            Updated 4 call sites to import from the new module.
          </ChainOfThoughtItem>
        </ChainOfThoughtContent>
      </ChainOfThoughtStep>
    </ChainOfThought>
  );
}
