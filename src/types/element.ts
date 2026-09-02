export const ElementState = {
  Active: "data-active",
  AutoFocus: "data-autofocus",
  Checked: "data-checked",
  Disabled: "disabled",
  Dragging: "data-dragging",
  Focus: "data-focus",
  Hover: "hover",
  None: "none",
  Open: "data-open",
  Selected: "data-selected",
} as const;
export type ElementState =
  `${(typeof ElementState)[keyof typeof ElementState]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ElementState {
  export type Active = typeof ElementState.Active;
  export type AutoFocus = typeof ElementState.AutoFocus;
  export type Checked = typeof ElementState.Checked;
  export type Disabled = typeof ElementState.Disabled;
  export type Dragging = typeof ElementState.Dragging;
  export type Focus = typeof ElementState.Focus;
  export type Hover = typeof ElementState.Hover;
  export type None = typeof ElementState.None;
  export type Open = typeof ElementState.Open;
  export type Selected = typeof ElementState.Selected;
}

export const withElementState = (
  cssClass: string,
  state: ElementState = ElementState.None
): string => {
  if (state === ElementState.None) {
    return cssClass;
  }

  return `${state}:${cssClass}`;
};
