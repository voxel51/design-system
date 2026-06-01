import clsx from "clsx";
import {
  CSSProperties,
  KeyboardEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ScrubberThumb } from "@/components/Scrubber/ScrubberThumb";
import { ScrubberTick } from "@/components/Scrubber/ScrubberTick";
import radiusStyles from "@/styles/radius";
import { BackgroundColor, bgColorClass, Orientation, Radius } from "@/types";

export type ScrubberLabelMode = "always" | "scrubbing" | "hover";

export interface ScrubberProps<T> {
  /** Minimum value of the scrubbing range. */
  min: T;
  /** Maximum value of the scrubbing range. */
  max: T;
  /** Current value. Clamped to `[min, max]` for display. */
  value: T;
  /** Fired when the user commits a new value (pointer release, keyup). */
  onChange: (value: T) => void;
  /**
   * Fired live while dragging or holding a key. Use this for scroll-following
   * UIs; otherwise rely on `onChange`.
   */
  onScrub?: (value: T) => void;
  /**
   * Maps a value of type `T` into a numeric position space used for layout
   * and drag math. Required for non-numeric `T` (e.g. `Date`); for numeric
   * `T` the default is the identity function.
   */
  toPosition?: (value: T) => number;
  /** Inverse of {@link toPosition}. Required for non-numeric `T`. */
  fromPosition?: (position: number) => T;
  /**
   * Layout axis. `Orientation.Row` lays the scrubber out horizontally;
   * `Orientation.Column` lays it out vertically. Defaults to `Row`.
   */
  orientation?: Orientation;
  /**
   * Explicit tick values, each rendered as a perpendicular mark on the
   * track. Values outside `[min, max]` are ignored.
   */
  ticks?: readonly T[];
  /** Optional label rendered alongside each tick. */
  renderTickLabel?: (value: T, index: number) => ReactNode;
  /** Floating thumb label. Defaults to `String(value)`. */
  renderLabel?: (value: T) => ReactNode;
  /** When to show the floating thumb label. Defaults to `"scrubbing"`. */
  labelMode?: ScrubberLabelMode;
  /**
   * Keyboard step in *position space* — the amount added/subtracted per
   * arrow key. Defaults to `(toPosition(max) - toPosition(min)) / 100`.
   */
  step?: number;
  /**
   * When `true`, hovering reveals an inline input next to the thumb. The
   * user can type a new value directly; on Enter or blur the parsed value
   * is committed via `onChange`. Defaults to `false`.
   */
  editable?: boolean;
  /**
   * Parses the user's typed text back into a value. Returning `null` (or
   * throwing) aborts the commit and the input snaps back to the prior
   * formatted value. Defaults to `parseFloat` for numeric `T`; required
   * for non-numeric `T` when `editable` is `true`.
   */
  parseInput?: (text: string) => T | null;
  /**
   * Formats the current value into the text shown in the editable input.
   * Defaults to `String(value)`.
   */
  formatInput?: (value: T) => string;
  className?: string;
  "aria-label"?: string;
}

const TRACK_THICKNESS_PX = 4;

const identity = <T,>(v: T) => v as unknown as number;
const inverseIdentity = <T,>(p: number) => p as unknown as T;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * A controlled scrubber: a track + draggable thumb that moves continuously
 * over a `[min, max]` range. Supports horizontal and vertical orientations,
 * optional tick marks, and a floating label that tracks the thumb.
 *
 * The component is generic over the value type. For non-numeric `T` (e.g.
 * `Date`), pass `toPosition` / `fromPosition` to map between `T` and a
 * numeric position space used internally for layout and drag math.
 *
 * @example Continuous scroll-position scrubber for a Grid.
 * ```tsx
 * <Scrubber
 *   min={0}
 *   max={totalScrollPx}
 *   value={scrollPx}
 *   onChange={setScrollPx}
 *   onScrub={setScrollPx}
 * />
 * ```
 *
 * @example Date scrubber.
 * ```tsx
 * <Scrubber
 *   min={start}
 *   max={end}
 *   value={selected}
 *   onChange={setSelected}
 *   toPosition={(d) => d.getTime()}
 *   fromPosition={(n) => new Date(n)}
 *   ticks={monthBoundaries}
 *   renderLabel={(d) => d.toLocaleDateString()}
 * />
 * ```
 */
