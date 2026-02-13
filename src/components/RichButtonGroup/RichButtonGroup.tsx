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

/**
 * A grouping of {@link RichButton} components with linked selection state.
 *
 * This component operates exclusively as an uncontrolled component.
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const [activeButtons, setActiveButtons] = useState<string[]>(() => []);
 *
 *   const onChange = useCallback((active: string[]) => {
 *       setActiveButtons(active);
 *     },
 *     [setActiveButtons]
 *   );
 *
 *   const buttons: Descriptor<RichButtonProps>[] = useMemo(() => {
 *       return [
 *         {id: "cls", data: {label: "Classification", description: "Create new classification"}},
 *         {id: "det", data: {label: "Detection", description: "Create new detection"}},
 *         {id: "seg", data: {label: "Segmentation", description: "Create new segmentation mask"}},
 *       ];
 *     },
 *     []
 *   );
 *
 *   return (
 *     <RichButtonGroup
 *       buttons={buttons}
 *       exclusive={true}
 *       onChange={onChange}
 *     />
 *   );
 * };
 * ```
 *
 * @param buttons List of component descriptors which will be used to create {@link RichButton} child components.
 * @param className `class` overrides to apply to the group's container.
 * @param exclusive If `true`, enforces mutual exclusion in child selection state.
 * @param onChange Callback triggered when child selection state changes.
 * @param props Additional HTML properties to apply to the component.
 */
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
