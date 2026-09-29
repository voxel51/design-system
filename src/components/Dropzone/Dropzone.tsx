import clsx from "clsx";
import {
  type FC,
  type HTMLAttributes,
  type ReactNode,
  useRef,
  useState,
} from "react";

import radiusStyles from "@/styles/radius";
import { Radius, TextColor, textColorClass } from "@/types";

export interface DropzoneProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onDrop" | "onDragOver" | "onDragLeave" | "onClick" | "onKeyDown" | "title"
> {
  onFiles: (files: File[]) => void;
  title: ReactNode;
  description?: ReactNode;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
}

/**
 * A dashed drop target for files. Clicking it, or pressing Enter or Space,
 * opens the file picker; dragging files over it highlights it.
 *
 * @example
 * ```tsx
 * <Dropzone
 *   title="Drop images or videos"
 *   description="or click to browse your computer"
 *   accept="image/*,video/*"
 *   onFiles={addFiles}
 * />
 * ```
 *
 * @param onFiles Called with the dropped or picked files.
 * @param title The main prompt.
 * @param description Secondary text shown under the title.
 * @param accept File types the picker offers, as in the `accept` attribute of a file input.
 * @param multiple Whether more than one file can be picked. Defaults to `true`.
 * @param disabled If `true`, ignores clicks and drops and dims the drop target.
 * @param className Additional CSS class names to apply to the drop target.
 * @param props Additional HTML properties to apply to the drop target.
 */
export const Dropzone: FC<DropzoneProps> = ({
  onFiles,
  title,
  description,
  accept,
  multiple = true,
  disabled = false,
  className,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const browse = (): void => {
    if (!disabled) inputRef.current?.click();
  };
  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      data-dragging={dragging || undefined}
      className={clsx(
        "flex w-full cursor-pointer flex-col items-center justify-center gap-[4px] border border-dashed px-[24px] py-[48px] text-center transition-colors",
        radiusStyles(Radius.Lg),
        dragging
          ? "border-brand-primary bg-brand-primary/10"
          : "border-content-border-input hover:border-content-border-hover",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      onClick={browse}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          browse();
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        if (!disabled) onFiles(Array.from(event.dataTransfer.files));
      }}
      {...props}
    >
      <span className={clsx("text-lg/5", textColorClass(TextColor.Primary))}>
        {title}
      </span>
      {description && (
        <span
          className={clsx("text-md/5", textColorClass(TextColor.Secondary))}
        >
          {description}
        </span>
      )}
      <input
        ref={inputRef}
        type="file"
        hidden
        accept={accept}
        multiple={multiple}
        onChange={(event) => {
          onFiles(Array.from(event.target.files ?? []));
          event.target.value = "";
        }}
      />
    </div>
  );
};

Dropzone.displayName = "Dropzone";
