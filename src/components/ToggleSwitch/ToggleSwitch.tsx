import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import clsx from "clsx";
import type { FC, HTMLAttributes, ReactNode } from "react";

import { Tooltip } from "@/components/Tooltip";
import { textStyles } from "@/styles/text";
import {
  ActionColor,
  bgColorClass,
  BorderColor,
  borderColorClass,
  Descriptor,
  ElementState,
  Size,
  TextColor,
  textColorClass,
  TextVariant,
} from "@/types";
import { cn } from "@/util/classes";

export interface ToggleSwitchTab {
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
  tooltip?: ReactNode;
}

export const ToggleSwitchVariant = {
  Default: "default",
  Soft: "soft",
  Full: "full",
  Borderless: "borderless",
} as const;
export type ToggleSwitchVariant =
  `${(typeof ToggleSwitchVariant)[keyof typeof ToggleSwitchVariant]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ToggleSwitchVariant {
  export type Default = typeof ToggleSwitchVariant.Default;
  export type Soft = typeof ToggleSwitchVariant.Soft;
  export type Full = typeof ToggleSwitchVariant.Full;
  export type Borderless = typeof ToggleSwitchVariant.Borderless;
}

export type ToggleSwitchSize = Exclude<Size, Size.Lg | Size.Xl>;

export interface ToggleSwitchProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "onChange"
> {
  variant?: ToggleSwitchVariant;
  tabs: Descriptor<ToggleSwitchTab>[];
  defaultIndex?: number;
  index?: number;
  onChange?: (index: number) => void;
  size?: ToggleSwitchSize;
  tabListClassName?: string;
  tabPanelClassName?: string;
  fullWidth?: boolean;
}

const tabSizeStyles: Record<ToggleSwitchSize, string> = {
  [Size.Xs]: clsx(textStyles(TextVariant.Xs), "min-w-5 min-h-5"),
  [Size.Sm]: clsx(textStyles(TextVariant.Sm), "min-w-6 min-h-6"),
  [Size.Md]: clsx(textStyles(TextVariant.Md), "min-w-7 min-h-7"),
};

const softSizeStyles: Record<ToggleSwitchSize, string> = {
  [Size.Xs]: clsx("min-w-5 min-h-5"),
  [Size.Sm]: clsx("min-w-6 min-h-6"),
  [Size.Md]: clsx("min-w-7 min-h-7"),
};

const tabPaddingStyles: Record<ToggleSwitchSize, string> = {
  [Size.Xs]: clsx("py-1 px-3"),
  [Size.Sm]: clsx("py-1.5 px-3.75"),
  [Size.Md]: clsx("py-2 px-4"),
};

const tabVariantStyles: Record<ToggleSwitchVariant, string> = {
  // Figma: the selected tab uses a neutral surface (#232526) with white text —
  // not the brand accent. The selected background is applied in tabClassName
  // via action-secondary-primary, so variants only handle layout/text.
  [ToggleSwitchVariant.Soft]: clsx(
    "m-1",
    "py-1 px-1.5",
    "rounded-sm",
    textColorClass(TextColor.Primary, ElementState.Selected)
  ),
  [ToggleSwitchVariant.Default]: clsx(
    // transparent border reserves layout space; selection is shown by the bg
    "border",
    "border-transparent"
  ),
  [ToggleSwitchVariant.Full]: clsx(
    "border",
    "border-transparent",
    textColorClass(TextColor.Primary, ElementState.Selected)
  ),
  [ToggleSwitchVariant.Borderless]: clsx(
    "bg-transparent",
    "hover:bg-transparent",
    "data-[selected]:bg-transparent",
    textColorClass(TextColor.Primary, ElementState.Selected),
    "data-[selected]:border-b-2"
  ),
};

const getTabBorderRadius = (
  variant: ToggleSwitchVariant,
  isFirst: boolean,
  isLast: boolean
): string => {
  if (
    variant === ToggleSwitchVariant.Soft ||
    variant === ToggleSwitchVariant.Borderless
  )
    return "";
  if (isFirst && isLast) return "rounded-md";
  if (isFirst) return "rounded-l-md";
  if (isLast) return "rounded-r-md";
  return "";
};

const getTabStyles = (
  variant: ToggleSwitchVariant,
  size: ToggleSwitchSize
): string => {
  const classNames = [tabVariantStyles[variant], tabSizeStyles[size]];

  if (variant !== ToggleSwitchVariant.Soft) {
    classNames.push(tabPaddingStyles[size]);
  } else {
    classNames.push(softSizeStyles[size]);
  }

  return clsx(...classNames);
};

const getTabListBorderStyles = (variant: ToggleSwitchVariant): string[] => {
  if (variant === ToggleSwitchVariant.Borderless) return [];
  if (variant === ToggleSwitchVariant.Soft) return [];
  return ["border", borderColorClass(BorderColor.CardElevated)];
};

const getTabTextColorClass = (selected: boolean): string => {
  if (selected) return textColorClass(TextColor.Primary, ElementState.Selected);
  return cn(
    // TODO - this is a hack. But it might be the least bad option.
    // override global FO css that targets <button>; secondary only when not hovered
    "!text-content-text-secondary hover:!text-content-text-primary"
  );
};

/**
 * A component which supports rendering a tabbed content container.
 *
 * This component enforces mutual exclusivity in active tabs, and only the content for the active tab is visible.
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const tabs: Descriptor<ToggleSwitchTab>[] = useMemo(() => [
 *       {id: "1", data: {label: "Tab 1", content: "Tab 1 content"}}
 *       {id: "2", data: {label: "Tab 2", content: "Tab 2 content"}}
 *       {id: "3", data: {label: "Tab 3", content: "Tab 3 content"}}
 *     ],
 *     []
 *   );
 *
 *   return (
 *     <ToggleSwitch
 *       tabs={tabs}
 *       defaultIndex={0}
 *       onChange={(activeIndex: number) => console.log(`Switched to tab index ${activeIndex}`)}
 *     />
 *   );
 * };
 * ```
 *
 * @param tabs List of component descriptors which will be used to create {@link ToggleSwitchTab} children.
 *  Each tab supports optional `disabled` and `tooltip` fields. See {@link ToggleSwitchTab}.
 * @param variant Variant of the tabs.
 *  The variants have the following behaviors:
 *    - {@link ToggleSwitchVariant.Default} - tabs are bordered and have visible boundaries;
 *      the active tab has a distinct background from inactive tabs.
 *    - {@link ToggleSwitchVariant.Soft} - tabs are not bordered;
 *      the active tab has a distinct background and is highlighted in an accent color.
 *    - {@link ToggleSwitchVariant.Full} - similar to {@link ToggleSwitchVariant.Default} and expands to fill
 *      its container.
 *    - {@link ToggleSwitchVariant.Borderless} - tabs are not bordered; the active tab has a bottom border.
 *  See {@link ToggleSwitchVariant}.
 * @param defaultIndex The index of the tab which should be considered active when the component first renders (uncontrolled).
 * @param index The active tab index for controlled usage; when set it drives the active tab and overrides `defaultIndex`.
 * @param onChange Callback triggered when the active tab changes.
 * @param size Size of the tabs; this controls the text size and padding. See {@link Size}.
 * @param fullWidth If `true`, the tab group will fill the width of their container.
 * @param tabListClassName `class` overrides to apply to the tabs.
 * @param tabPanelClassName `class` overrides to apply to the active content container.
 * @param props Additional HTML properties to apply to the tab group.
 */
