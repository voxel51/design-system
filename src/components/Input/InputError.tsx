import { Size, TextColor, textColorClass } from "@/types";
import { cn } from "@/util/classes";
import { type FC } from "react";
import { labelTextStyles } from "./styles";

export interface InputErrorProps {
  error: string;
  size: Size;
}

export const InputError: FC<InputErrorProps> = ({ error, size }) => {
  return (
    <span
      className={cn(
        textColorClass(TextColor.SemanticDestructive),
        labelTextStyles[size]
      )}
    >
      {error}
    </span>
  );
};

InputError.displayName = "InputError";
