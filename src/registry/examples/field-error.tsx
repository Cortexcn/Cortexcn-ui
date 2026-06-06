import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function FieldErrorDemo() {
  return (
    <div className="w-full max-w-sm">
      <Field data-invalid>
        <FieldLabel htmlFor="email-error">Email</FieldLabel>
        <Input
          id="email-error"
          type="email"
          defaultValue="not-an-email"
          aria-invalid
        />
        <FieldError>Please enter a valid email address.</FieldError>
      </Field>
    </div>
  );
}
