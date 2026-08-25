export const Radius = {
  Full: "full",
  Xl: "xl",
  Lg: "lg",
  Md: "md",
  Sm: "sm",
  Xs: "xs",
  None: "none",
} as const;
export type Radius = `${(typeof Radius)[keyof typeof Radius]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Radius {
  export type Full = typeof Radius.Full;
  export type Xl = typeof Radius.Xl;
  export type Lg = typeof Radius.Lg;
  export type Md = typeof Radius.Md;
  export type Sm = typeof Radius.Sm;
  export type Xs = typeof Radius.Xs;
  export type None = typeof Radius.None;
}

export default Radius;
