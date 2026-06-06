import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

export default function InputGroupTextareaDemo() {
  return (
    <InputGroup className="w-full max-w-sm">
      <InputGroupTextarea placeholder="Write a comment..." />
      <InputGroupAddon align="block-end">
        <InputGroupText className="text-muted-foreground">
          0 / 280
        </InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  );
}
