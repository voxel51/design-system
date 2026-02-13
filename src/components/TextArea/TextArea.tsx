import { Field, Textarea as HeadlessTextarea } from "@headlessui/react";
import clsx from "clsx";
import { type FC, TextareaHTMLAttributes } from "react";

import radiusStyles from "@/styles/radius";
import { Radius, Size } from "@/types";
import { cn } from "@/util/classes";

export enum ResizeBehavior {
  None = "None",
  Vertical = "Vertical",
  Horizontal = "Horizontal",
  BiDirectional = "BiDirectional",
}

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: Size;
  radius?: Radius;
  className?: string;
  containerClassName?: string;
  error?: boolean;
  resize?: ResizeBehavior;
}

const sizeStyles: Record<Size, string> = {
  [Size.Xs]: clsx("px-2.5 py-1.5", "text-xs/5"),
  [Size.Sm]: clsx("px-3 py-2", "text-sm/6"),
  [Size.Md]: clsx("px-3.5 py-2.5", "text-md/7"),
  [Size.Lg]: clsx("px-4 py-3", "text-lg/9"),
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
 *       resize={ResizeBehavior.None}
 *       rows={10}
 *       value={value}
 *     />
 *   );
 * };
 * ```
 *
 * @param size The size of the textarea; this controls the size of the text itself and container padding.
 *  See {@link Size}.
 * @param radius The border radius to apply to the textarea. See {@link Radius}.
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
  radius = Radius.Sm,
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
          "border",

          "bg-content-bg-card-1",
          "border-content-border-secondary-primary",
          "text-content-text-primary",
          "placeholder:text-content-text-tertiary",

          "hover:border-content-border-secondary-secondary",

          "focus:outline-none",
          "focus:ring-2",
          "focus:ring-action-primary-primary",
          "focus:ring-offset-2",
          "focus:border-action-primary-primary",

          "disabled:opacity-50",
          "disabled:cursor-not-allowed",
          "disabled:bg-content-bg-muted",

          error && "border-semantic-destructive",
          error && "focus:ring-semantic-destructive",

          sizeStyles[size],
          radiusStyles(radius),
          resizeStyles[resize],
          className
        )}
        {...props}
      />
    </Field>
  );
};

TextArea.displayName = "TextArea";
