import { useRef, type FC, type HTMLAttributes } from "react";

import { Button, type ButtonProps } from "@/components/Button";
import { Text } from "@/components/Text";
import { IconName, Size, TextColor, TextVariant, Variant } from "@/types";

type ButtonSize = NonNullable<ButtonProps["size"]>;
import { cn } from "@/util/classes";

export interface FileInputProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Accepted MIME types or file extensions, e.g. `"image/*"` or `".pdf,.docx"`. */
  accept?: string;
  /** Allow selecting multiple files. */
  multiple?: boolean;
  disabled?: boolean;
  /** Callback fired when the user selects files. */
  onChange?: (files: File[]) => void;
  /** Button label. */
  label?: string;
  /** Size of the trigger button. */
  size?: ButtonSize;
  /** Shows the selected file name(s) next to the button. */
  showFileName?: boolean;
}

/**
 * A compact file picker that opens the native file dialog on click.
 * For a drag-and-drop surface use {@link FileDropzone} instead.
 *
 * @example
 * ```tsx
 * <FileInput
 *   accept="image/*"
 *   multiple
 *   onChange={(files) => console.log(files)}
 * />
 * ```
 *
 * @param accept Accepted file types passed to the underlying `<input>`.
 * @param multiple If `true`, allows selecting multiple files.
 * @param disabled If `true`, disables the trigger button.
 * @param onChange Called with the selected `File[]` when the dialog closes.
 * @param label Text shown on the trigger button. Defaults to `"Choose file"`.
 * @param size Size of the trigger button. See {@link Size}.
 * @param showFileName When `true`, the selected file name is shown after the button.
 * @param className `class` overrides for the root wrapper.
 * @param props Additional HTML properties for the root wrapper.
 */
export const FileInput: FC<FileInputProps> = ({
  accept,
  multiple = false,
  disabled = false,
  onChange,
  label = "Choose file",
  size = Size.Md as ButtonSize,
  showFileName = true,
  className,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = () => {
    const files = Array.from(inputRef.current?.files ?? []);
    if (files.length > 0) onChange?.(files);
  };

  const fileLabel = inputRef.current?.files?.length
    ? Array.from(inputRef.current.files)
        .map((f) => f.name)
        .join(", ")
    : "No file chosen";

  return (
    <div className={cn("flex items-center gap-3", className)} {...props}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleChange}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
      />
      <Button
        variant={Variant.Secondary}
        size={size}
        disabled={disabled}
        leadingIcon={IconName.Add}
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        {label}
      </Button>
      {showFileName && (
        <Text variant={TextVariant.Sm} color={TextColor.Muted}>
          {fileLabel}
        </Text>
      )}
    </div>
  );
};

FileInput.displayName = "FileInput";
