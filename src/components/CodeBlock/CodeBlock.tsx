import { Highlight, type PrismTheme } from "prism-react-renderer";
import { type FC, type HTMLAttributes, type ReactNode } from "react";

import { CopyAction } from "@/components/CopyAction";
import { textStyles } from "@/styles/text";
import {
  BackgroundColor,
  bgColorClass,
  getColorCssVar,
  TextColor,
  TextVariant,
} from "@/types";
import { cn } from "@/util/classes";

// Syntax colours from the text tokens, so they follow light and dark
const theme: PrismTheme = {
  plain: {
    color: getColorCssVar(TextColor.Secondary),
    backgroundColor: "transparent",
  },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: { color: getColorCssVar(TextColor.Tertiary), fontStyle: "italic" },
    },
    {
      types: ["punctuation", "operator"],
      style: { color: getColorCssVar(TextColor.Tertiary) },
    },
    {
      types: ["keyword", "builtin", "important", "atrule"],
      style: { color: getColorCssVar(TextColor.Info) },
    },
    {
      types: ["string", "char", "attr-value", "regex", "inserted"],
      style: { color: getColorCssVar(TextColor.Success) },
    },
    {
      types: ["number", "boolean", "constant", "symbol"],
      style: { color: getColorCssVar(TextColor.Warning) },
    },
    {
      types: ["function", "class-name", "property", "tag", "selector"],
      style: { color: getColorCssVar(TextColor.Primary) },
    },
    { types: ["deleted"], style: { color: getColorCssVar(TextColor.Failure) } },
  ],
};

const preClassName = cn(
  "min-h-0 overflow-auto",
  textStyles(TextVariant.CodePrimary),
  "leading-5"
);

export interface CodeBlockProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onCopy" | "children"
> {
  code: string;
  children?: ReactNode;
  language?: string;
  onCopy?: (code: string) => void;
  wrap?: boolean;
}

/**
 * A read-only code snippet on a card, with a copy action in its corner.
 *
 * @param code The code to show and copy.
 * @param language A Prism language for syntax colours (`"python"`, `"json"`,
 *  `"yaml"`, `"ts"`, ...). Defaults to `"python"`; unknown languages render plain.
 * @param children Already highlighted markup to show instead of `language`
 *  colours; `code` is still what is copied.
 * @param onCopy Called with the code after it is copied.
 * @param wrap Soft-wraps long lines instead of scrolling sideways.
 * @param props Additional HTML properties to apply to the card.
 *
 * @example
 * ```tsx
 * <CodeBlock
 *   language="python"
 *   code={'import fiftyone as fo\n\ndataset = fo.load_dataset("quickstart")'}
 *   onCopy={() => toast("Copied")}
 * />
 * ```
 */
export const CodeBlock: FC<CodeBlockProps> = ({
  code,
  language = "python",
  children,
  onCopy,
  wrap,
  className,
  ...props
}) => {
  const preClass = cn(preClassName, wrap && "whitespace-pre-wrap break-words");
  return (
    <div
      data-testid="code"
      {...props}
      className={cn(
        "relative flex min-w-0 flex-col rounded-md p-4 pr-12",
        bgColorClass(BackgroundColor.Card),
        className
      )}
    >
      {children !== undefined ? (
        <pre className={preClass} style={theme.plain}>
          <code>{children}</code>
        </pre>
      ) : (
        <Highlight code={code.trimEnd()} language={language} theme={theme}>
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre style={style} className={preClass}>
              <code>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    {line.map((part, key) => (
                      <span key={key} {...getTokenProps({ token: part })} />
                    ))}
                  </div>
                ))}
              </code>
            </pre>
          )}
        </Highlight>
      )}
      <CopyAction
        text={code}
        onCopy={onCopy}
        className="absolute top-2 right-2"
      />
    </div>
  );
};

CodeBlock.displayName = "CodeBlock";
