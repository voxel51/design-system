import { Descriptor, Size } from "@/types";
import { cn } from "@/util/classes";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import clsx from "clsx";
import type { FC, HTMLAttributes, ReactNode } from "react";

export interface ToggleSwitchTab {
  label: ReactNode;
  content: ReactNode;
}

export enum ToggleSwitchVariant {
  Default = "default",
  Soft = "soft",
  Full = "full",
}

export interface ToggleSwitchProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "onChange"
> {
  variant?: ToggleSwitchVariant;
  tabs: Descriptor<ToggleSwitchTab>[];
  defaultIndex?: number;
  onChange?: (index: number) => void;
  size?: Size;
  tabListClassName?: string;
  tabPanelClassName?: string;
}

const sizeStyles: Record<Size, string> = {
  [Size.Xs]: clsx("w-[1.25rem] h-[1.35rem]", "text-xs/5"),
  [Size.Sm]: clsx("w-[1.65rem] h-[1.5rem]", "text-sm/5"),
  [Size.Md]: clsx("w-[3rem] h-[2rem]", "text-md/5"),
};

const tabListStyles: Record<ToggleSwitchVariant, string> = {
  [ToggleSwitchVariant.Soft]: clsx("w-fit", "p-1"),
  [ToggleSwitchVariant.Default]: clsx("w-fit"),
  [ToggleSwitchVariant.Full]: clsx("w-full"),
};

const tabStyles: Record<ToggleSwitchVariant, string> = {
  [ToggleSwitchVariant.Soft]: clsx(
    "mx-0.5",
    "rounded-sm",
    "data-[selected]:text-brand-accent"
  ),
  [ToggleSwitchVariant.Default]: clsx(
    "data-[selected]:text-content-text-primary"
  ),
  [ToggleSwitchVariant.Full]: clsx("data-[selected]:text-content-text-primary"),
};

const getTabBorderRadius = (
  variant: ToggleSwitchVariant,
  isFirst: boolean,
  isLast: boolean
) => {
  if (variant === ToggleSwitchVariant.Soft) return "";
  if (isFirst && isLast) return "rounded-md";
  if (isFirst) return "rounded-l-md";
  if (isLast) return "rounded-r-md";
  return "";
};

export const ToggleSwitch: FC<ToggleSwitchProps> = ({
  tabs,
  variant = ToggleSwitchVariant.Default,
  defaultIndex = 0,
  onChange,
  size = Size.Sm,
  tabListClassName,
  tabPanelClassName,
  ...props
}) => {
  return (
    <TabGroup defaultIndex={defaultIndex} onChange={onChange} {...props}>
      <TabList
        className={cn(
          "flex flex-nowrap items-center",
          "bg-content-bg-card-1",
          "rounded-md",
          tabListStyles[variant],
          tabListClassName
        )}
      >
        {tabs.map(({ id, data }, index) => {
          const isFirst = index === 0;
          const isLast = index === tabs.length - 1;
          return (
            <Tab
              key={id}
              className={cn(
                "cursor-pointer",
                "flex-1",
                "flex items-center justify-center",
                "font-medium",
                "text-content-text-secondary",
                "outline-none",
                "hover:bg-content-bg-card-2",
                "hover:text-content-text-primary",
                "data-[selected]:bg-content-bg-card-2",
                "data-[focus]:outline-none",
                getTabBorderRadius(variant, isFirst, isLast),
                tabStyles[variant],
                sizeStyles[size]
              )}
            >
              {data.label}
            </Tab>
          );
        })}
      </TabList>
      <TabPanels className={cn("mt-4", tabPanelClassName)}>
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
