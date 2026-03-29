import { createContext } from "react";

export type Orientation = "horizontal" | "vertical";

export const OrientationContext = createContext<Orientation>("vertical");
