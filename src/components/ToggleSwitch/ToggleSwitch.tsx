import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import clsx from "clsx";
import {
  type ElementType,
  type FC,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";

import { type IconInput, IconWrapper } from "@/components/Icons";
import { Tooltip } from "@/components/Tooltip";
import {
  type Collapse,
  resolveCollapse,
  useLabelHidden,
} from "@/styles/collapse";
import { FOCUS_RING } from "@/styles/focus";
import { textStyles } from "@/styles/text";
import {
  BackgroundColor,
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
import { useOverflowRowFit } from "@/util/compact";

const UnselectedTab = forwardRef<
  HTMLElement,
  HTMLAttributes<HTMLElement> & { tabAs: ElementType }
>(({ tabAs: As, ...props }, ref) => (
  <As ref={ref} {...props} aria-selected={false} />
));
UnselectedTab.displayName = "UnselectedTab";

export interface ToggleSwitchTab {
  label: ReactNode;
  /** An icon before the label; with `collapse`, it stands in for the label. */
  icon?: IconInput;
  content?: ReactNode;
  /** Renders the tab as a link, so open-in-new-tab and middle-click work. */
  href?: string;
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

export type ToggleSwitchSize = `${Exclude<Size, Size.Lg | Size.Xl>}`;

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
  /** Element for tabs with an `href` (e.g. a router link); defaults to `a`. */
  linkComponent?: ElementType;
  /** Ref to the tab row, e.g. for `useCompactRow`. */
  tabListRef?: Ref<HTMLElement>;
  /** Hides the labels of tabs with an `icon`, leaving the icons. */
  collapse?: Collapse;
}

const tabSizeStyles: Record<ToggleSwitchSize, string> = {
  // Figma ToggleButton: 12/16, 14/20 and 15/20 labels at Small/Medium/Large.
  [Size.Xs]: clsx(textStyles(TextVariant.BodyTertiary), "min-w-5 min-h-5"),
  [Size.Sm]: clsx(textStyles(TextVariant.BodySecondary), "min-w-6 min-h-6"),
  [Size.Md]: clsx(textStyles(TextVariant.BodyPrimary), "min-w-7 min-h-7"),
};

const softSizeStyles: Record<ToggleSwitchSize, string> = {
  [Size.Xs]: clsx("min-w-5 min-h-5"),
  [Size.Sm]: clsx("min-w-6 min-h-6"),
  [Size.Md]: clsx("min-w-7 min-h-7"),
};

// Icon glyph sizes, as on Button: 16px at Medium, 14px below.
const iconSizes: Record<ToggleSwitchSize, number> = {
  [Size.Xs]: 14,
  [Size.Sm]: 14,
  [Size.Md]: 16,
};

const tabPaddingStyles: Record<ToggleSwitchSize, string> = {
  [Size.Xs]: clsx("py-1 px-3"),
  [Size.Sm]: clsx("py-1.5 px-4"),
  [Size.Md]: clsx("py-2 px-4"),
};

const tabVariantStyles: Record<ToggleSwitchVariant, string> = {
  // Figma: the selected tab uses a neutral surface (bg/card-nested, or
  // bg/card-elevated in the Soft tray) with white text, not the brand accent.
  // The selected background is applied in tabClassName, so variants only
  // handle layout/text.
  [ToggleSwitchVariant.Soft]: clsx(
    // Figma SoftToggle segment: 10px side padding, radius/sm, in a padded tray
    "py-0.5 px-2.5",
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
  if (isFirst && isLast) return "rounded-sm";
  if (isFirst) return "rounded-l-sm";
  if (isLast) return "rounded-r-sm";
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
  if (variant === ToggleSwitchVariant.Soft)
    return ["p-1 gap-0.5", bgColorClass(BackgroundColor.CardNested)];
  return ["border", borderColorClass(BorderColor.Default)];
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
 *       {id: "1", data: {label: "Tab 1", content: "Tab 1 content"}},
 *       {id: "2", data: {label: "Tab 2", content: "Tab 2 content"}},
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
 * @example
 * ```tsx
 * // Icon tabs that drop their labels while the enclosing row is short of room
 * <ToggleSwitch
 *   variant="soft"
 *   collapse="auto"
 *   tabs={[
 *     { id: "chart", data: { label: "Chart", icon: BarChartIcon } },
 *     { id: "table", data: { label: "Table", icon: TableChartOutlinedIcon } },
 *   ]}
 * />
 * ```
 *
 * @param tabs List of component descriptors which will be used to create {@link ToggleSwitchTab} children.
 *  Each tab supports optional `icon`, `disabled` and `tooltip` fields. See {@link ToggleSwitchTab}.
 * @param variant Visual style of the tab set:
 *    - `"default"` - tabs are bordered and have visible boundaries;
 *      the active tab has a distinct background from inactive tabs.
 *    - `"soft"` - tabs sit in a padded, filled tray with no border;
 *      the active tab gets a raised neutral background and primary text.
 *    - `"full"` - like `"default"`, with primary text on the active tab.
 *      Use `fullWidth` to fill the container.
 *    - `"borderless"` - tabs are not bordered; the active tab has a bottom border.
 *  See {@link ToggleSwitchVariant}.
 * @param defaultIndex The index of the tab which should be considered active when the component first renders (uncontrolled).
 *  Defaults to `0`.
 * @param index The active tab index for controlled usage; when set it drives the active tab and overrides `defaultIndex`.
 *  `-1` shows no tab as active, nor marks one selected (e.g. a nav on a page none of its tabs names); keyboard focus still enters on the first enabled tab.
 * @param onChange Callback triggered when the active tab changes.
 * @param size Size of the tabs: `"xs"`, `"sm"` or `"md"`; this controls the text size and padding.
 *  Defaults to `"sm"`. See {@link ToggleSwitchSize}.
 * @param fullWidth If `true`, the tab group will fill the width of their container.
 * @param collapse Hides the labels of tabs with an `icon`, leaving the icons: `true` or `"lg"` below 1024px,
 *  `"sm"` below 640px, `"always"` at every width, `"auto"` while the enclosing row is compact.
 *  A hidden label names its tab (a string label becomes its `aria-label`) and is its tooltip unless it has one.
 * @param linkComponent Element for tabs with an `href` (a router link, say); defaults to `a`.
 * @param tabListRef Ref to the tab row, e.g. for `useCompactRow`.
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
  linkComponent = "a",
  tabListRef,
  collapse,
  ...props
}) => {
  const { compact } = useOverflowRowFit();
  const labelHidden = useLabelHidden(resolveCollapse(collapse, compact));
  const none = index === -1;
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
        ref={tabListRef}
        className={cn(
          "toggle-switch-tab-list",
          "flex flex-nowrap items-center",
          "rounded-sm",
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
              "min-w-0 flex-1",
              "flex items-center justify-center",
              "whitespace-nowrap",
              FOCUS_RING,
              "transition-colors",
              "bg-transparent",
              // Figma: the active segment fills bg/card-nested in the bordered
              // set and bg/card-elevated in the soft tray.
              !none &&
                bgColorClass(
                  variant === ToggleSwitchVariant.Soft
                    ? BackgroundColor.CardElevated
                    : BackgroundColor.CardNested,
                  ElementState.Selected
                ),
              getTabTextColorClass(selected && !none),
              data.disabled && "hover:!text-content-text-secondary",
              "data-[disabled]:opacity-50",
              "data-[disabled]:cursor-not-allowed",
              getTabBorderRadius(variant, isFirst, isLast),
              getTabStyles(variant, size),
              none && "data-selected:border-b-0"
            );

          const iconOnly = labelHidden && data.icon !== undefined;
          const tooltip = data.tooltip ?? (iconOnly ? data.label : undefined);
          const tab = (
            <Tab
              disabled={data.disabled}
              className={tabClassName}
              aria-label={
                iconOnly && typeof data.label === "string"
                  ? data.label
                  : undefined
              }
              {...(data.href && !data.disabled
                ? { as: linkComponent, href: data.href }
                : {})}
              {...(none && {
                as: UnselectedTab,
                tabAs: data.href && !data.disabled ? linkComponent : "button",
              })}
            >
              {data.icon ? (
                <span className="inline-flex items-center gap-1.5">
                  <IconWrapper content={data.icon} size={iconSizes[size]} />
                  {!iconOnly && data.label}
                </span>
              ) : (
                data.label
              )}
            </Tab>
          );

          return tooltip ? (
            <Tooltip
              key={id}
              content={tooltip}
              wrapperClassName="min-w-0 flex-1 flex"
              portal
            >
              {tab}
            </Tooltip>
          ) : (
            <div key={id} className="min-w-0 flex-1 flex">
              {tab}
            </div>
          );
        })}
      </TabList>
      {tabs.some(({ data }) => data.content != null) && (
        <TabPanels className={cn(tabPanelClassName)}>
          {tabs.map(({ id, data }) => (
            <TabPanel key={id} className={cn("focus:outline-none")}>
              {data.content}
            </TabPanel>
          ))}
        </TabPanels>
      )}
    </TabGroup>
  );
};

ToggleSwitch.displayName = "ToggleSwitch";
