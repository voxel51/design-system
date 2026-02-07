/**
 * Truncate a value to the specified precision.
 *
 * @example
 * ```typescript
 * const truncated = truncate(0.12345, 0.001);
 * console.log(truncated); // 0.123
 * ```
 *
 * @param value Value to truncate
 * @param precision Precision
 */
export const truncate = (value: number, precision: number): number => {
  const factor = 1 / precision;
  return Math.trunc(value * factor) / factor;
};
