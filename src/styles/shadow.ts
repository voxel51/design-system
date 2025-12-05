import Shadow from "@/enums/shadow";

export const SHADOW_STYLES: Record<Shadow, string> = {
  [Shadow.Xs]: "shadow-xs",
  [Shadow.Sm]: "shadow-sm",
  [Shadow.Md]: "shadow-md",
  [Shadow.Lg]: "shadow-lg",
  [Shadow.Xl]: "shadow-xl",
};

export default function shadow_styles(shadow?: Shadow): string | null {
  if (!shadow) return null;
  return SHADOW_STYLES[shadow];
}
