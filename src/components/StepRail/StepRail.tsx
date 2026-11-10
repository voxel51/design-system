import { Button as HeadlessButton } from "@headlessui/react";
import clsx from "clsx";
import {
  type FC,
  type HTMLAttributes,
  type ReactNode,
  type SyntheticEvent,
  useState,
} from "react";

import { CheckIcon } from "@/components/Icons";
import { Tooltip } from "@/components/Tooltip";
import radiusStyles from "@/styles/radius";
import { TEXT_STYLES } from "@/styles/text";
import {
  BackgroundColor,
  BorderColor,
  BrandColor,
  bgColorClass,
  borderColorClass,
  ElementState,
  IconColor,
  Radius,
  TextColor,
  textColorClass,
  TextVariant,
} from "@/types";

/** One step in a {@link StepRail}. */
export interface StepRailStep {
  id: string;
  label: ReactNode;
}

export interface StepRailProps extends Omit<
  HTMLAttributes<HTMLOListElement>,
  "onSelect"
> {
  steps: StepRailStep[];
  current: string;
  onSelect?: (id: string) => void;
}

type StepState = "done" | "active" | "todo";

const LABEL_ATTR = "data-step-label";

const labelStyles: Record<StepState, string> = {
  done: textColorClass(TextColor.Secondary),
  active: textColorClass(TextColor.Primary),
  todo: textColorClass(IconColor.Subtle),
};

const circleStyles: Record<StepState, string> = {
  done: clsx(
    "border-brand-primary",
    bgColorClass(BrandColor.Primary),
    "text-white"
  ),
  active: clsx("border-brand-primary", textColorClass(BrandColor.Primary)),
  todo: clsx(
    borderColorClass(BorderColor.Strong),
    textColorClass(IconColor.Subtle)
  ),
};

/**
 * Shows progress through a multi-step flow. Completed steps show a check, the
 * current step is highlighted, and later steps are muted. Below `sm` only the
 * current step keeps its label; the others show their number or check and
 * name themselves in a tooltip.
 *
 * @example
 * ```tsx
 * <StepRail
 *   steps={[
 *     { id: "source", label: "Source" },
 *     { id: "files", label: "Files" },
 *     { id: "import", label: "Import" },
 *   ]}
 *   current="files"
 *   onSelect={goToStep}
 * />
 * ```
 *
 * @param steps Ordered steps, each with a unique `id` and a `label`.
 * @param current The `id` of the step the user is on.
 * @param onSelect Called with a completed step's `id` when it is clicked. Omit it to keep completed steps static.
 * @param className Additional CSS class names to apply to the list.
 * @param props Additional HTML properties to apply to the list.
 */
export const StepRail: FC<StepRailProps> = ({
  steps,
  current,
  onSelect,
  className,
  ...props
}) => {
  const index = steps.findIndex((step) => step.id === current);
  const [labelHidden, setLabelHidden] = useState(false);
  const measure = (event: SyntheticEvent<HTMLElement>): void => {
    const el = event.currentTarget.querySelector(`[${LABEL_ATTR}]`);
    setLabelHidden(!!el && window.getComputedStyle(el).position === "absolute");
  };
  return (
    <ol
      aria-label={`Step ${index + 1} of ${steps.length}`}
      className={clsx("flex flex-nowrap items-center gap-[2px]", className)}
      {...props}
    >
      {steps.map((step, i) => {
        const state: StepState =
          i < index ? "done" : i === index ? "active" : "todo";
        const clickable = state === "done" && !!onSelect;
        const content = (
          <>
            <span
              className={clsx(
                // Palanquin sets its digits low in the em box, so a 2px bottom pad
                // centres them optically in the 18px circle
                "flex h-[18px] w-[18px] shrink-0 items-center justify-center border pb-0.5 text-[11px] leading-none font-medium transition-colors",
                radiusStyles(Radius.Full),
                circleStyles[state]
              )}
            >
              {state === "done" ? <CheckIcon size={10} /> : i + 1}
            </span>
            <span
              {...{ [LABEL_ATTR]: "" }}
              className={
                state === "active" ? undefined : "sr-only sm:not-sr-only"
              }
            >
              {step.label}
            </span>
          </>
        );
        const labelClass = clsx(
          "flex items-center gap-[8px] whitespace-nowrap py-[4px] pl-[4px] transition-colors",
          state === "active"
            ? "pr-[8px]"
            : "max-sm:gap-0 max-sm:pr-[4px] sm:pr-[8px]",
          TEXT_STYLES[TextVariant.BodySecondary],
          radiusStyles(Radius.Full),
          labelStyles[state]
        );
        return (
          <li key={step.id} className="flex shrink-0 items-center gap-[2px]">
            <Tooltip
              content={labelHidden ? step.label : null}
              onMouseOverCapture={measure}
              onPointerDownCapture={measure}
            >
              {clickable ? (
                <HeadlessButton
                  className={clsx(
                    labelClass,
                    "hover:cursor-pointer",
                    textColorClass(TextColor.Primary, ElementState.Hover),
                    bgColorClass(
                      BackgroundColor.CardElevated,
                      ElementState.Hover
                    )
                  )}
                  onClick={() => onSelect(step.id)}
                >
                  {content}
                </HeadlessButton>
              ) : (
                <span
                  aria-current={state === "active" ? "step" : undefined}
                  className={labelClass}
                >
                  {content}
                </span>
              )}
            </Tooltip>
            {i < steps.length - 1 && (
              <span
                className={clsx(
                  "h-px w-[10px] shrink-0 transition-colors",
                  i < index
                    ? clsx(bgColorClass(BrandColor.Primary), "opacity-50")
                    : "bg-content-border-subtle"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
};

StepRail.displayName = "StepRail";
