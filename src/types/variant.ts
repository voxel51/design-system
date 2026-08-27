export const Variant = {
  Primary: "primary",
  Secondary: "secondary",
  Success: "success",
  Danger: "danger",
  Icon: "icon",
  Borderless: "borderless",
} as const;
export type Variant = `${(typeof Variant)[keyof typeof Variant]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Variant {
  export type Primary = typeof Variant.Primary;
  export type Secondary = typeof Variant.Secondary;
  export type Success = typeof Variant.Success;
  export type Danger = typeof Variant.Danger;
  export type Icon = typeof Variant.Icon;
  export type Borderless = typeof Variant.Borderless;
}

export default Variant;
