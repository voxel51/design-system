import { ElementState, withElementState } from "@/types/element";
import Shadow from "@/types/shadow";

export const SHADOW_STYLES: Record<Shadow, string> = {
  [Shadow.None]: "shadow-none",
  [Shadow.Xs]: "shadow-xs",
  [Shadow.Sm]: "shadow-sm",
  [Shadow.Md]: "shadow-md",
  [Shadow.Lg]: "shadow-lg",
  [Shadow.Xl]: "shadow-xl",
};

export default function shadowStyles(
  shadow?: Shadow,
  elementState?: ElementState
): string | null {
  if (!shadow) return null;

  if (elementState === ElementState.None) {
    return SHADOW_STYLES[shadow];
  }

  return withElementState(SHADOW_STYLES[shadow], elementState);
}
