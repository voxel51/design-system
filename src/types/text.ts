export const TextVariant = {
  Xxs: "xxs",
  Xs: "xs",
  Sm: "sm",
  Md: "md",
  Lg: "lg",
  Xl: "xl",
  Xxl: "xxl",
  Label: "label",
  Caption: "caption",
} as const;
export type TextVariant = `${(typeof TextVariant)[keyof typeof TextVariant]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TextVariant {
  export type Xxs = typeof TextVariant.Xxs;
  export type Xs = typeof TextVariant.Xs;
  export type Sm = typeof TextVariant.Sm;
  export type Md = typeof TextVariant.Md;
  export type Lg = typeof TextVariant.Lg;
  export type Xl = typeof TextVariant.Xl;
  export type Xxl = typeof TextVariant.Xxl;
  export type Label = typeof TextVariant.Label;
  export type Caption = typeof TextVariant.Caption;
}

export default TextVariant;
