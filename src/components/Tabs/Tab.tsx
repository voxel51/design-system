import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type Ref,
} from "react";

import { TEXT_STYLES } from "@/styles/text";
import {
  ElementState,
  IconColor,
  TextColor,
  textColorClass,
  TextVariant,
  TransitionPreset,
  transitionPreset,
} from "@/types";
import { cn } from "@/util/classes";

export interface TabProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    Pick<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target" | "rel"> {
  /**
   * Renders an anchor with the tab's look, for a tab which is really a
   * destination — so it is a real link (middle-click, copy address) rather
   * than a button that navigates.
   */
  href?: string;
  active?: boolean;
  /** A trailing count, e.g. how many datasets the tab's page lists. */
  count?: number;
}

/**
 * A single tab within a {@link Tabs} bar.
 *
 * @example
 * ```tsx
 * <Tab active count={15} onClick={() => go("/datasets")}>
 *   Datasets
 * </Tab>
 * ```
 *
 * @param active Whether this is the selected tab. The {@link Tabs} underline slides to it.
 * @param count Optional trailing count rendered after the label.
 * @param href Renders the tab as an anchor. See {@link TabProps.href}.
 * @param disabled If `true`, disables the tab.
 * @param className `class` overrides to apply to the component.
 * @param children The tab's label.
 * @param props Additional HTML properties to apply to the component.
 */
export const Tab = forwardRef<HTMLElement, TabProps>(
  (
    {
      active = false,
      count,
      href,
      target,
      rel,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const content = (
      <>
        {children}
        {count !== undefined && (
          <span
            className={cn(
              "ml-1.5 tabular-nums",
              TEXT_STYLES[TextVariant.Md],
              textColorClass(IconColor.Subtle)
            )}
          >
            {count.toLocaleString()}
          </span>
        )}
      </>
    );

    const classes = cn(
      "flex h-full shrink-0 items-center whitespace-nowrap px-3 py-1.5",
      "cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
      "focus-visible:outline-none",
      TEXT_STYLES[TextVariant.Lg],
      transitionPreset(TransitionPreset.Colors),
      active
        ? cn("font-medium", textColorClass(TextColor.Primary))
        : cn(
            textColorClass(TextColor.Muted),
            textColorClass(TextColor.Primary, ElementState.Hover)
          ),
      className
    );

    // A disabled link is a disabled button: an anchor has no `disabled`
    // state, so it would still navigate and never wear the disabled styles
    if (href !== undefined && !disabled) {
      const { type: _type, ...anchorProps } = props;
      return (
        <a
          ref={ref as Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={rel ?? (target === "_blank" ? "noreferrer" : undefined)}
          role="tab"
          aria-selected={active}
          className={classes}
          {...(anchorProps as unknown as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        type="button"
        role="tab"
        aria-selected={active}
        disabled={disabled}
        className={classes}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Tab.displayName = "Tab";
