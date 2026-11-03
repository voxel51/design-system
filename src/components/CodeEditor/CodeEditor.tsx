import type { EditorProps, Monaco } from "@monaco-editor/react";
import {
  type FC,
  type HTMLAttributes,
  lazy,
  Suspense,
  useEffect,
  useState,
} from "react";

import { Spinner } from "@/components/Spinner";
import radiusStyles from "@/styles/radius";
import { type ColorMode, useColorMode } from "@/theme/useColorPalette";
import {
  BackgroundColor,
  BorderColor,
  borderColorClass,
  getColorCssVar,
  Radius,
  TextColor,
} from "@/types";
import { cn } from "@/util/classes";

const MonacoEditor = lazy(() => import("@monaco-editor/react"));

const THEME = "voodo";

const resolve = (cssVar: string): string | undefined => {
  const name = /var\((--[^)]+)\)/.exec(cssVar)?.[1];
  const value = name
    ? window
        .getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim()
    : "";
  // Monaco takes #RRGGBB(AA) only
  const hex = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(value)?.[1];
  if (!hex) return undefined;
  return `#${hex.length > 4 ? hex : [...hex].map((c) => c + c).join("")}`;
};

const applyTheme = (monaco: Monaco, mode: ColorMode): void => {
  const colors = Object.fromEntries(
    Object.entries({
      "editor.background": resolve(getColorCssVar(BackgroundColor.CardNested)),
      "editor.foreground": resolve(getColorCssVar(TextColor.Primary)),
      "editorLineNumber.foreground": resolve(
        getColorCssVar(TextColor.Tertiary)
      ),
      "editorLineNumber.activeForeground": resolve(
        getColorCssVar(TextColor.Secondary)
      ),
    }).filter((entry): entry is [string, string] => Boolean(entry[1]))
  );
  monaco.editor.defineTheme(THEME, {
    base: mode === "dark" ? "vs-dark" : "vs",
    inherit: true,
    rules: [],
    colors,
  });
  monaco.editor.setTheme(THEME);
};

export interface CodeEditorProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  height?: number | string;
  options?: EditorProps["options"];
}

/**
 * An editable code editor (Monaco) themed with VOODO tokens, for JSON and
 * config editing. Use {@link CodeBlock} to show a read-only snippet.
 *
 * Monaco loads lazily on first render, so it costs nothing until used; install
 * the optional peer `@monaco-editor/react` in the consuming app. The editor
 * follows the light/dark mode and keeps Monaco's `.monaco-editor` root.
 *
 * @example
 * ```tsx
 * <CodeEditor
 *   language="json"
 *   value={json}
 *   onChange={setJson}
 *   height={320}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <CodeEditor value={JSON.stringify(doc, null, 2)} readOnly height="60vh" />
 * ```
 *
 * @param value The controlled text.
 * @param defaultValue The initial text when uncontrolled.
 * @param onChange Called with the full text on every edit.
 * @param language Monaco language id. Defaults to `"json"`.
 * @param readOnly If `true`, the text can be selected but not edited.
 * @param height Editor height (CSS length or px). Defaults to `"100%"`.
 * @param options Extra Monaco editor options, merged over VOODO's defaults.
 * @param className `class` overrides for the framed container.
 * @param props Additional HTML properties for the container.
 */
export const CodeEditor: FC<CodeEditorProps> = ({
  value,
  defaultValue,
  onChange,
  language = "json",
  readOnly,
  height = "100%",
  options,
  className,
  style,
  ...props
}) => {
  const mode = useColorMode();
  const [monaco, setMonaco] = useState<Monaco | null>(null);

  useEffect(() => {
    if (monaco) applyTheme(monaco, mode);
  }, [monaco, mode]);

  return (
    <div
      className={cn(
        "min-h-0 overflow-hidden border",
        borderColorClass(BorderColor.Default),
        radiusStyles(Radius.Md),
        className
      )}
      style={{ height, ...style }}
      {...props}
    >
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center">
            <Spinner />
          </div>
        }
      >
        <MonacoEditor
          height="100%"
          language={language}
          value={value}
          defaultValue={defaultValue}
          theme={THEME}
          loading={<Spinner />}
          beforeMount={(m) => applyTheme(m, mode)}
          onMount={(_, m) => setMonaco(m)}
          onChange={(next) => onChange?.(next ?? "")}
          options={{
            readOnly,
            automaticLayout: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            renderLineHighlight: "none",
            fontSize: 13,
            tabSize: 2,
            padding: { top: 8, bottom: 8 },
            ...options,
          }}
        />
      </Suspense>
    </div>
  );
};

CodeEditor.displayName = "CodeEditor";
