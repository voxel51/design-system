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
  [Size.Xs]: clsx("px-2.5 py-0.75", "text-xs/5"),
  [Size.Sm]: clsx("px-3.5 py-1.5", "text-sm/5"),
  [Size.Md]: clsx("px-4 py-2", "text-md/5"),
};

export const Toggle: FC<ToggleProps> = ({
  tabs,
  soft = false,
  defaultIndex = 0,
  onChange,
  size = Size.Md,
  className,
  tabListClassName,
  tabPanelClassName,
  ...props
}) => {
  return (
    <TabGroup
      defaultIndex={defaultIndex}
      onChange={onChange}
      className={cn("w-full", className)} // tab group fills the container
      {...props}
    >
      <TabList
        className={cn(
          "flex flex-nowrap items-center",
          "w-full", // tablist fill the container
          "p-1",
          "bg-content-bg-card-1",
          "rounded-sm",
          tabListClassName
        )}
      >
        {tabs.map(({ id, data }) => (
          <Tab
            key={id}
            className={cn(
              "cursor-pointer",
              "flex-1", // tabs are equal width and expand to fill the container
              "px-4 py-2",
              "font-medium",
              "text-content-text-secondary",
              "rounded-xs",
              "outline-none",
              "data-[selected]:bg-content-bg-card-2",
              "data-[selected]:text-content-text-primary",
              "data-[focus]:outline-none",
              sizeStyles[size]
            )}
          >
            {data.label}
          </Tab>
        ))}
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
