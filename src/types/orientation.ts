export const Orientation = {
  Row: "row",
  Column: "col",
} as const;
export type Orientation = `${(typeof Orientation)[keyof typeof Orientation]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Orientation {
  export type Row = typeof Orientation.Row;
  export type Column = typeof Orientation.Column;
}

export default Orientation;
