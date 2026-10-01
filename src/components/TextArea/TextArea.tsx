import { Field, Textarea as HeadlessTextarea } from "@headlessui/react";
import clsx from "clsx";
import { type FC, TextareaHTMLAttributes } from "react";

import formControlStyles from "@/styles/form-control.module.css";
import radiusStyles from "@/styles/radius";
import { CAPTION_SIZE, TEXT_STYLES } from "@/styles/text";
import {
  BackgroundColor,
  bgColorClass,
  BorderColor,
  borderColorClass,
  ElementState,
  Radius,
  Size,
  TextColor,
  textColorClass,
  TextVariant,
} from "@/types";
import { cn } from "@/util/classes";

export const ResizeBehavior = {
  None: "None",
  Vertical: "Vertical",
  Horizontal: "Horizontal",
  BiDirectional: "BiDirectional",
} as const;
export type ResizeBehavior =
  `${(typeof ResizeBehavior)[keyof typeof ResizeBehavior]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ResizeBehavior {
  export type None = typeof ResizeBehavior.None;
  export type Vertical = typeof ResizeBehavior.Vertical;
  export type Horizontal = typeof ResizeBehavior.Horizontal;
  export type BiDirectional = typeof ResizeBehavior.BiDirectional;
}

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: Size;
  className?: string;
  containerClassName?: string;
  error?: boolean;
  resize?: ResizeBehavior;
}

/**
 * Fixed border radius applied to all textareas for visual consistency with the
 * rest of the form components.
 */
const TEXTAREA_RADIUS = Radius.Sm;

const sizeStyles: Record<Size, string> = {
  // TextInput's three Figma sizes; Xs and Xl extend the scale a step each way.
  // Xs takes the caption size alone so the control's own primary text colour
  // is not merged away by Caption's tertiary colour.
  [Size.Xs]: clsx("px-2.5 py-1", CAPTION_SIZE),
  [Size.Sm]: clsx("px-2.5 py-1.5", TEXT_STYLES[TextVariant.BodyTertiary]),
  [Size.Md]: clsx("px-3 py-2", TEXT_STYLES[TextVariant.BodySecondary]),
  [Size.Lg]: clsx("px-3 py-2.5", TEXT_STYLES[TextVariant.BodySecondary]),
  [Size.Xl]: clsx("px-4 py-3", TEXT_STYLES[TextVariant.BodyPrimary]),
};

const resizeStyles: Record<ResizeBehavior, string> = {
  [ResizeBehavior.None]: "resize-none",
  [ResizeBehavior.Vertical]: "resize-y",
  [ResizeBehavior.Horizontal]: "resize-x",
  [ResizeBehavior.BiDirectional]: "resize",
};

/**
 * A textarea component.
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const [value, setValue] = useState<string>("");
 *
 *   const onChange = useCallback((newValue: string) => setValue(newValue), [setValue]);
 *
 *   return (
 *     <TextArea
 *       onChange={onChange}
 *       resize="None"
 *       rows={10}
 *       value={value}
 *     />
 *   );
 * };
 * ```
 *
 * @param size The size of the textarea; this controls the size of the text itself and container padding.
 *  See {@link Size}.
 * @param error If `true`, renders the textarea in an error state.
 * @param resize Resize behavior. See {@link ResizeBehavior}.
 * @param rows The number of text rows to display in the textarea.
 * @param className `class` overrides to apply to the component.
 * @param containerClassName `class` overrides to apply to the component's container.
 * @param disabled If `true`, disables the textarea.
 * @param props Additional HTML properties to apply to the component.
 */
export const TextArea: FC<TextAreaProps> = ({
  size = Size.Md,
  error = false,
  resize = ResizeBehavior.Vertical,
  rows = 3,
  className,
  containerClassName,
  disabled,
  ...props
}) => {
  return (
    <Field className={cn("flex flex-col gap-1", containerClassName)}>
      <HeadlessTextarea
        rows={rows}
        disabled={disabled}
        className={cn(
          "w-full",
          "appearance-none",
          "transition-colors",
          "border",

          bgColorClass(BackgroundColor.Transparent),
          textColorClass(TextColor.Primary),
          formControlStyles.control,

          // Default and focus border tokens mirror the `Input` component so all
          // form controls stay visually consistent.
          error
            ? borderColorClass(BorderColor.Error)
            : borderColorClass(BorderColor.Input),
          !disabled &&
            !error &&
            borderColorClass(BorderColor.InputHover, ElementState.Hover),

          "focus:outline-none",
          error
            ? borderColorClass(BorderColor.Error, ElementState.Focus)
            : borderColorClass(BorderColor.InputFocus, ElementState.Focus),

          "disabled:opacity-50",
          "disabled:cursor-not-allowed",
          bgColorClass(BackgroundColor.Muted, ElementState.Disabled),
          borderColorClass(BorderColor.Disabled, ElementState.Disabled),

          sizeStyles[size],
          radiusStyles(TEXTAREA_RADIUS),
          resizeStyles[resize],
          className
        )}
        {...props}
      />
    </Field>
  );
};

TextArea.displayName = "TextArea";
