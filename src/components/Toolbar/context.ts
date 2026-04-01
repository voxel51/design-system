import { createContext } from "react";

import { Orientation } from "@/types";

export const OrientationContext = createContext<Orientation>(
  Orientation.Column
);
