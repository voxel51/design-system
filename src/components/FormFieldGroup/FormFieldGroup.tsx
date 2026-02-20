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

/**
 * A logical grouping of form fields.
 *
 * This component wraps its children in a `fieldset` tag.
 *
 * See also {@link FormField}.
 *
 * @example
 * ```tsx
 * <FormFieldGroup orientation={Orientation.Vertical} spacing={Spacing.Lg}>
 *   <FormField
 *     control={
 *       <Input
 *         // input configuration
 *       />
 *     }
 *     label="First name"
 *   />
 *
 *   <FormField
 *    control={
 *       <Input
 *         // input configuration
 *       />
 *     }
 *     label="Last name"
 *   />
 * </FormFieldGroup>
 * ```
 *
 * @param orientation The orientation of the form group;
 *  controls whether children are stacked horizontally or vertically.
 *  See {@link Orientation}.
 * @param spacing Spacing to apply between form fields. See {@link Spacing}.
 * @param disabled If `true`, disables the form group.
 * @param children Form controls wrapped by this component.
 * @param props Additional HTML properties to apply to the component.
 */
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
