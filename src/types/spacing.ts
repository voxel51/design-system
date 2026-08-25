export const Spacing = {
  None: "none",
  Xs: "xs",
  Sm: "sm",
  Md: "md",
  Lg: "lg",
  Xl: "xl",
} as const;
export type Spacing = `${(typeof Spacing)[keyof typeof Spacing]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Spacing {
  export type None = typeof Spacing.None;
  export type Xs = typeof Spacing.Xs;
  export type Sm = typeof Spacing.Sm;
  export type Md = typeof Spacing.Md;
  export type Lg = typeof Spacing.Lg;
  export type Xl = typeof Spacing.Xl;
}

export default Spacing;
