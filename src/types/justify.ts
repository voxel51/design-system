export const Justify = {
  Around: "around",
  Between: "between",
  Center: "center",
  End: "end",
  Evenly: "evenly",
  Start: "start",
} as const;
export type Justify = `${(typeof Justify)[keyof typeof Justify]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Justify {
  export type Around = typeof Justify.Around;
  export type Between = typeof Justify.Between;
  export type Center = typeof Justify.Center;
  export type End = typeof Justify.End;
  export type Evenly = typeof Justify.Evenly;
  export type Start = typeof Justify.Start;
}
