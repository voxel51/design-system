import clsx from "clsx";
import React from "react";
import FullscreenIcon from "@/img/Fullscreen.svg?react";
import SettingsIcon from "@/img/Settings.svg?react";
import CloseIcon from "@/img/Close.svg?react";
import styles from "./Tile.module.css";

export interface TileProps {
  title: string;
  onClose?: () => void;
  onSettings?: () => void;
  onFullscreen?: () => void;
  extraActions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Tile: React.FC<TileProps> = ({
  title,
  onClose,
  onSettings,
  onFullscreen,
  extraActions,
  children,
  className,
  style,
}) => {
  return (
    <div className={clsx(styles.root, className)} style={style}>
      <div className={styles.header}>
        <span className={styles.title} title={title}>
          {title}
        </span>
        <div className={styles.actions}>
          {extraActions}
          {onFullscreen && (
            <button
              className={styles.actionBtn}
              onClick={onFullscreen}
              type="button"
              title="Fullscreen"
              aria-label="Fullscreen"
            >
              <FullscreenIcon width={12} height={12} />
            </button>
          )}
          {onSettings && (
            <button
              className={styles.actionBtn}
              onClick={onSettings}
              type="button"
              title="Settings"
              aria-label="Settings"
            >
              <SettingsIcon width={12} height={12} />
            </button>
          )}
          {onClose && (
            <button
              className={styles.actionBtn}
              onClick={onClose}
              type="button"
              title="Close"
              aria-label="Close"
            >
              <CloseIcon width={12} height={12} />
            </button>
          )}
        </div>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Tile;
