import { Description, Field, Label } from "@headlessui/react";
import type { FC, HTMLAttributes, ReactNode } from "react";

import { Stack } from "@/components/Stack";
import { Text } from "@/components/Text";
import { Orientation, Spacing, TextColor } from "@/types";

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  control: ReactNode;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  error?: ReactNode;
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
 * @param control The form control to use in this field. This can be any component.
 * @param label Optional label to display for the form field.
 * @param description Optional description to display for the form field.
 * @param disabled If `true`, disables the form field.
 * @param error Optional error message to display for the form field.
 * @param className `class` overrides to apply to the field container.
 * @param props Additional HTML properties to apply to the field container.
 */
export const FormField: FC<FormFieldProps> = ({
  control,
  label,
  description,
  disabled,
  error,
  className,
  ...props
}) => {
  return (
    <Field disabled={disabled} className={className}>
      <Stack orientation={Orientation.Column} spacing={Spacing.Sm} {...props}>
        {label && (
          <Stack orientation={Orientation.Row} spacing={Spacing.Sm}>
            <Label>
              <Text color={TextColor.Primary}>{label}</Text>
            </Label>

            {description && (
              <Description>
                <Text color={TextColor.Secondary}>{description}</Text>
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
