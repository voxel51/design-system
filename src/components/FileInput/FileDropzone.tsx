import {
  useRef,
  useState,
  type DragEvent,
  type FC,
  type HTMLAttributes,
} from "react";

import { Icon } from "@/components/Icons";
import { Text } from "@/components/Text";
import radiusStyles from "@/styles/radius";
import {
  BackgroundColor,
  bgColorClass,
  BorderColor,
  borderColorClass,
  ElementState,
  IconColor,
  IconName,
  Radius,
  Size,
  TextColor,
  TextVariant,
} from "@/types";
import { cn } from "@/util/classes";

export interface FileDropzoneProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "onError"> {
  /** Accepted MIME types or file extensions, e.g. `"image/*"` or `".pdf,.docx"`. */
  accept?: string;
  /** Allow dropping / selecting multiple files. */
  multiple?: boolean;
  disabled?: boolean;
  /**
   * Maximum individual file size in bytes.
   * Files exceeding this are rejected and `onError` is called.
   */
  maxSize?: number;
  /** Called with accepted `File[]` after a drop or dialog selection. */
  onChange?: (files: File[]) => void;
  /** Called when files are rejected (wrong type or too large). */
  onError?: (message: string) => void;
  /** Primary label inside the drop zone. */
  label?: string;
  /** Secondary helper text inside the drop zone. */
  description?: string;
  /** Icon shown inside the drop zone. */
  icon?: IconName;
  /** External error message to display below the drop zone. */
  error?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

function matchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true;
  return accept.split(",").some((pattern) => {
    const p = pattern.trim();
    if (p.startsWith(".")) return file.name.toLowerCase().endsWith(p);
    if (p.endsWith("/*")) return file.type.startsWith(p.replace("/*", "/"));
    return file.type === p;
  });
}

/**
 * A drag-and-drop file upload zone. Also opens the native file dialog on click.
 * For a compact button-style picker use {@link FileInput} instead.
 *
 * @example
 * ```tsx
 * <FileDropzone
 *   accept="image/*"
 *   multiple
 *   maxSize={5 * 1024 * 1024}
 *   label="Drop images here"
 *   description="PNG, JPG up to 5 MB"
 *   onChange={(files) => console.log(files)}
 *   onError={(msg) => alert(msg)}
 * />
 * ```
 *
 * @param accept Accepted file types (MIME type or extension).
 * @param multiple If `true`, allows multiple files.
 * @param disabled If `true`, drag and click interactions are disabled.
 * @param maxSize Maximum file size in bytes. Rejected files trigger `onError`.
 * @param onChange Called with accepted `File[]`.
 * @param onError Called with a human-readable rejection message.
 * @param label Primary text inside the zone. Defaults to `"Drop files here"`.
 * @param description Secondary helper text.
 * @param icon Icon shown above the label. Defaults to {@link IconName.Add}.
 * @param error External error string displayed below the zone.
 * @param className `class` overrides for the root element.
 * @param props Additional HTML properties for the root element.
 */
export const FileDropzone: FC<FileDropzoneProps> = ({
  accept,
  multiple = false,
  disabled = false,
  maxSize,
  onChange,
  onError,
  label = "Drop files here",
  description,
  icon = IconName.Add,
  error,
  className,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const files = Array.from(fileList);

    const typeRejected = files.filter((f) => !matchesAccept(f, accept));
    if (typeRejected.length > 0) {
      onError?.(`File type not accepted: ${typeRejected.map((f) => f.name).join(", ")}`);
      return;
    }

    if (maxSize) {
      const sizeRejected = files.filter((f) => f.size > maxSize);
      if (sizeRejected.length > 0) {
        onError?.(`File too large (max ${formatBytes(maxSize)}): ${sizeRejected.map((f) => f.name).join(", ")}`);
        return;
      }
    }

    const accepted = multiple ? files : [files[0]];
    onChange?.(accepted);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    // Only clear if leaving the zone entirely (not a child element)
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled) processFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!disabled && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-2",
          "w-full px-6 py-8",
          "border-2 border-dashed",
          "transition-colors",
          radiusStyles(Radius.Lg),
          bgColorClass(BackgroundColor.Card1),
          bgColorClass(BackgroundColor.Card2, ElementState.Hover),
          error
            ? borderColorClass(BorderColor.Error)
            : isDragging
              ? borderColorClass(BorderColor.Active)
              : borderColorClass(BorderColor.Default),
          isDragging && bgColorClass(BackgroundColor.Muted),
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer focus:outline-none focus-visible:ring-2"
        )}
        {...props}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => processFiles(e.target.files)}
          className="sr-only"
          tabIndex={-1}
          aria-hidden
        />

        <Icon
          name={icon}
          size={Size.Xl}
          color={isDragging ? IconColor.Brand : IconColor.Subtle}
        />

        <div className="flex flex-col items-center gap-0.5 text-center">
          <Text variant={TextVariant.Md} color={isDragging ? TextColor.Primary : TextColor.Secondary}>
            {label}
          </Text>
          {description && (
            <Text variant={TextVariant.Sm} color={TextColor.Muted}>
              {description}
            </Text>
          )}
          {!description && (
            <Text variant={TextVariant.Sm} color={TextColor.Muted}>
              or click to browse
            </Text>
          )}
        </div>
      </div>

      {error && (
        <Text variant={TextVariant.Sm} color={TextColor.Destructive}>
          {error}
        </Text>
      )}
    </div>
  );
};

FileDropzone.displayName = "FileDropzone";
