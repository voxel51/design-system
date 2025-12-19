import radiusStyles from "@/styles/radius";
import { Radius, Size } from "@/types";
import { cn } from "@/util/classes";
import { Field, Textarea as HeadlessTextarea } from "@headlessui/react";
import clsx from "clsx";
import { type FC, TextareaHTMLAttributes } from "react";

type ModifiedTextAreaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "size" | "className"
>;

export interface TextAreaProps extends ModifiedTextAreaProps {
  // Sizing & Styling
  size?: Size;
  radius?: Radius;
  className?: string;
  containerClassName?: string;
  error?: boolean;
  resize?: "none" | "vertical" | "horizontal" | "both";
}

const sizeStyles: Record<Size, string> = {
  [Size.Xs]: clsx("px-2.5 py-1.5", "text-xs/5"),
  [Size.Sm]: clsx("px-3 py-2", "text-sm/6"),
  [Size.Md]: clsx("px-3.5 py-2.5", "text-md/7"),
  [Size.Lg]: clsx("px-4 py-3", "text-lg/9"),
};

const resizeStyles: Record<NonNullable<TextAreaProps["resize"]>, string> = {
  none: "resize-none",
  vertical: "resize-y",
  horizontal: "resize-x",
  both: "resize",
};

export const TextArea: FC<TextAreaProps> = ({
  size = Size.Md,
  radius = Radius.Sm,
  error = false,
  resize = "vertical",
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
