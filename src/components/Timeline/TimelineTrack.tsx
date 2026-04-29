import clsx from "clsx";
import React from "react";
import styles from "./TimelineTrack.module.css";

export interface TimelineTrackProps {
  id: string;
  color: string;
  bg?: string;
  start: number;
  end: number;
  events?: number[];
  viewStart: number;
  viewEnd: number;
  height?: number;
  labelWidth?: number;
  pinned?: boolean;
  onPinClick?: () => void;
  onSeek?: (time: number) => void;
  onContextMenu?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  style?: React.CSSProperties;
}

const TimelineTrack: React.FC<TimelineTrackProps> = ({
  id,
  color,
  bg,
  start,
  end,
  events = [],
  viewStart,
  viewEnd,
  height = 28,
  labelWidth = 0,
  pinned = false,
  onPinClick,
  onSeek,
  onContextMenu,
  className,
  style,
}) => {
  const viewDuration = viewEnd - viewStart;
  const pct = (t: number) => `${((t - viewStart) / viewDuration) * 100}%`;

  const clippedStart = Math.max(start, viewStart);
  const clippedEnd = Math.min(end, viewEnd);
  const barVisible = clippedStart < clippedEnd;

  return (
    <div
      className={clsx(styles.root, className)}
      style={{ height, ...style }}
      onContextMenu={onContextMenu}
    >
      {labelWidth > 0 && (
        <div className={styles.label} style={{ width: labelWidth }}>
          <div className={styles.dot} style={{ background: color }} />
          <span className={styles.labelText}>{id}</span>
          {onPinClick && (
            <button
              className={clsx(styles.pinBtn, { [styles.pinBtnActive]: pinned })}
              onClick={(e) => { e.stopPropagation(); onPinClick(); }}
              title={pinned ? "Unpin track" : "Pin track"}
              aria-label={pinned ? "Unpin track" : "Pin track"}
            >
              📌
            </button>
          )}
        </div>
      )}
      <div
        className={styles.lane}
        onClick={(e) => {
          if (!onSeek || (e.target as HTMLElement).classList.contains(styles.event)) return;
          const rect = e.currentTarget.getBoundingClientRect();
          onSeek(viewStart + ((e.clientX - rect.left) / rect.width) * (viewEnd - viewStart));
        }}
      >
        {barVisible && (
          <div
            className={styles.bar}
            style={{
              left: pct(clippedStart),
              width: `${((clippedEnd - clippedStart) / viewDuration) * 100}%`,
              background: bg ?? `${color}55`,
              border: `1px solid ${color}88`,
            }}
          />
        )}
        {events
          .filter((t) => t >= viewStart && t <= viewEnd)
          .map((t, i) => (
            <div
              key={i}
              className={styles.event}
              style={{ left: pct(t), background: color }}
              title={`${id} @ ${t.toFixed(3)}s`}
            />
          ))}
      </div>
    </div>
  );
};

export default TimelineTrack;
