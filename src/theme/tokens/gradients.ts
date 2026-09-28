import { primitives } from "./colors";

// The expressive gradient's stops are Figma's `expressive/*-default`
// primitives (the same values the `interactive/expressive-default-*` tokens
// resolve to), so the gradient re-tones with the brand ramp.
export const gradients = {
  action: {
    expressive: `linear-gradient(105deg, ${primitives.expressive["orange-default"]}, ${primitives.expressive["pink-default"]} 55%, ${primitives.expressive["purple-default"]})`,
  },
} as const;
