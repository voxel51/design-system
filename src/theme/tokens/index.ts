import { colors } from "./colors";
import { spacing, spacingRole } from "./spacing";
import { transitions } from "./transitions";
import { typography } from "./typography";

export { transitions };
// Named explicitly: `export *` does not forward the default export, so without
// this line `colors` and `primitives` are unreachable from the package root.
export { colors, primitives } from "./colors";
export {
  chartPool,
  overlayPool,
  palettePool,
  paletteSlots,
  type VizHue,
} from "./palette";
export { fontSize, lineHeight } from "./typography";
export { spacingRole } from "./spacing";

export default {
  colors,
  spacing,
  spacingRole,
  transitions,
  typography,
};
