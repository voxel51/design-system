import { primitives } from "./colors";

// The expressive gradient's stops are Figma's `expressive/*-default`
// primitives (the same values the `interactive/expressive-default-*` tokens
// resolve to), so the gradient re-tones with the brand ramp.
// Figma ExpressiveButton: stops at 0 / 50 / 100 %, with hover and pressed
// ramps a step darker each.
const expressive = (tone: "default" | "hover" | "pressed"): string =>
  `linear-gradient(105deg, ${primitives.expressive[`orange-${tone}`]}, ${primitives.expressive[`pink-${tone}`]} 50%, ${primitives.expressive[`purple-${tone}`]})`;

export const gradients = {
  action: {
    expressive: expressive("default"),
    "expressive-hover": expressive("hover"),
    "expressive-pressed": expressive("pressed"),
  },
} as const;
