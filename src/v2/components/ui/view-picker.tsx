import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";

/**
 * ViewPicker — grouped Select for choosing a view or sample-tag as the source
 * for a training / validation / test split. Options are Current view, Entire
 * dataset, saved views and sample tags, on the shared Select primitive so
 * keyboard behavior, styling and tokens stay consistent.
 *
 * Encoded value: `current-view` · `entire` · `view:<id>` · `tag:<id>`.
 * `none` is available on optional splits (val / test) via `allowNone`.
 *
 * Differs from the Lovable master, which reads `datasetViews` and
 * `datasetSampleTags` from a mock module: a design-system component cannot
 * own application data, so both arrive as props and default to empty. A
 * caller passing nothing gets Current view / Entire dataset only.
 */

export type SplitSourceKind =
  | "current-view"
  | "entire"
  | "saved-view"
  | "sample-tag";

export interface SplitSource {
  kind: SplitSourceKind;
  /** Saved-view or sample-tag identifier. Unset for current-view / entire. */
  name?: string;
  sampleCount: number;
}

/** An option in the Saved views or Sample tags group. */
export interface ViewPickerOption {
  id: string;
  label: string;
}

export type ViewPickerValue = string;

/** Encode a split source into the picker's string value. */
export function encodeSplitSource(
  src: SplitSource | undefined,
): ViewPickerValue {
  if (!src) return "none";
  if (src.kind === "current-view") return "current-view";
  if (src.kind === "entire") return "entire";
  if (src.kind === "saved-view") return `view:${src.name ?? ""}`;
  return `tag:${src.name ?? ""}`;
}

/**
 * Decode a picker value back into a split source. `sampleCountFallback` is
 * applied to every result — the picker knows which view is selected, not how
 * many samples it holds.
 */
export function decodeSplitSource(
  value: ViewPickerValue,
  sampleCountFallback: number,
): SplitSource | undefined {
  if (value === "none") return undefined;
  if (value === "current-view")
    return { kind: "current-view", sampleCount: sampleCountFallback };
  if (value === "entire")
    return { kind: "entire", sampleCount: sampleCountFallback };
  if (value.startsWith("view:"))
    return {
      kind: "saved-view",
      name: value.slice(5),
      sampleCount: sampleCountFallback,
    };
  if (value.startsWith("tag:"))
    return {
      kind: "sample-tag",
      name: value.slice(4),
      sampleCount: sampleCountFallback,
    };
  return undefined;
}

export interface ViewPickerProps {
  value: ViewPickerValue;
  onValueChange: (v: ViewPickerValue) => void;
  /** Saved views to list. Group is hidden when empty. */
  views?: ViewPickerOption[];
  /** Sample tags to list. Group is hidden when empty. */
  sampleTags?: ViewPickerOption[];
  /** When true, `(none)` is prepended as an option. */
  allowNone?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export function ViewPicker({
  value,
  onValueChange,
  views = [],
  sampleTags = [],
  allowNone,
  placeholder = "Select a view",
  disabled,
}: ViewPickerProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {allowNone && (
          <>
            <SelectItem value="none">(none)</SelectItem>
            <SelectSeparator />
          </>
        )}
        <SelectItem value="current-view">Current view</SelectItem>
        <SelectItem value="entire">Entire dataset</SelectItem>
        {views.length > 0 && (
          <>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Saved views</SelectLabel>
              {views.map((v) => (
                <SelectItem key={v.id} value={`view:${v.id}`}>
                  {v.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </>
        )}
        {sampleTags.length > 0 && (
          <>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Sample tags</SelectLabel>
              {sampleTags.map((t) => (
                <SelectItem key={t.id} value={`tag:${t.id}`}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </>
        )}
      </SelectContent>
    </Select>
  );
}
