export const Shadow = {
  None: "none",
  Xl: "xl",
  Lg: "lg",
  Md: "md",
  Sm: "sm",
  Xs: "xs",
} as const;
export type Shadow = `${(typeof Shadow)[keyof typeof Shadow]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Shadow {
  export type None = typeof Shadow.None;
  export type Xl = typeof Shadow.Xl;
  export type Lg = typeof Shadow.Lg;
  export type Md = typeof Shadow.Md;
  export type Sm = typeof Shadow.Sm;
  export type Xs = typeof Shadow.Xs;
}

export default Shadow;
