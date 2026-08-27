export const HeadingLevel = {
  H1: "h1",
  H2: "h2",
  H3: "h3",
  H4: "h4",
} as const;
export type HeadingLevel =
  `${(typeof HeadingLevel)[keyof typeof HeadingLevel]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace HeadingLevel {
  export type H1 = typeof HeadingLevel.H1;
  export type H2 = typeof HeadingLevel.H2;
  export type H3 = typeof HeadingLevel.H3;
  export type H4 = typeof HeadingLevel.H4;
}

export default HeadingLevel;
