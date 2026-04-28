import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import styles from "./TimelineRuler.module.css";

const MIN_VIEW = 0.25;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

type DragMode = "pan" | "playhead" | "loopStart" | "loopEnd" | null;

interface DragState {
  mode: DragMode;
  startX: number;
  startVs: number;
  startVe: number;
  startValue: number;
}

function tickLabel(t: number): string {
  const s = Math.floor(t);
  const frac = Math.round((t - s) * 10) / 10;
  return frac === 0 ? `${s}s` : `${(s + frac).toFixed(1)}s`;
}

export interface TimelineRulerProps {
  duration: number;
  currentTime: number;
  viewStart: number;
  viewEnd: number;
  loopStart: number;
  loopEnd: number;
  /** Width of the label column, to align with track rows. */
  labelWidth?: number;
  height?: number;
  onSeek: (time: number) => void;
  onViewChange: (viewStart: number, viewEnd: number) => void;
  onLoopChange: (loopStart: number, loopEnd: number) => void;
  /**
   * Optional ref to an outer container. When provided, wheel-to-zoom is
   * attached there so users can zoom from anywhere in the track area, not
   * just the ruler row itself.
   */
  zoomRef?: React.RefObject<HTMLElement | null>;
  /**
   * Reserved space on the right edge (in px) to account for a scrollbar in the
   * adjacent track list. Handle positions and tick lane are shrunk by this
   * amount so the ruler aligns with the visible track content area.
   */
  rightGutter?: number;
  className?: string;
  style?: React.CSSProperties;
}

