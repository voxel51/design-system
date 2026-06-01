import clsx from "clsx";
import { CSSProperties, FC, ReactNode } from "react";

import radiusStyles from "@/styles/radius";
import { bgColorClass, BrandColor, Orientation, Radius } from "@/types";

interface ScrubberThumbProps {
  /** Normalized position along the primary axis, in `[0, 1]`. */
  position: number;
  orientation: Orientation;
  /** Floating label shown next to the thumb. Omit to hide the label. */
  label?: ReactNode;
}

/**
 * The draggable thumb overlaid on a {@link ScrubberTrack}.
 *
 * Positions itself absolutely along the primary axis; the cross-axis is
 * centered on the track. The optional label hovers in the gutter above
 * (horizontal) or beside (vertical) the thumb.
 *
 * @internal For use by {@link Scrubber}.
 */
export const ScrubberThumb: FC<ScrubberThumbProps> = ({
  position,
  orientation,
  label,
}) => {
  const horizontal = orientation === Orientation.Row;
  const pct = `${position * 100}%`;

  // Pin: thin along the primary axis, long along the cross axis. The pin
  // anchors at the track's inward-facing edge and extends INTO the content
  // area — upward in Row mode (track sits at container bottom), leftward
  // in Column mode (track sits at container right).
  const PIN_THICKNESS_PX = 4;
  const PIN_LENGTH_PX = 36;

  const thumbStyle: CSSProperties = horizontal
    ? {
        left: pct,
        bottom: "0",
        width: PIN_THICKNESS_PX,
        height: PIN_LENGTH_PX,
        transform: "translateX(-50%)",
      }
    : {
        top: pct,
        right: "0",
        width: PIN_LENGTH_PX,
        height: PIN_THICKNESS_PX,
        transform: "translateY(-50%)",
      };

  const labelStyle: CSSProperties = horizontal
    ? {
        left: pct,
        bottom: `${PIN_LENGTH_PX + 4}px`,
        transform: "translateX(-50%)",
      }
    : {
        top: pct,
        right: `${PIN_LENGTH_PX + 4}px`,
        transform: "translateY(-50%)",
      };

  return (
    <>
      <div
        className={clsx(
          "absolute z-10 pointer-events-none",
          bgColorClass(BrandColor.Primary),
          radiusStyles(Radius.Full),
          "shadow-sm"
        )}
        style={thumbStyle}
      />
      {label !== undefined && (
        <div
          className={clsx(
            "absolute z-20 whitespace-nowrap pointer-events-none",
            "px-2 py-0.5 text-xs font-medium",
            bgColorClass(BrandColor.Primary),
            radiusStyles(Radius.Sm),
            "text-white shadow-md"
          )}
          style={labelStyle}
        >
          {label}
        </div>
      )}
    </>
  );
};

ScrubberThumb.displayName = "ScrubberThumb";
