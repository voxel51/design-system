export const randomString = (): string =>
  Math.random().toString(36).substring(2, 9).trim();
