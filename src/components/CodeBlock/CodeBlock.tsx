import type { FC, HTMLAttributes, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/Button";
import { CheckIcon, ContentCopyIcon } from "@/components/Icons";
import radiusStyles from "@/styles/radius";
import {
  BackgroundColor,
  bgColorClass,
  BorderColor,
  borderColorClass,
  Radius,
  Size,
  TextColor,
  textColorClass,
  Variant,
} from "@/types";
import { cn } from "@/util/classes";

const COPIED_DURATION = 2000;

export interface CodeBlockProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  children?: ReactNode;
  code: string;
  copyable?: boolean;
  lineNumbers?: boolean;
}

/**
 * A block of code, with copying it one click away.
 *
 * The block renders `code` as written. A caller that highlights its own code
 * passes the marked-up result as `children`; `code` is still what the copy
 * control puts on the clipboard, so a highlighter's markup never reaches it.
 *
 * @example
 * ```tsx
 * <CodeBlock code={'print("hello")'} />
 *
 * <CodeBlock code={source}>
 *   <Highlighted source={source} language="python" />
 * </CodeBlock>
 * ```
 *
 * @param children Optional marked-up rendering of `code`, such as a highlighter's output.
 * @param className `class` overrides to apply to the component.
 * @param code The code to display, and what the copy control copies.
 * @param copyable Whether the block offers a copy control.
 * @param lineNumbers Whether the block is numbered down its left edge.
 * @param props Additional HTML properties to apply to the component.
 */
export const CodeBlock: FC<CodeBlockProps> = ({
  children,
  className,
  code,
  copyable = true,
  lineNumbers = false,
  ...props
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const timeout = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timeout.current), []);

  const copy = useCallback(() => {
    navigator.clipboard?.writeText(code).then(
      () => {
        setCopied(true);
        window.clearTimeout(timeout.current);
        timeout.current = window.setTimeout(
          () => setCopied(false),
          COPIED_DURATION
        );
      },
      () => undefined
    );
  }, [code]);

  const lines = lineNumbers ? code.split("\n") : undefined;

  return (
    <div
      className={cn(
        "group relative flex w-full overflow-hidden font-mono text-sm leading-[1.75]",
        radiusStyles(Radius.Md),
        bgColorClass(BackgroundColor.Card2),
        textColorClass(TextColor.Primary),
        className
      )}
      {...props}
    >
      {lines && (
        <ol
          aria-hidden
          className={cn(
            "shrink-0 select-none list-none py-3 pl-4 pr-3 text-right",
            "border-r",
            borderColorClass(BorderColor.Default),
            textColorClass(TextColor.Muted)
          )}
        >
          {lines.map((_, index) => (
            <li key={index}>{index + 1}</li>
          ))}
        </ol>
      )}
      <pre className="min-w-0 flex-1 overflow-x-auto px-4 py-3" translate="no">
        <code>{children ?? code}</code>
      </pre>
      {copyable && (
        <Button
          aria-label={copied ? "Copied" : "Copy"}
          className={cn(
            "absolute right-1 top-1 opacity-0 transition-opacity",
            "group-hover:opacity-100 focus-visible:opacity-100"
          )}
          leadingIcon={copied ? CheckIcon : ContentCopyIcon}
          onClick={copy}
          size={Size.Sm}
          title={copied ? "Copied" : "Copy"}
          variant={Variant.Secondary}
        />
      )}
    </div>
  );
};
