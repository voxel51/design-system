export const Align = {
  Baseline: "baseline",
  Center: "center",
  End: "end",
  Start: "start",
} as const;
export type Align = `${(typeof Align)[keyof typeof Align]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Align {
  export type Baseline = typeof Align.Baseline;
  export type Center = typeof Align.Center;
  export type End = typeof Align.End;
  export type Start = typeof Align.Start;
}
