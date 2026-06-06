import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function FieldDemo() {
  return (
    <div className="w-full max-w-sm">
      <Field>
        <FieldLabel htmlFor="username">Username</FieldLabel>
        <Input id="username" placeholder="cortexcn" />
        <FieldDescription>This is your public display name.</FieldDescription>
      </Field>
    </div>
  );
}
