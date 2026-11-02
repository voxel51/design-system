import type { FC } from "react";

import { Dropdown, DropdownTrigger } from "@/components/Dropdown";
import { MenuCheckItem, MenuTextItem } from "@/components/Menu";
import { StatusDot } from "@/components/StatusDot";
import { Size } from "@/types";

export interface LiveToggleProps {
  /** Whether auto refresh is on. */
  checked: boolean;
  /** Called with the new value when the menu's "Auto refresh" item is picked. */
  onCheckedChange: (checked: boolean) => void;
  /** Whether a refresh is under way now; the dot pulses only while it is. Defaults to `checked`. */
  active?: boolean;
  /** Adds a "Refresh now" item that calls it. */
  onRefresh?: () => void;
  /** Tooltip, e.g. the refresh interval. */
  title?: string;
  className?: string;
}

// fixed components so the trigger's icon keeps its identity across renders;
// each centres its dot in the trigger's icon box
const dot = (
  color: "status-progress-text" | "text-tertiary",
  pulse = false
): FC => {
  const Dot: FC = () => (
    <span className="flex size-full items-center justify-center">
      <StatusDot aria-hidden color={color} pulse={pulse} />
    </span>
  );
  return Dot;
};
const PulsingDot = dot("status-progress-text", true);
const StillDot = dot("status-progress-text");
const OffDot = dot("text-tertiary");

/**
 * A borderless toolbar pill for auto refresh: "Live" with a dot that pulses
 * while refreshing, or "Paused" with a muted dot. Its menu turns auto refresh
 * on or off and can refresh at once.
 *
 * @example
 * ```tsx
 * <LiveToggle
 *   checked={autoRefresh}
 *   onCheckedChange={setAutoRefresh}
 *   active={hasRunningJobs}
 *   onRefresh={refetch}
 *   title="Refreshes every 5 seconds"
 * />
 * ```
 *
 * @param checked Whether auto refresh is on.
 * @param onCheckedChange Called with the new value from the menu.
 * @param active Whether refreshing is under way; the dot pulses only then. Defaults to `checked`.
 * @param onRefresh Adds a "Refresh now" menu item.
 * @param title Tooltip text.
 * @param className `class` overrides for the trigger.
 */
export const LiveToggle: FC<LiveToggleProps> = ({
  checked,
  onCheckedChange,
  active = checked,
  onRefresh,
  title,
  className,
}) => (
  <Dropdown
    anchor="bottom end"
    trigger={
      <DropdownTrigger
        borderless
        size={Size.Md}
        title={title}
        aria-label={`Auto refresh: ${checked ? "on" : "off"}`}
        leadingIcon={!checked ? OffDot : active ? PulsingDot : StillDot}
        className={className}
      >
        {checked ? "Live" : "Paused"}
      </DropdownTrigger>
    }
  >
    <MenuCheckItem checked={checked} onClick={() => onCheckedChange(!checked)}>
      Auto refresh
    </MenuCheckItem>
    {onRefresh && <MenuTextItem onClick={onRefresh}>Refresh now</MenuTextItem>}
  </Dropdown>
);

LiveToggle.displayName = "LiveToggle";