export const ToggleSwitch: FC<ToggleSwitchProps> = ({
  tabs,
  variant = ToggleSwitchVariant.Default,
  defaultIndex = 0,
  index,
  onChange,
  size = Size.Sm,
  fullWidth,
  tabListClassName,
  tabPanelClassName,
  ...props
}) => {
  return (
    <TabGroup
      // `index` (controlled) wins when provided; otherwise fall back to
      // `defaultIndex` (uncontrolled). Headless UI ignores `selectedIndex` when
      // it is `undefined`, so passing both keeps the existing default behavior.
      selectedIndex={index}
      defaultIndex={defaultIndex}
      onChange={onChange}
      {...props}
    >
      <TabList
        className={cn(
          "toggle-switch-tab-list",
          "flex flex-nowrap items-center",
          "rounded-md",
          fullWidth ? "w-full" : "w-fit",
          ...getTabListBorderStyles(variant),
          tabListClassName
        )}
      >
        {tabs.map(({ id, data }, index) => {
          const isFirst = index === 0;
          const isLast = index === tabs.length - 1;
          const tabClassName = ({ selected }: { selected: boolean }): string =>
            cn(
              "cursor-pointer",
              "flex-1",
              "flex items-center justify-center",
              "whitespace-nowrap",
              "font-medium",
              "outline-none",
              "transition-colors",
              "bg-transparent",
              bgColorClass(ActionColor.SecondaryDefault, ElementState.Selected),
              getTabTextColorClass(selected),
              data.disabled && "hover:!text-content-text-secondary",
              "data-[focus]:outline-none",
              "data-[disabled]:opacity-50",
              "data-[disabled]:cursor-not-allowed",
              getTabBorderRadius(variant, isFirst, isLast),
              getTabStyles(variant, size)
            );

          const tab = (
            <Tab disabled={data.disabled} className={tabClassName}>
              {data.label}
            </Tab>
          );

          return data.tooltip ? (
            <Tooltip
              key={id}
              content={data.tooltip}
              wrapperClassName="flex-1 flex"
              portal
            >
              {tab}
            </Tooltip>
          ) : (
            <div key={id} className="flex-1 flex">
              {tab}
            </div>
          );
        })}
      </TabList>
      <TabPanels className={cn(tabPanelClassName)}>
        {tabs.map(({ id, data }) => (
          <TabPanel key={id} className={cn("focus:outline-none")}>
            {data.content}
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
};

ToggleSwitch.displayName = "ToggleSwitch";
