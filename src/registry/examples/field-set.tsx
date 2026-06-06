import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function FieldSetDemo() {
  return (
    <div className="w-full max-w-sm">
      <FieldSet>
        <FieldLegend>Address</FieldLegend>
        <FieldDescription>Where should we ship your order?</FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="street">Street</FieldLabel>
            <Input id="street" placeholder="123 Main St" />
          </Field>
          <Field>
            <FieldLabel htmlFor="city">City</FieldLabel>
            <Input id="city" placeholder="San Francisco" />
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  );
}
