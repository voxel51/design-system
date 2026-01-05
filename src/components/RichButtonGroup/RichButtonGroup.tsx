import { FC, HTMLAttributes, useCallback, useState } from "react";

import { RichButton, RichButtonProps } from "@/components/RichButton";
import { Descriptor } from "@/types";
import { cn } from "@/util/classes";

export interface RichButtonGroupProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  buttons: Descriptor<RichButtonProps>[];
  exclusive?: boolean;
  onChange?: (active: string[]) => void;
}

export const RichButtonGroup: FC<RichButtonGroupProps> = ({
  buttons,
  className,
  exclusive,
  onChange,
  ...props
}) => {
  const [active, setActive] = useState<string[]>(() => []);

  const activate = useCallback(
    (id: string) => {
      if (!active.includes(id)) {
        const newActiveArray = exclusive ? [id] : [...active, id];
        setActive(newActiveArray);
        onChange?.(newActiveArray);
      }
    },
    [active, exclusive, onChange]
  );
  const deactivate = useCallback(
    (id: string) => {
      if (active.includes(id)) {
        const newActiveArray = active.filter((elem) => elem !== id);
        setActive(newActiveArray);
        onChange?.(newActiveArray);
      }
    },
    [active, onChange]
  );

  return (
    <div className={cn("flex", "gap-x-md", className)} {...props}>
      {buttons.map((buttonProps) => (
        <RichButton
          key={buttonProps.id}
          {...buttonProps.data}
          active={active.includes(buttonProps.id)}
          onClick={() => {
            if (active.includes(buttonProps.id)) {
              deactivate(buttonProps.id);
            } else {
              activate(buttonProps.id);
            }

            buttonProps.data.onClick?.();
          }}
        />
      ))}
    </div>
  );
};

RichButtonGroup.displayName = "RichButtonGroup";
