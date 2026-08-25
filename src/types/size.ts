export const Size = {
  Xs: "xs",
  Sm: "sm",
  Md: "md",
  Lg: "lg",
  Xl: "xl",
} as const;
export type Size = `${(typeof Size)[keyof typeof Size]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Size {
  export type Xs = typeof Size.Xs;
  export type Sm = typeof Size.Sm;
  export type Md = typeof Size.Md;
  export type Lg = typeof Size.Lg;
  export type Xl = typeof Size.Xl;
}

export default Size;
