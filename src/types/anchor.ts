export const Anchor = {
  TopLeft: "top-left",
  Top: "top",
  TopRight: "top-right",
  Right: "right",
  BottomRight: "bottom-right",
  Bottom: "bottom",
  BottomLeft: "bottom-left",
  Left: "left",
} as const;
export type Anchor = `${(typeof Anchor)[keyof typeof Anchor]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Anchor {
  export type TopLeft = typeof Anchor.TopLeft;
  export type Top = typeof Anchor.Top;
  export type TopRight = typeof Anchor.TopRight;
  export type Right = typeof Anchor.Right;
  export type BottomRight = typeof Anchor.BottomRight;
  export type Bottom = typeof Anchor.Bottom;
  export type BottomLeft = typeof Anchor.BottomLeft;
  export type Left = typeof Anchor.Left;
}

export default Anchor;
