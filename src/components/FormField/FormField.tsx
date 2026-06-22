import { Description, Field, Label } from "@headlessui/react";
import type { FC, HTMLAttributes, ReactNode } from "react";

import { Stack } from "@/components/Stack";
import { Text } from "@/components/Text";
import { Orientation, Spacing, TextColor, TextVariant } from "@/types";

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  control: ReactNode;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  error?: ReactNode;
  spacing?: Spacing;
}

/**
 * A component which represents a composite form field, consisting of a label, form control, description,
 * and error message.
 *
 * This component applies standard form best-practices to the contained elements, such as ensuring the label and form
 * control are properly linked.
 *
 * See also {@link FormFieldGroup}.
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const [value, setValue] = useState<string>("");
 *   const [error, setError] = useState<string | null>(null);
 *
 *   const onChange = useCallback((newValue: string) => {
 *       setValue(newValue);
 *       if (newValue.length < 5) {
 *         setError("Name must be at least 5 characters");
 *       } else {
 *         setError(null);
 *       }
 *     },
 *     [setError, setValue]
 *   );
 *
 *   return (
 *     <FormField
 *       control={<Input value={value} onChange={onChange} />}
 *       label={"Dataset name"}
 *       description={"Name of the dataset to create"}
 *       error={error}
 *     />
 *   );
 * };
 * ```
 *
 * @param control The form control to use in this field. This can be any component.
 * @param label Optional label to display for the form field.
 * @param description Optional description to display for the form field. It appears between the label
 *  and the control (below the title, above the field) with a smaller, more subdued treatment. A
 *  description is only rendered when a `label` is also provided.
 * @param disabled If `true`, disables the form field.
 * @param error Optional error message to display for the form field.
 * @param spacing Spacing between elements in the field. Defaults to {@link Spacing.Sm}.
 * @param className `class` overrides to apply to the field container.
 * @param props Additional HTML properties to apply to the field container.
 */
export const FormField: FC<FormFieldProps> = ({
  control,
  label,
  description,
  disabled,
  error,
  spacing = Spacing.Sm,
  className,
  ...props
}) => {
  return (
    <Field disabled={disabled} className={className}>
      <Stack orientation={Orientation.Column} spacing={spacing} {...props}>
        {/*
          Group the title + description tightly so the description reads as part
          of the label block (rather than floating midway to the control). The
          larger outer Stack spacing then separates this block from the control.
          The description is only shown when a label is also present.
        */}
        {label && (
          <Stack orientation={Orientation.Column} spacing={Spacing.Xs}>
            <Label>
              <Text color={TextColor.Primary}>{label}</Text>
            </Label>
            {description && (
              <Description>
                <Text color={TextColor.Tertiary} variant={TextVariant.Caption}>
                  {description}
                </Text>
              </Description>
            )}
          </Stack>
        )}

        {control}

        {error && <Text color={TextColor.Destructive}>{error}</Text>}
      </Stack>
    </Field>
  );
};

FormField.displayName = "FormField";
