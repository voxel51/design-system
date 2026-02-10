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

/**
 * Clean a float value, potentially trimming floating point precision errors.
 *
 * This function is meant to retain as much precision as possible while removing trailing noise.
 * For explicit truncation, see {@link truncate}.
 *
 * @example
 * ```typescript
 * const cleaned = cleanFloat(0.1 + 0.2);
 * console.log(cleaned); // 0.3 rather than 0.30000000000000004
 * ```
 *
 * @param value Value to clean
 * @param maxDigits Maximum number of digits to keep
 */
export const cleanFloat = (value: number, maxDigits: number = 10): number => {
  return parseFloat(value.toFixed(maxDigits));
};
