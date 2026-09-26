import type { FC } from "react";
// The `Light` build registers only the languages named below. The default
// export carries all ~190 hljs languages, which no consumer wants on the
// critical path.
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import bash from "react-syntax-highlighter/dist/cjs/languages/hljs/bash.js";
import javascript from "react-syntax-highlighter/dist/cjs/languages/hljs/javascript.js";
import json from "react-syntax-highlighter/dist/cjs/languages/hljs/json.js";
import python from "react-syntax-highlighter/dist/cjs/languages/hljs/python.js";
import typescript from "react-syntax-highlighter/dist/cjs/languages/hljs/typescript.js";
import yaml from "react-syntax-highlighter/dist/cjs/languages/hljs/yaml.js";
import a11yDark from "react-syntax-highlighter/dist/cjs/styles/hljs/a11y-dark.js";
import a11yLight from "react-syntax-highlighter/dist/cjs/styles/hljs/a11y-light.js";

import { useColorMode } from "@/theme";

SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("yaml", yaml);

export type HighlightedLanguage =
  | "bash"
  | "javascript"
  | "json"
  | "python"
  | "typescript"
  | "yaml";

export interface HighlightedProps {
  code: string;
  language?: HighlightedLanguage;
}

/**
 * Code marked up by language, for a {@link CodeBlock} to frame.
 *
 * It renders spans rather than its own `pre`, so it nests inside the block
 * that holds it, and it follows the color mode.
 *
 * @example
 * ```tsx
 * <CodeBlock code={source}>
 *   <Highlighted code={source} language="python" />
 * </CodeBlock>
 * ```
 *
 * @param code The code to mark up.
 * @param language The language to mark it up as.
 */
export const Highlighted: FC<HighlightedProps> = ({
  code,
  language = "python",
}) => {
  const mode = useColorMode();

  return (
    <SyntaxHighlighter
      CodeTag="span"
      PreTag="span"
      customStyle={{ background: "none", margin: 0, padding: 0 }}
      language={language}
      style={mode === "light" ? a11yLight : a11yDark}
    >
      {code}
    </SyntaxHighlighter>
  );
};

Highlighted.displayName = "Highlighted";
