import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface IconTooltipProps {
  label: string;
  side?: "top" | "right" | "bottom" | "left";
  children: React.ReactNode;
}

/** Standard tooltip for label-less / icon-only actions. */
export function IconTooltip({ label, side = "bottom", children }: IconTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>{label}</TooltipContent>
    </Tooltip>
  );
}