const defaultParseInput = <T,>(text: string): T | null => {
  const n = Number.parseFloat(text);
  return Number.isFinite(n) ? (n as unknown as T) : null;
};

export function Scrubber<T>({
  min,
  max,
  value,
  onChange,
  onScrub,
  toPosition = identity,
  fromPosition = inverseIdentity,
  orientation = Orientation.Row,
  ticks,
  renderTickLabel,
  renderLabel,
  labelMode = "scrubbing",
  step,
  editable = false,
  parseInput = defaultParseInput,
  formatInput,
  className,
  "aria-label": ariaLabel,
}: ScrubberProps<T>) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [inputText, setInputText] = useState<string>("");

  // Reflect the current value into the input whenever it changes externally
  // (and we aren't actively editing).
  useEffect(() => {
    if (!editing) {
      setInputText(formatInput ? formatInput(value) : String(value));
    }
  }, [editing, formatInput, value]);

  const horizontal = orientation === Orientation.Row;

  const minPos = useMemo(() => toPosition(min), [min, toPosition]);
  const maxPos = useMemo(() => toPosition(max), [max, toPosition]);
  const range = maxPos - minPos;
  const stepSize = step ?? (range === 0 ? 1 : range / 100);

  const valuePos = toPosition(value);
  const position = range === 0 ? 0 : clamp((valuePos - minPos) / range, 0, 1);

  // Track the last emitted position so `onScrub` is gated to monotonic changes
  // larger than a sub-pixel jitter, avoiding firing identical values.
  const lastEmittedPosRef = useRef(valuePos);

  const valueFromFraction = useCallback(
    (fraction: number) => {
      const f = clamp(fraction, 0, 1);
      return fromPosition(minPos + f * range);
    },
    [fromPosition, minPos, range]
  );

  const pointerFraction = useCallback(
    (clientX: number, clientY: number) => {
      const track = trackRef.current;
      if (!track) return 0;
      const rect = track.getBoundingClientRect();
      if (horizontal) {
        return rect.width === 0 ? 0 : (clientX - rect.left) / rect.width;
      }
      return rect.height === 0 ? 0 : (clientY - rect.top) / rect.height;
    },
    [horizontal]
  );

  const emit = useCallback(
    (next: T, live: boolean) => {
      const nextPos = toPosition(next);
      if (live) {
        if (nextPos === lastEmittedPosRef.current) return;
        lastEmittedPosRef.current = nextPos;
        onScrub?.(next);
      } else {
        lastEmittedPosRef.current = nextPos;
        onChange(next);
      }
    },
    [onChange, onScrub, toPosition]
  );

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const track = trackRef.current;
      if (!track) return;
      track.setPointerCapture(event.pointerId);
      setScrubbing(true);
      lastEmittedPosRef.current = valuePos;
      emit(
        valueFromFraction(pointerFraction(event.clientX, event.clientY)),
        true
      );
    },
    [emit, pointerFraction, valueFromFraction, valuePos]
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!scrubbing) return;
      emit(
        valueFromFraction(pointerFraction(event.clientX, event.clientY)),
        true
      );
    },
    [emit, pointerFraction, scrubbing, valueFromFraction]
  );

  const handlePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!scrubbing) return;
      trackRef.current?.releasePointerCapture(event.pointerId);
      setScrubbing(false);
      emit(
        valueFromFraction(pointerFraction(event.clientX, event.clientY)),
        false
      );
    },
    [emit, pointerFraction, scrubbing, valueFromFraction]
  );

  // Keep ref in sync when value changes externally between drags.
  useEffect(() => {
    if (!scrubbing) lastEmittedPosRef.current = valuePos;
  }, [scrubbing, valuePos]);

  const stepBy = useCallback(
    (delta: number) => {
      const nextPos = clamp(valuePos + delta, minPos, maxPos);
      if (nextPos !== valuePos) emit(fromPosition(nextPos), false);
    },
    [emit, fromPosition, maxPos, minPos, valuePos]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const decKey = horizontal ? "ArrowLeft" : "ArrowUp";
      const incKey = horizontal ? "ArrowRight" : "ArrowDown";
      switch (event.key) {
        case decKey:
          event.preventDefault();
          stepBy(-stepSize);
          break;
        case incKey:
          event.preventDefault();
          stepBy(stepSize);
          break;
        case "Home":
          event.preventDefault();
          emit(fromPosition(minPos), false);
          break;
        case "End":
          event.preventDefault();
          emit(fromPosition(maxPos), false);
          break;
        default:
          break;
      }
    },
    [emit, fromPosition, horizontal, maxPos, minPos, stepBy, stepSize]
  );

  const showsLabel =
    labelMode === "always" ||
    (labelMode === "scrubbing" && scrubbing) ||
    (labelMode === "hover" && (hovered || scrubbing));

  const tickEntries = useMemo(() => {
    if (!ticks || ticks.length === 0) return [];
    return ticks
      .map((v, i) => {
        const p = toPosition(v);
        if (p < minPos || p > maxPos) return null;
        return {
          value: v,
          index: i,
          fraction: range === 0 ? 0 : (p - minPos) / range,
        };
      })
      .filter(<U,>(x: U | null): x is U => x !== null);
  }, [maxPos, minPos, range, ticks, toPosition]);

  const trackStyle: CSSProperties = horizontal
    ? { height: TRACK_THICKNESS_PX, width: "100%" }
    : { width: TRACK_THICKNESS_PX, height: "100%" };

  return (
    // Outer wrapper has no padding — the scrubber's bounding box is just
    // the track. Thumb, tick labels, and the floating label all overflow
    // inward (above the track in Row mode, to the left in Column mode).
    // Parent containers should hug the relevant edge of their layout.
    <div
      className={clsx(
        "relative select-none",
        horizontal ? "w-full" : "h-full inline-flex flex-col",
        className
      )}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-valuemin={minPos}
        aria-valuemax={maxPos}
        aria-valuenow={valuePos}
        aria-orientation={horizontal ? "horizontal" : "vertical"}
        className={clsx(
          "relative cursor-pointer touch-none",
          bgColorClass(BackgroundColor.Muted),
          radiusStyles(Radius.Full)
        )}
        style={trackStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
      >
        {tickEntries.map(({ value: v, index, fraction }) => (
          <ScrubberTick
            key={index}
            position={fraction}
            orientation={orientation}
            label={renderTickLabel?.(v, index)}
            active={Math.abs(fraction - position) < 1e-6}
          />
        ))}

        <ScrubberThumb
          position={position}
          orientation={orientation}
          label={
            showsLabel && !(editable && (hovered || editing))
              ? (renderLabel?.(value) ?? String(value))
              : undefined
          }
        />

        {editable && (hovered || editing) && (
          <input
            ref={inputRef}
            value={inputText}
            onChange={(e) => {
              setEditing(true);
              setInputText(e.target.value);
            }}
            onFocus={() => setEditing(true)}
            onBlur={() => {
              setEditing(false);
              const parsed = parseInput(inputText);
              if (parsed !== null && parsed !== undefined) onChange(parsed);
              else
                setInputText(
                  formatInput ? formatInput(value) : String(value)
                );
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                (e.target as HTMLInputElement).blur();
              } else if (e.key === "Escape") {
                e.preventDefault();
                setEditing(false);
                setInputText(
                  formatInput ? formatInput(value) : String(value)
                );
                (e.target as HTMLInputElement).blur();
              }
            }}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label={ariaLabel ? `${ariaLabel} value` : "Scrubber value"}
            className={clsx(
              "absolute z-30 text-xs font-medium",
              "px-1.5 py-0.5 w-20 outline-none",
              bgColorClass(BackgroundColor.Background),
              radiusStyles(Radius.Sm),
              "border border-strong focus:border-primary"
            )}
            style={
              horizontal
                ? {
                    left: `${position * 100}%`,
                    bottom: "100%",
                    transform: "translate(-50%, -10px)",
                  }
                : {
                    top: `${position * 100}%`,
                    left: "100%",
                    transform: "translate(10px, -50%)",
                  }
            }
          />
        )}
      </div>
    </div>
  );
}

Scrubber.displayName = "Scrubber";
