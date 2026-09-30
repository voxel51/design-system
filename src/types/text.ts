export const TextVariant = {
  /** 23/28 regular — display titles. */
  HeadingXl: "heading-xl",
  /** 18/24 medium — page titles. */
  HeadingLg: "heading-lg",
  /** 16/20 medium — section headers. */
  HeadingMd: "heading-md",
  /** 14/20 medium — small headers and button labels. */
  HeadingSm: "heading-sm",
  /** 12/16 medium — the smallest header. */
  HeadingXs: "heading-xs",
  /** 15/20 regular — primary body text for main content. */
  BodyPrimary: "body-primary",
  /** 14/20 regular — secondary body text. */
  BodySecondary: "body-secondary",
  /** 12/16 regular — tertiary body text. */
  BodyTertiary: "body-tertiary",
  /** 12/16 semibold, uppercase — label text and alternate section headers. */
  Label: "label",
  /** 11/16 regular, tertiary colour — captions. */
  Caption: "caption",
  /** 12/16 mono — primary code. */
  CodePrimary: "code-primary",
  /** 11/16 mono — secondary code. */
  CodeSecondary: "code-secondary",

  /** @deprecated Size-only scale with no Figma role; use a role above. */
  Xxs: "xxs",
  /** @deprecated Size-only scale; use {@link TextVariant.Caption}. */
  Xs: "xs",
  /** @deprecated Size-only scale; use {@link TextVariant.BodyTertiary}. */
  Sm: "sm",
  /** @deprecated Size-only scale; use {@link TextVariant.BodyPrimary}. */
  Md: "md",
  /** @deprecated Size-only scale; use {@link TextVariant.BodyPrimary}. */
  Lg: "lg",
  /** @deprecated Size-only scale; use {@link TextVariant.HeadingLg}. */
  Xl: "xl",
  /** @deprecated Size-only scale; use {@link TextVariant.HeadingXl}. */
  Xxl: "xxl",
} as const;
export type TextVariant = `${(typeof TextVariant)[keyof typeof TextVariant]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TextVariant {
  export type HeadingXl = typeof TextVariant.HeadingXl;
  export type HeadingLg = typeof TextVariant.HeadingLg;
  export type HeadingMd = typeof TextVariant.HeadingMd;
  export type HeadingSm = typeof TextVariant.HeadingSm;
  export type HeadingXs = typeof TextVariant.HeadingXs;
  export type BodyPrimary = typeof TextVariant.BodyPrimary;
  export type BodySecondary = typeof TextVariant.BodySecondary;
  export type BodyTertiary = typeof TextVariant.BodyTertiary;
  export type Label = typeof TextVariant.Label;
  export type Caption = typeof TextVariant.Caption;
  export type CodePrimary = typeof TextVariant.CodePrimary;
  export type CodeSecondary = typeof TextVariant.CodeSecondary;
  export type Xxs = typeof TextVariant.Xxs;
  export type Xs = typeof TextVariant.Xs;
  export type Sm = typeof TextVariant.Sm;
  export type Md = typeof TextVariant.Md;
  export type Lg = typeof TextVariant.Lg;
  export type Xl = typeof TextVariant.Xl;
  export type Xxl = typeof TextVariant.Xxl;
}

export default TextVariant;
