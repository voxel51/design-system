import type { FC, HTMLAttributes, ReactNode } from "react";
import { Stack } from "@/components/Stack";
import Orientation from "@/types/orientation";
import Spacing from "@/types/spacing";
import { Description, Field, Label } from "@headlessui/react";
import { Text } from "@/components/Text";
import { TextColor } from "@/types";

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  control: ReactNode;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  error?: ReactNode;
}

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
          <Stack orientation={Orientation.Row}>
            <Label>
              <Text>{label}</Text>
            </Label>

            {description && (
              <Description>
                <Text color={TextColor.Secondary}>{description}</Text>
              </Description>
            )}
          </Stack>
        )}

        {control}

        {error && <Text color={TextColor.SemanticDestructive}>{error}</Text>}
      </Stack>
    </Field>
  );
};

FormField.displayName = "FormField";
