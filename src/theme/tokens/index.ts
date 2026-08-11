import { colors } from "./colors";
import { spacing } from "./spacing";
import { transitions } from "./transitions";
import { typography } from "./typography";

export { transitions };
// `colors` was previously reachable only through the default export, which
// `export *` does not forward — so consumers of the package root could not
// import it at all. Named here alongside the other token families.
export { colors, primitives } from "./colors";
export { palettePool, paletteSlots } from "./palette";

export default {
  colors,
  spacing,
  transitions,
  typography,
};
