/**
 * Helper methods for converting explicit CSS colors into
 * their corresponding tailwind class to support overriding
 * theme defaults
 */

export function text(color: string): string {
  return `text-[${color}]`;
}

export function bg(color: string): string {
  return `bg-[${color}]`;
}
