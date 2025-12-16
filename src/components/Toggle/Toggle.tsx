import { Descriptor, Size } from "@/types";
import { cn } from "@/util/classes";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import clsx from "clsx";
import type { FC, HTMLAttributes, ReactNode } from "react";

export interface ToggleTab {
  label: ReactNode;
  content: ReactNode;
}

export interface ToggleProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "onChange"
> {
  soft?: boolean;
  tabs: Descriptor<ToggleTab>[];
  defaultIndex?: number;
  onChange?: (index: number) => void;
  size?: Size;
  className?: string;
  tabListClassName?: string;
  tabPanelClassName?: string;
}

const sizeStyles: Record<Size, string> = {
  [Size.Xs]: clsx("w-[1.25rem] h-[1.35rem]", "text-xs/5"),
  [Size.Sm]: clsx("w-[1.65rem] h-[1.5rem]", "text-sm/5"),
  [Size.Md]: clsx("w-[3rem] h-[2rem]", "text-md/5"),
};

const tabListStyles = {
  soft: clsx("w-fit", "p-1"),
  default: clsx("w-full"),
};

const tabStyles = {
  soft: clsx("mx-0.5", "rounded-sm", "data-[selected]:text-brand-accent"),
  default: clsx("data-[selected]:text-content-text-primary"),
};

/**
 * We are using this to determine the border radius of the tab where
 * we expect exterior corners to be rounded and interior corners to
 * be square.
 * @param soft - Whether to enable soft toggle
 * @param isFirst - Whether the tab is the first tab
 * @param isLast - Whether the tab is the last tab
 * @returns The border radius of the tab
 */
const getTabBorderRadius = (
  soft: boolean,
  isFirst: boolean,
  isLast: boolean
) => {
  if (soft) return "";
  if (isFirst && isLast) return "rounded-md";
  if (isFirst) return "rounded-l-md";
  if (isLast) return "rounded-r-md";
  return "";
};

export const Toggle: FC<ToggleProps> = ({
  tabs,
  soft = false,
  defaultIndex = 0,
  onChange,
  size = Size.Sm,
  className,
  tabListClassName,
  tabPanelClassName,
  ...props
}) => {
  const variant = soft ? "soft" : "default";

  return (
    <TabGroup
      defaultIndex={defaultIndex}
      onChange={onChange}
      className={className}
      {...props}
    >
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
                getTabBorderRadius(soft, isFirst, isLast),
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

Toggle.displayName = "Toggle";
