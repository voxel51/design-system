import { FC, HTMLAttributes, useCallback, useState } from "react";

import { RichButton, RichButtonProps } from "@/components/RichButton";
import { Stack } from "@/components/Stack";
import { Align, Descriptor, Justify, Orientation, Spacing } from "@/types";

export interface RichButtonGroupProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  activeIds?: string[];
  align?: Align;
  buttons: Descriptor<RichButtonProps>[];
  exclusive?: boolean;
  justify?: Justify;
  onChange?: (active: string[]) => void;
  orientation?: Orientation;
  spacing?: Spacing;
}

/**
 * A grouping of {@link RichButton} components with linked selection state.
 *
 * This component operates as both a controlled and uncontrolled component.
 * See `active`/`onChange` for controlled behavior.
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
 *       activeIds={activeButtons}
 *       buttons={buttons}
 *       exclusive={true}
 *       onChange={onChange}
 *     />
 *   );
 * };
 * ```
 *
 * @param activeIds List of descriptor IDs which should be active; this allows for controlled behavior.
 * @param align Optional alignment of buttons within their flex container. Defaults to {@link Align.Center}.
 * @param buttons List of component descriptors which will be used to create {@link RichButton} child components.
 * @param exclusive If `true`, enforces mutual exclusion in child selection state.
 * @param justify Optional justification of buttons within their flex container.
 * @param onChange Callback triggered when child selection state changes.
 * @param orientation Optional orientation of button group. Defaults to {@link Orientation.Row}.
 * @param spacing Optional spacing between buttons. Defaults to {@link Spacing.Md}.
 * @param props Additional HTML properties to apply to the component.
 */
export const RichButtonGroup: FC<RichButtonGroupProps> = ({
  activeIds,
  align = Align.Center,
  buttons,
  exclusive,
  justify,
  onChange,
  orientation = Orientation.Row,
  spacing = Spacing.Md,
  ...props
}) => {
  const isControlled = activeIds !== undefined;
  const [internalActive, setInternalActive] = useState<string[]>([]);
  const transientActive = isControlled ? activeIds : internalActive;
  const setTransientActive = useCallback(
    (v: string[]) => {
      // always trigger onChange; uncontrolled callers can still listen
      onChange?.(v);

      if (!isControlled) {
        setInternalActive(v);
      }
    },
    [isControlled, onChange]
  );

  const activate = useCallback(
    (id: string) => {
      if (!transientActive.includes(id)) {
        const newActiveArray = exclusive ? [id] : [...transientActive, id];
        setTransientActive(newActiveArray);
      }
    },
    [transientActive, exclusive, setTransientActive]
  );

  const deactivate = useCallback(
    (id: string) => {
      if (transientActive.includes(id)) {
        const newActiveArray = transientActive.filter((elem) => elem !== id);
        setTransientActive(newActiveArray);
      }
    },
    [transientActive, setTransientActive]
  );

  return (
    <Stack
      align={align}
      justify={justify}
      orientation={orientation}
      spacing={spacing}
      {...props}
    >
      {buttons.map((buttonProps) => (
        <RichButton
          key={buttonProps.id}
          {...buttonProps.data}
          active={transientActive.includes(buttonProps.id)}
          onClick={() => {
            if (transientActive.includes(buttonProps.id)) {
              deactivate(buttonProps.id);
            } else {
              activate(buttonProps.id);
            }

            buttonProps.data.onClick?.();
          }}
        />
      ))}
    </Stack>
  );
};

RichButtonGroup.displayName = "RichButtonGroup";
