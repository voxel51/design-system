import clsx from "clsx";
import React from "react";
import styles from "./TimelineControls.module.css";

function formatTime(t: number): string {
  const s = Math.floor(t);
  const cs = Math.floor((t - s) * 100);
  return `0:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
}

export interface TimelineControlsProps {
  currentTime: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
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
  className,
  style,
}) => (
  <div className={clsx(styles.root, className)} style={style}>
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
  </div>
);

export default TimelineControls;
