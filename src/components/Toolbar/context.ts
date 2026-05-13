import { createContext, useContext } from "react";

import { Orientation } from "@/types";

export const OrientationContext = createContext<Orientation>(
  Orientation.Column
);

export const useOrientationContext = (): Orientation =>
  useContext(OrientationContext);
