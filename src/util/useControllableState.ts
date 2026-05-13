import { useCallback, useMemo, useState } from "react";

/**
 * Props for {@link useControllableState}.
 *
 * A component is "controlled" when `value` is defined and "uncontrolled"
 * otherwise. In uncontrolled mode the hook owns the state and seeds it with
 * `initializer`; in controlled mode the consumer owns the state and is
 * responsible for updating `value` in response to `onChange`.
 */
export type ControllableStateProps<T> = {
  /** Lazily produces the initial value used when the hook is uncontrolled. */
  initializer: () => T;
  /** Invoked with the next value on every change, in both controlled and uncontrolled modes. */
  onChange?: (value: T) => void;
  /** When defined, switches the hook into controlled mode and uses this as the resolved value. */
  value?: T;
};

/**
 * Tuple of `[value, onChange]` returned by {@link useControllableState}, mirroring
 * the shape of `useState`.
 */
export type Controllable<T> = [value: T, onChange: (value: T) => void];

/**
 * Hook for implementing components that may be either controlled or
 * uncontrolled, following the same convention as native form inputs.
 *
 * - If `value` is `undefined`, the hook manages internal state seeded by
 *   `initializer` and updates it on every change.
 * - If `value` is defined, the hook returns `value` as-is and never mutates
 *   internal state; the consumer is responsible for re-rendering with the
 *   next value.
 *
 * `onChange` (when provided) fires on every change in either mode.
 *
 * @example
 * ```tsx
 * const [value, setValue] = useControllableState({
 *   initializer: () => defaultValue,
 *   onChange,
 *   value: controlledValue,
 * });
 * ```
 */
export const useControllableState = <T>({
  initializer,
  onChange,
  value,
}: ControllableStateProps<T>): Controllable<T> => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<T>(initializer);

  const resolvedValue = isControlled ? value : internalValue;
  const resolvedOnChange = useCallback(
    (value: T) => {
      onChange?.(value);
      if (!isControlled) {
        setInternalValue(value);
      }
    },
    [isControlled, onChange]
  );

  return useMemo(
    () => [resolvedValue, resolvedOnChange],
    [resolvedOnChange, resolvedValue]
  );
};
