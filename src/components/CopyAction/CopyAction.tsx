import { type FC, useEffect, useState } from "react";

import { IconAction, type IconActionProps } from "@/components/IconAction";
import { CheckIcon, CopyIcon } from "@/components/Icons";
import { Size } from "@/types";

export interface CopyActionProps extends Omit<
  IconActionProps,
  "icon" | "aria-label" | "onClick" | "active" | "onCopy"
> {
  /** The text copied to the clipboard. */
  text: string;
  /** Called with the text once it is copied. */
  onCopy?: (text: string) => void;
}

/**
 * An icon action that copies text to the clipboard, then shows a check for a
 * moment. Its accessible name is "Copy", and "Copied" while the check shows.
 *
 * @example
 * ```tsx
 * <CopyAction text={traceback} />
 * ```
 *
 * @param text The text copied to the clipboard.
 * @param onCopy Called with the text once it is copied.
 * @param size `"xs"`, `"sm"`, `"md"` or `"lg"`. Defaults to `"sm"`.
 * @param props Other {@link IconAction} props, such as `className`.
 */
export const CopyAction: FC<CopyActionProps> = ({
  text,
  onCopy,
  size = Size.Sm,
  ...props
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timeout = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  return (
    <IconAction
      {...props}
      size={size}
      aria-label={copied ? "Copied" : "Copy"}
      icon={copied ? CheckIcon : CopyIcon}
      onClick={() => {
        navigator.clipboard
          ?.writeText(text)
          .then(() => {
            setCopied(true);
            onCopy?.(text);
          })
          .catch(() => undefined);
      }}
    />
  );
};

CopyAction.displayName = "CopyAction";
