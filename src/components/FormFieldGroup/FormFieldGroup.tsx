import { Fieldset } from "@headlessui/react";
import type { FC, HTMLAttributes } from "react";

import { Stack } from "@/components/Stack";
import Orientation from "@/types/orientation.ts";
import Spacing from "@/types/spacing";

export interface FormFieldGroupProps extends HTMLAttributes<HTMLFieldSetElement> {
  disabled?: boolean;
  orientation?: Orientation;
  spacing?: Spacing;
}

export const FormFieldGroup: FC<FormFieldGroupProps> = ({
  orientation = Orientation.Column,
  spacing = Spacing.Lg,
  disabled,
  children,
  ...props
}) => (
  <Fieldset disabled={disabled} {...props}>
    <Stack orientation={orientation} spacing={spacing}>
      {children}
    </Stack>
  </Fieldset>
);

FormFieldGroup.displayName = "FormFieldGroup";
