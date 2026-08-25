import { colors } from "./colors";
import { spacing } from "./spacing";
import { transitions } from "./transitions";
import { typography } from "./typography";

export { transitions };
// Named explicitly: `export *` does not forward the default export, so without
// this line `colors` and `primitives` are unreachable from the package root.
export { colors, primitives } from "./colors";
export { palettePool, paletteSlots } from "./palette";

export default {
  colors,
  spacing,
  transitions,
  typography,
};