const TimelineRuler: React.FC<TimelineRulerProps> = ({
  duration,
  currentTime,
  viewStart,
  viewEnd,
  loopStart,
  loopEnd,
  labelWidth = 0,
  height = 24,
  onSeek,
  onViewChange,
  onLoopChange,
  zoomRef,
  rightGutter = 0,
  className,
  style,
}) => {
  const rulerRef = useRef<HTMLDivElement>(null);
  // Tracks active drag type so the ruler cursor updates during a drag.
  // dragRef holds the full drag state; dragCursor drives the re-render.
  const [dragCursor, setDragCursor] = useState<string | null>(null);
  const dragRef = useRef<DragState>({
    mode: null,
    startX: 0,
    startVs: 0,
    startVe: 0,
    startValue: 0,
  });

  // Refs for stale-closure-free access inside the native wheel handler.
  const viewRef = useRef({ viewStart, viewEnd });
  useEffect(() => {
    viewRef.current = { viewStart, viewEnd };
  }, [viewStart, viewEnd]);

  const onViewChangeRef = useRef(onViewChange);
  useEffect(() => {
    onViewChangeRef.current = onViewChange;
  });

  // Wheel-to-zoom, attached to zoomRef (outer container) or the ruler itself.
  useEffect(() => {
    const target = zoomRef?.current ?? rulerRef.current;
    if (!target) return;
    const rulerEl = rulerRef.current;

    const handleWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const { viewStart: vs, viewEnd: ve } = viewRef.current;
      const rect = (rulerEl ?? target).getBoundingClientRect();
      const laneWidth = rect.width - labelWidth;
      const ratio = clamp(
        (e.clientX - rect.left - labelWidth) / laneWidth,
        0,
        1
      );
      const pivotTime = vs + ratio * (ve - vs);
      const factor = e.deltaY > 0 ? 1.15 : 1 / 1.15;
      const newDuration = clamp((ve - vs) * factor, MIN_VIEW, duration);
      const newStart = clamp(
        pivotTime - ratio * newDuration,
        0,
        duration - newDuration
      );
      onViewChangeRef.current(newStart, newStart + newDuration);
    };

    target.addEventListener("wheel", handleWheel, { passive: false });
    return () => target.removeEventListener("wheel", handleWheel);
  }, [zoomRef, duration, labelWidth]);

  // Derived ratios
  const viewDuration = viewEnd - viewStart;
  const playheadRatio = clamp((currentTime - viewStart) / viewDuration, 0, 1);
  const loopStartRatio = clamp((loopStart - viewStart) / viewDuration, 0, 1);
  const loopEndRatio = clamp((loopEnd - viewStart) / viewDuration, 0, 1);

  // Adaptive tick interval
  const tickInterval =
    viewDuration <= 1 ? 0.1 : viewDuration <= 3 ? 0.5 : 1;
  const ticks: number[] = [];
  const firstTick =
    Math.ceil((viewStart / tickInterval) - 1e-9) * tickInterval;
  for (
    let t = Math.round(firstTick * 1e4) / 1e4;
    t <= viewEnd + 1e-9;
    t = Math.round((t + tickInterval) * 1e4) / 1e4
  ) {
    ticks.push(t);
  }

  // Converts a 0-1 ratio to a CSS left value accounting for the label column
  // and any reserved right gutter (e.g. scrollbar space).
  const laneLeft = (ratio: number) =>
    `calc(${labelWidth}px + (100% - ${labelWidth}px - ${rightGutter}px) * ${ratio})`;

  // ─── pointer handlers ──────────────────────────────────────────────────────
  // All interactions are captured on the ruler element so a single
  // onPointerMove/Up pair handles every drag mode.
  // Handles are direct children of the ruler div (not inside the overflow:hidden
  // tick lane) so overflow clipping never prevents them from being hit-tested.

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const { viewStart: vs, viewEnd: ve } = viewRef.current;
    const handle = (e.target as HTMLElement).dataset.handle as
      | "playhead"
      | "loopStart"
      | "loopEnd"
      | undefined;

    if (handle === "playhead") {
      setDragCursor("grabbing");
      dragRef.current = {
        mode: "playhead",
        startX: e.clientX,
        startVs: vs,
        startVe: ve,
        startValue: currentTime,
      };
    } else if (handle === "loopStart") {
      setDragCursor("ew-resize");
      dragRef.current = {
        mode: "loopStart",
        startX: e.clientX,
        startVs: vs,
        startVe: ve,
        startValue: loopStart,
      };
    } else if (handle === "loopEnd") {
      setDragCursor("ew-resize");
      dragRef.current = {
        mode: "loopEnd",
        startX: e.clientX,
        startVs: vs,
        startVe: ve,
        startValue: loopEnd,
      };
    } else {
      dragRef.current = {
        mode: "pan",
        startX: e.clientX,
        startVs: vs,
        startVe: ve,
        startValue: 0,
      };
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.mode || !rulerRef.current) return;
    const laneWidth =
      rulerRef.current.getBoundingClientRect().width - labelWidth;
    const dx = e.clientX - drag.startX;
    const vd = drag.startVe - drag.startVs;
    const dt = (dx / laneWidth) * vd;

    if (drag.mode === "pan") {
      const newStart = clamp(drag.startVs - dt, 0, duration - vd);
      onViewChange(newStart, newStart + vd);
    } else if (drag.mode === "playhead") {
      onSeek(clamp(drag.startValue + dt, 0, duration));
    } else if (drag.mode === "loopStart") {
      const t = clamp(drag.startValue + dt, 0, loopEnd - 1 / 60);
      onLoopChange(t, loopEnd);
    } else if (drag.mode === "loopEnd") {
      const t = clamp(drag.startValue + dt, loopStart + 1 / 60, duration);
      onLoopChange(loopStart, t);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    // Click-to-seek: pan with no significant movement → seek instead.
    if (drag.mode === "pan" && Math.abs(e.clientX - drag.startX) < 3) {
      const ruler = rulerRef.current;
      if (ruler) {
        const rect = ruler.getBoundingClientRect();
        const laneWidth = rect.width - labelWidth;
        const laneX = e.clientX - rect.left - labelWidth;
        if (laneX >= 0 && laneX <= laneWidth) {
          const { viewStart: vs, viewEnd: ve } = viewRef.current;
          onSeek(clamp(vs + (laneX / laneWidth) * (ve - vs), 0, duration));
        }
      }
    }
    dragRef.current.mode = null;
    setDragCursor(null);
  };

  return (
    <div
      ref={rulerRef}
      className={clsx(styles.ruler, className)}
      style={{ height, cursor: dragCursor ?? undefined, ...style }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Label column spacer */}
      {labelWidth > 0 && (
        <div className={styles.labelSpacer} style={{ width: labelWidth }} />
      )}

      {/* Tick lane — overflow:hidden + pointer-events:none so handles above
          are never clipped or occluded by this layer. */}
      <div className={styles.lane} style={rightGutter > 0 ? { marginRight: rightGutter } : undefined}>
        {ticks.map((t) => (
          <span
            key={t}
            className={styles.tick}
            style={{ left: `${((t - viewStart) / viewDuration) * 100}%` }}
          >
            {tickLabel(t)}
          </span>
        ))}
      </div>

      {/* Loop start handle — sibling of lane, never clipped */}
      <div
        data-handle="loopStart"
        className={styles.loopHandle}
        style={{ left: laneLeft(loopStartRatio) }}
      />

      {/* Loop end handle */}
      <div
        data-handle="loopEnd"
        className={styles.loopHandle}
        style={{ left: laneLeft(loopEndRatio) }}
      />

      {/* Playhead hit area + triangle visual */}
      <div
        data-handle="playhead"
        className={styles.playheadHandle}
        style={{ left: laneLeft(playheadRatio) }}
      >
        <div className={styles.playheadTriangle} />
      </div>

      {/* Playhead line through the ruler */}
      <div
        className={styles.playheadLine}
        style={{ left: laneLeft(playheadRatio) }}
      />
    </div>
  );
};

export default TimelineRuler;
