import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import clsx from "clsx";
import type { FC, HTMLAttributes, ReactNode } from "react";

import { textStyles } from "@/styles/text";
import {
  BackgroundColor,
  bgColorClass,
  BrandColor,
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
}

export enum ToggleSwitchVariant {
  Default = "default",
  Soft = "soft",
  Full = "full",
  Borderless = "borderless",
}

export type ToggleSwitchSize = Exclude<Size, Size.Lg>;

export interface ToggleSwitchProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "onChange"
> {
  variant?: ToggleSwitchVariant;
  tabs: Descriptor<ToggleSwitchTab>[];
  defaultIndex?: number;
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
  [ToggleSwitchVariant.Soft]: clsx(
    "m-1",
    "py-1 px-1.5",
    "rounded-sm",
    textColorClass(BrandColor.Accent, ElementState.Selected)
  ),
  [ToggleSwitchVariant.Default]: clsx(
    textColorClass(TextColor.Primary, ElementState.Selected)
  ),
  [ToggleSwitchVariant.Full]: clsx(
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

const getTabStyles = (variant: ToggleSwitchVariant, size: ToggleSwitchSize): string => {
  const classNames = [tabVariantStyles[variant], tabSizeStyles[size]];

  if (variant !== ToggleSwitchVariant.Soft) {
    classNames.push(tabPaddingStyles[size]);
  } else {
    classNames.push(softSizeStyles[size]);
  }

  return clsx(...classNames);
};

export const ToggleSwitch: FC<ToggleSwitchProps> = ({
  tabs,
  variant = ToggleSwitchVariant.Default,
  defaultIndex = 0,
  onChange,
  size = Size.Sm,
  fullWidth,
  tabListClassName,
  tabPanelClassName,
  ...props
}) => {
  return (
    <TabGroup defaultIndex={defaultIndex} onChange={onChange} {...props}>
      <TabList
        className={cn(
          "flex flex-nowrap items-center",
          variant !== ToggleSwitchVariant.Borderless &&
            bgColorClass(BackgroundColor.Card1),
          "rounded-md",
          fullWidth ? "w-full" : "w-fit",
          tabListClassName
        )}
      >
        {tabs.map(({ id, data }, index) => {
          const isFirst = index === 0;
          const isLast = index === tabs.length - 1;
          return (
            <Tab
              className={cn(
                "cursor-pointer",
                "flex-1",
                "flex items-center justify-center",
                "font-medium",
                textColorClass(TextColor.Secondary),
                "outline-none",
                "transition-colors",
                bgColorClass(BackgroundColor.Card2, ElementState.Hover),
                textColorClass(TextColor.Primary, ElementState.Hover),
                bgColorClass(BackgroundColor.Card2, ElementState.Selected),
                "data-[focus]:outline-none",
                getTabBorderRadius(variant, isFirst, isLast),
                getTabStyles(variant, size)
              )}
              key={id}
            >
              {data.label}
            </Tab>
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
