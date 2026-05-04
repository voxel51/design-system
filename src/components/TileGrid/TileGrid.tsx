import clsx from "clsx";
import React from "react";
import { Tile } from "../Tile";
import styles from "./TileGrid.module.css";

export interface TileConfig {
  id: string;
  title: string;
  colSpan?: number;
  rowSpan?: number;
  content?: React.ReactNode;
  onClose?: () => void;
  onSettings?: () => void;
}

export interface TileGridProps {
  tiles: TileConfig[];
  gap?: number;
  rowHeight?: number;
  className?: string;
  style?: React.CSSProperties;
}

const TileGrid: React.FC<TileGridProps> = ({
  tiles,
  gap = 4,
  rowHeight = 180,
  className,
  style,
}) => {
  return (
    <div
      className={clsx(styles.root, className)}
      style={{
        padding: gap,
        gap,
        gridAutoRows: `${rowHeight}px`,
        ...style,
      }}
    >
      {tiles.map((tile) => (
        <div
          key={tile.id}
          className={styles.tile}
          style={{
            gridColumn: `span ${tile.colSpan ?? 4}`,
            gridRow: `span ${tile.rowSpan ?? 1}`,
          }}
        >
          <Tile
            title={tile.title}
            onClose={tile.onClose}
            onSettings={tile.onSettings}
          >
            {tile.content}
          </Tile>
        </div>
      ))}
    </div>
  );
};

export default TileGrid;
