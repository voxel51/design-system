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

  // Pin: thin along the primary axis, tall along the cross axis. In Row
  // mode that's a narrow vertical bar straddling the track; in Column mode
  // it's a narrow horizontal bar.
  const PIN_THICKNESS_PX = 2;
  const PIN_LENGTH_PX = 16;

  const thumbStyle: CSSProperties = horizontal
    ? {
        left: pct,
        top: "50%",
        width: PIN_THICKNESS_PX,
        height: PIN_LENGTH_PX,
        transform: "translate(-50%, -50%)",
      }
    : {
        top: pct,
        left: "50%",
        width: PIN_LENGTH_PX,
        height: PIN_THICKNESS_PX,
        transform: "translate(-50%, -50%)",
      };

  const labelStyle: CSSProperties = horizontal
    ? {
        left: pct,
        bottom: "100%",
        transform: "translate(-50%, -10px)",
      }
    : {
        top: pct,
        left: "100%",
        transform: "translate(10px, -50%)",
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
