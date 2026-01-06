/**
 * Type alias for a predicate function.
 */
export type Validator = (value: string | number | null | undefined) => boolean;

/**
 * Returns true if the provided value is non-nullish.
 *
 * @param value Value to test
 */
export const nonNull: Validator = (value: string | number | null | undefined) =>
  value !== null && value !== undefined;

/**
 * Returns true if the provided value is finite.
 *
 * @param value Value to test
 */
export const finite: Validator = (
  value: string | number | null | undefined
) => {
  if (!nonNull(value)) {
    return false;
  }

  const parsedValue = Number.parseFloat(value!.toString());
  return Number.isFinite(parsedValue);
};

/**
 * Returns a {@link Validator} which returns true if the value is within the specified range.
 *
 * @param min Range minimum
 * @param max Range maximum
 */
export const makeRangeValidator =
  (min: number, max: number): Validator =>
  (value: string | number | null | undefined) => {
    if (!finite(value)) {
      return false;
    }

    const valueString = value!.toString();

    return (
      Number.parseFloat(valueString) >= min &&
      Number.parseFloat(valueString) <= max
    );
  };
