import { createContext } from "react";

import { Orientation } from "@/types";

export { Orientation };

export const OrientationContext = createContext<Orientation>(Orientation.Column);
