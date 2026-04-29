import clsx from "clsx";
import React from "react";
import styles from "./TimelineControls.module.css";

function formatTime(t: number): string {
  const s = Math.floor(t);
  const cs = Math.floor((t - s) * 100);
  return `0:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
}

function fmtBound(t: number): string {
  return `${t.toFixed(2)}s`;
}

// Tolerance for "is this bound at its limit?" check.
const EPSILON = 0.02;

export interface TimelineControlsProps {
  currentTime: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  /** When provided, loop bound indicator is shown. */
  loopStart?: number;
  loopEnd?: number;
  duration?: number;
  /** Called when user clicks the loop start value — typically resets loopStart to 0. */
  onLoopStartReset?: () => void;
  /** Called when user clicks the loop end value — typically resets loopEnd to duration. */
  onLoopEndReset?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const TimelineControls: React.FC<TimelineControlsProps> = ({
  currentTime,
  isPlaying,
  onPlay,
  onPause,
  onStepBack,
  onStepForward,
  loopStart,
  loopEnd,
  duration,
  onLoopStartReset,
  onLoopEndReset,
  className,
  style,
}) => {
  const hasLoop =
    loopStart !== undefined &&
    loopEnd !== undefined &&
    duration !== undefined;

  const atStart = hasLoop && loopStart! < EPSILON;
  const atEnd = hasLoop && loopEnd! > duration! - EPSILON;
  const loopMoved = hasLoop && (!atStart || !atEnd);

  return (
    <div className={clsx(styles.root, className)} style={style} onClick={(e) => e.stopPropagation()}>
      <button onClick={onStepBack} className={styles.btn} title="Step back" aria-label="Step back">
        ⏮
      </button>
      <button
        onClick={isPlaying ? onPause : onPlay}
        className={styles.btn}
        title={isPlaying ? "Pause" : "Play"}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? "⏸" : "▶"}
      </button>
      <button onClick={onStepForward} className={styles.btn} title="Step forward" aria-label="Step forward">
        ⏭
      </button>
      <span className={styles.time}>{formatTime(currentTime)}</span>

      {loopMoved && (
        <>
          <span className={styles.divider} aria-hidden />
          <span className={styles.loopBounds}>
            {"("}
            <span
              className={styles.loopBound}
              style={{ color: atStart ? "var(--color-brand-primary)" : undefined }}
              onClick={onLoopStartReset}
              title="Reset loop start to 0"
              role="button"
            >
              {fmtBound(loopStart!)}
            </span>
            {", "}
            <span
              className={styles.loopBound}
              style={{ color: atEnd ? "var(--color-brand-primary)" : undefined }}
              onClick={onLoopEndReset}
              title="Reset loop end to duration"
              role="button"
            >
              {fmtBound(loopEnd!)}
            </span>
            {")"}
          </span>
        </>
      )}
    </div>
  );
};

export default TimelineControls;
