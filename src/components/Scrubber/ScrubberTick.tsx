import clsx from "clsx";
import { CSSProperties, FC, ReactNode } from "react";

import {
  BackgroundColor,
  bgColorClass,
  BrandColor,
  Orientation,
  textColorClass,
  TextColor,
} from "@/types";

interface ScrubberTickProps {
  /** Normalized position along the primary axis, in `[0, 1]`. */
  position: number;
  orientation: Orientation;
  /** Optional label rendered in the cross-axis gutter beside the tick. */
  label?: ReactNode;
  /** Whether this tick coincides with the current scrubber value. */
  active?: boolean;
}

/**
 * A single tick mark drawn perpendicular to the scrubber track, with an
 * optional label rendered just beyond the track in the cross-axis gutter.
 *
 * @internal For use by {@link Scrubber}.
 */
export const ScrubberTick: FC<ScrubberTickProps> = ({
  position,
  orientation,
  label,
  active,
}) => {
  const horizontal = orientation === Orientation.Row;
  const pct = `${position * 100}%`;

  const tickStyle: CSSProperties = horizontal
    ? {
        left: pct,
        top: "-4px",
        bottom: "-4px",
        width: 1,
        transform: "translateX(-50%)",
      }
    : {
        top: pct,
        left: "-4px",
        right: "-4px",
        height: 1,
        transform: "translateY(-50%)",
      };

  const labelStyle: CSSProperties = horizontal
    ? {
        left: pct,
        top: "100%",
        transform: "translate(-50%, 4px)",
      }
    : {
        // Anchor the label's right edge a small gap from the track and give
        // it an explicit cross-axis box so long labels can be right-aligned
        // and grow leftward instead of overflowing into the track.
        top: pct,
        right: "calc(100% + 4px)",
        width: "5rem",
        transform: "translateY(-50%)",
      };

  return (
    <>
      <div
        className={clsx(
          "absolute pointer-events-none",
          active
            ? bgColorClass(BrandColor.Primary)
            : bgColorClass(BackgroundColor.Muted)
        )}
        style={tickStyle}
      />
      {label !== undefined && (
        <div
          className={clsx(
            "absolute text-[10px] leading-none pointer-events-none whitespace-nowrap",
            // In Column mode the label sits to the left of the track via
            // `right: 100%`. Right-aligning anchors the text against the
            // track, so varying-length labels grow leftward instead of
            // drifting away from the tick.
            !horizontal && "text-right",
            active ? "font-semibold" : "opacity-70",
            textColorClass(TextColor.Secondary)
          )}
          style={labelStyle}
        >
          {label}
        </div>
      )}
    </>
  );
};

ScrubberTick.displayName = "ScrubberTick";
