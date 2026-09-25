import { primitives } from "./colors";

export const gradients = {
  action: {
    expressive: `linear-gradient(105deg, ${primitives.orange[500]}, ${primitives.pink[500]} 55%, ${primitives.purple[500]})`,
  },
} as const;
