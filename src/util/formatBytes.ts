/**
 * Formats a byte count for display, rounding to the nearest sensible unit.
 *
 * @example
 * ```ts
 * formatBytes(2048); // "2 KB"
 * formatBytes(5 * 1024 ** 2); // "5.0 MB"
 * ```
 *
 * @param bytes The size in bytes.
 * @returns The size as a string with a B, KB, MB or GB unit.
 */
export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
};
