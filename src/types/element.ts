export enum ElementState {
  Active = "data-active",
  AutoFocus = "data-autofocus",
  Checked = "data-checked",
  Disabled = "disabled",
  Focus = "data-focus",
  Hover = "hover",
  None = "none",
  Open = "data-open",
  Selected = "data-selected",
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
