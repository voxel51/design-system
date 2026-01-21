/**
 * Checks if a value is nullish (null or undefined).
 * @param value The value to check.
 * @returns True if the value is nullish, otherwise false.
 */
export function isNullish(value: unknown): boolean {
  return value === undefined || value === null;
}
