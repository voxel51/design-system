import { useId, type FC, type HTMLAttributes, type ReactNode } from "react";

import { Card, CardBackground } from "@/components/Card";
import { FilterListIcon } from "@/components/Icons";
import { Text, type TextProps } from "@/components/Text";
import { Tooltip } from "@/components/Tooltip";
import { FOCUS_RING } from "@/styles/focus";
import { IconColor, TextColor, TextVariant } from "@/types";
import { cn } from "@/util/classes";

/** What a {@link StatTile}'s delta says about the change. */
export const StatTileTone = {
  Success: "success",
  Failure: "failure",
  Neutral: "neutral",
} as const;
export type StatTileTone =
  `${(typeof StatTileTone)[keyof typeof StatTileTone]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace StatTileTone {
  export type Success = typeof StatTileTone.Success;
  export type Failure = typeof StatTileTone.Failure;
  export type Neutral = typeof StatTileTone.Neutral;
}

/** A second value shown beside a {@link StatTile}'s own, such as a compared run's. */
export interface StatTileCompare {
  value: ReactNode;
  /** Colour of the value, such as the compared run's. */
  color?: TextProps["color"];
  /** Makes the value a filter, like the tile's own `onSelect`. */
  onSelect?: () => void;
  /** The value's filter is applied. */
  selected?: boolean;
}

export interface StatTileProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onSelect"
> {
  label: string;
  value: ReactNode;
  /** Beside the value, in secondary text, such as a share (`"42%"`). */
  hint?: ReactNode;
  /** A line under the value saying how it changed, coloured by `deltaTone`. */
  delta?: ReactNode;
  deltaTone?: StatTileTone;
  /** Colour of the value, such as the run's. */
  color?: TextProps["color"];
  /** Makes the value a filter: a funnel marks the tile, a click applies it. */
  onSelect?: () => void;
  /** The tile's filter is applied: an outline and a brand funnel. */
  selected?: boolean;
  /** What a click shows, such as `"Show false positives"`: tooltip and description. */
  selectLabel?: string;
  /** Shows a second value beside the first, each its own filter. */
  compare?: StatTileCompare;
}

const DELTA_COLOR: Record<StatTileTone, TextColor> = {
  [StatTileTone.Success]: TextColor.Success,
  [StatTileTone.Failure]: TextColor.Failure,
  [StatTileTone.Neutral]: TextColor.Tertiary,
};

const Target: FC<{
  onSelect?: () => void;
  selected?: boolean;
  label?: string;
  fill?: boolean;
  children: ReactNode;
}> = ({ onSelect, selected, label, fill, children }) => {
  const hintId = useId();
  if (!onSelect) return <>{children}</>;
  const button = (
    <button
      type="button"
      aria-pressed={Boolean(selected)}
      aria-describedby={label ? hintId : undefined}
      onClick={onSelect}
      className={cn(
        "block min-w-0 cursor-pointer appearance-none rounded-sm border-0 bg-transparent p-0 text-left text-inherit",
        FOCUS_RING,
        fill && "w-full"
      )}
    >
      {children}
      {label && (
        <span id={hintId} hidden>
          {label}
        </span>
      )}
    </button>
  );
  return label ? (
    <Tooltip content={label} wrapperClassName={cn("min-w-0", fill && "w-full")}>
      {button}
    </Tooltip>
  ) : (
    button
  );
};

/**
 * A small card with one number and its name, for a row of key figures over a
 * chart or list. It can be a filter (a click shows what it counts) and can
 * set a compared value beside its own.
 *
 * @example
 * ```tsx
 * <StatTileGroup>
 *   <StatTile label="Median" value="0.42" />
 *   <StatTile label="Most common" value="cat" hint="38%" />
 *   <StatTile
 *     label="False positives"
 *     value="128"
 *     onSelect={showFalsePositives}
 *     selected={filter === "fp"}
 *     selectLabel="Show false positives"
 *   />
 * </StatTileGroup>
 * ```
 *
 * @param label The figure's name, on one line over the value.
 * @param value The figure.
 * @param hint Beside the value, in secondary text (a share, a unit).
 * @param delta A line under the value saying how it changed.
 * @param deltaTone `"success"`, `"failure"` or `"neutral"` (default): the delta's colour.
 * @param color Colour of the value: a token or a CSS colour (a run's colour).
 * @param onSelect Makes the value a filter: a funnel marks the tile and the value is a toggle button.
 * @param selected The filter is applied: the tile is outlined and its funnel turns brand.
 * @param selectLabel What a click shows: the button's tooltip and description.
 * @param compare A second value beside the first, with its own `color`, `onSelect` and `selected`.
 * @param className `class` overrides for the tile.
 * @param props Additional HTML properties for the tile.
 */
export const StatTile: FC<StatTileProps> = ({
  label,
  value,
  hint,
  delta,
  deltaTone = StatTileTone.Neutral,
  color,
  onSelect,
  selected = false,
  selectLabel,
  compare,
  className,
  ...props
}) => {
  const active = selected || Boolean(compare?.selected);
  const header = (
    <span className="flex min-w-0 items-center justify-between gap-1">
      <Text variant={TextVariant.Caption} color={TextColor.Tertiary} truncate>
        {label}
      </Text>
      {(onSelect || compare?.onSelect) && (
        <FilterListIcon
          size={14}
          color={active ? IconColor.Brand : IconColor.Subtle}
        />
      )}
    </span>
  );
  const deltaLine = delta !== undefined && delta !== null && (
    <Text variant={TextVariant.Caption} color={DELTA_COLOR[deltaTone]}>
      {delta}
    </Text>
  );

  return (
    <Card
      background={CardBackground.Secondary}
      border
      compact
      outlined={active}
      className={cn("flex min-w-0 flex-col", className)}
      {...props}
    >
      {compare ? (
        <>
          {header}
          <span className="flex min-w-0 items-center justify-between gap-2">
            <Target onSelect={onSelect} selected={selected} label={selectLabel}>
              <Text variant={TextVariant.BodySecondary} color={color} truncate>
                {value}
              </Text>
            </Target>
            <Target
              onSelect={compare.onSelect}
              selected={compare.selected}
              label={selectLabel}
            >
              <Text
                variant={TextVariant.BodySecondary}
                color={compare.color}
                truncate
              >
                {compare.value}
              </Text>
            </Target>
          </span>
          {deltaLine}
        </>
      ) : (
        <Target
          onSelect={onSelect}
          selected={selected}
          label={selectLabel}
          fill
        >
          {header}
          <span className="flex min-w-0 items-baseline gap-1">
            <Text variant={TextVariant.BodyPrimary} color={color} truncate>
              {value}
            </Text>
            {hint && (
              <Text
                variant={TextVariant.BodySecondary}
                color={TextColor.Secondary}
                className="shrink-0"
              >
                {hint}
              </Text>
            )}
          </span>
          {deltaLine}
        </Target>
      )}
    </Card>
  );
};

StatTile.displayName = "StatTile";

export type StatTileGroupProps = HTMLAttributes<HTMLDivElement>;

/**
 * A row of {@link StatTile}s that fits as many columns as there is room for
 * (each at least 104px) and wraps them evenly.
 *
 * @example
 * ```tsx
 * <StatTileGroup>
 *   <StatTile label="Potential issues" value="1,204" />
 *   <StatTile label="In review" value="12" />
 *   <StatTile label="Reviewed" value="87" />
 * </StatTileGroup>
 * ```
 *
 * @param children The tiles.
 * @param className `class` overrides for the grid.
 * @param props Additional HTML properties for the grid.
 */
export const StatTileGroup: FC<StatTileGroupProps> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      "grid grid-cols-[repeat(auto-fit,minmax(min(104px,100%),1fr))] gap-2",
      className
    )}
    {...props}
  />
);

StatTileGroup.displayName = "StatTileGroup";
