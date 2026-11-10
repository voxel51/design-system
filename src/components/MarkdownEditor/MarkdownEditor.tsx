import type { FC, ReactNode } from "react";

import radiusStyles from "@/styles/radius";
import { TEXT_STYLES } from "@/styles/text";
import {
  BorderColor,
  borderColorClass,
  Radius,
  TextColor,
  textColorClass,
  TextVariant,
} from "@/types";
import { cn } from "@/util/classes";

import { TextArea } from "../TextArea";
import { ToggleSwitch } from "../ToggleSwitch";

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  /** Renders the Preview tab; VOODO ships no markdown renderer, the app supplies its own. */
  renderPreview: (value: string) => ReactNode;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  /** Shown on the Preview tab while `value` is empty. */
  emptyPreview?: ReactNode;
  "aria-label"?: string;
  className?: string;
}

const LINE_HEIGHT = 20;
const BOX_PADDING = 18;

/**
 * A markdown text editor with a Write / Preview switch above one bordered box.
 * The text is edited as plain markdown and the Preview side shows it through
 * the `renderPreview` you supply.
 *
 * @example
 * ```tsx
 * const [note, setNote] = useState("");
 *
 * <MarkdownEditor
 *   value={note}
 *   onChange={setNote}
 *   renderPreview={(text) => <Markdown>{text}</Markdown>}
 *   placeholder="Leave a note"
 * />
 * ```
 *
 * @param value The markdown text.
 * @param onChange Called with the new text on every edit.
 * @param renderPreview Renders the Preview tab from the current text.
 * @param placeholder Placeholder of the Write tab.
 * @param rows Height of the box in text rows. Defaults to 10.
 * @param disabled If `true`, the text cannot be edited.
 * @param emptyPreview What the Preview tab shows while `value` is empty. Defaults to "Nothing to preview".
 * @param aria-label Names the text box.
 * @param className `class` overrides to apply to the component.
 */
export const MarkdownEditor: FC<MarkdownEditorProps> = ({
  value,
  onChange,
  renderPreview,
  placeholder,
  rows = 10,
  disabled,
  emptyPreview = "Nothing to preview",
  "aria-label": ariaLabel,
  className,
}) => {
  return (
    <ToggleSwitch
      size="sm"
      className={cn("flex flex-col gap-2", className)}
      tabs={[
        {
          id: "write",
          data: {
            label: "Write",
            content: (
              <TextArea
                aria-label={ariaLabel}
                rows={rows}
                value={value}
                disabled={disabled}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
              />
            ),
          },
        },
        {
          id: "preview",
          data: {
            label: "Preview",
            content: (
              <div
                className={cn(
                  "w-full max-h-[50vh] overflow-y-auto border px-3 py-2",
                  borderColorClass(BorderColor.Input),
                  radiusStyles(Radius.Sm),
                  textColorClass(TextColor.Primary),
                  TEXT_STYLES[TextVariant.BodySecondary]
                )}
                style={{ minHeight: rows * LINE_HEIGHT + BOX_PADDING }}
              >
                {value.trim() ? (
                  renderPreview(value)
                ) : (
                  <span className={textColorClass(TextColor.Tertiary)}>
                    {emptyPreview}
                  </span>
                )}
              </div>
            ),
          },
        },
      ]}
    />
  );
};

MarkdownEditor.displayName = "MarkdownEditor";
