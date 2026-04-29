import React, { useRef, useState } from "react";
import { Mosaic, MosaicWindow, MosaicNode, MosaicBranch, MosaicWindowProps, createRemoveUpdate, createExpandUpdate, updateTree } from "react-mosaic-component";
import "react-mosaic-component/react-mosaic-component.css";
import CloseIcon from "@/img/Close.svg?react";
import FullscreenIcon from "@/img/Fullscreen.svg?react";
import SettingsIcon from "@/img/Settings.svg?react";
import styles from "./MosaicGrid.module.css";

export interface MosaicTileConfig {
  title: string;
  type?: string;
  content?: React.ReactNode;
  onSettings?: () => void;
}

export interface MosaicGridProps {
  tiles: Record<string, MosaicTileConfig>;
  value: MosaicNode<string> | null;
  onChange: (node: MosaicNode<string> | null) => void;
  focusedTileId?: string | null;
  onFocusTile?: (id: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function addTileToLayout(
  layout: MosaicNode<string> | null,
  newId: string
): MosaicNode<string> {
  if (layout === null) return newId;
  return { direction: "row", first: layout, second: newId, splitPercentage: 70 };
}

const FOCUSED_CLASS = "vd-tile-focused";

const MosaicGrid: React.FC<MosaicGridProps> = ({
  tiles,
  value,
  onChange,
  focusedTileId,
  onFocusTile,
  className,
  style,
}) => {
  const [expandedTileId, setExpandedTileId] = useState<string | null>(null);
  const preExpandLayout = useRef<MosaicNode<string> | null>(null);

  const handleExpand = (id: string, path: MosaicBranch[]) => {
    if (expandedTileId === id) {
      onChange(preExpandLayout.current!);
      preExpandLayout.current = null;
      setExpandedTileId(null);
    } else {
      preExpandLayout.current = value;
      onChange(updateTree(value!, [createExpandUpdate(path, 100)]));
      setExpandedTileId(id);
    }
  };

  const renderTile = (id: string, path: MosaicBranch[]) => {
    const tile = tiles[id];
    if (!tile) return <div />;

    const isFocused = focusedTileId === id;
    const isExpanded = expandedTileId === id;

    const handleClose = () => {
      if (expandedTileId === id) {
        preExpandLayout.current = null;
        setExpandedTileId(null);
      }
      const update = createRemoveUpdate(value, path);
      onChange(updateTree(value!, [update]));
    };

    const toolbar = (_props: MosaicWindowProps<string>, draggable: boolean | undefined) => (
      <div
        className={styles.toolbar}
        data-draggable={draggable || undefined}
        data-focused={isFocused || undefined}
        onPointerDown={() => onFocusTile?.(id)}
      >
        <span className={styles.title} title={tile.title}>
          {tile.title}
        </span>
        <div className={styles.actions}>
          {tile.onSettings && (
            <button
              className={styles.actionBtn}
              onClick={(e) => { e.stopPropagation(); tile.onSettings!(); }}
              title="Settings"
              aria-label="Settings"
            >
              <SettingsIcon width={12} height={12} />
            </button>
          )}
          <button
            className={styles.actionBtn}
            data-active={isExpanded || undefined}
            onClick={(e) => { e.stopPropagation(); handleExpand(id, path); }}
            title={isExpanded ? "Restore" : "Expand"}
            aria-label={isExpanded ? "Restore" : "Expand"}
          >
            <FullscreenIcon width={12} height={12} />
          </button>
          <button
            className={styles.actionBtn}
            onClick={(e) => { e.stopPropagation(); handleClose(); }}
            title="Close"
            aria-label="Close"
          >
            <CloseIcon width={12} height={12} />
          </button>
        </div>
      </div>
    );

    return (
      <MosaicWindow<string>
        path={path}
        title={tile.title}
        toolbarControls={[]}
        renderToolbar={toolbar}
        className={isFocused ? FOCUSED_CLASS : undefined}
      >
        <div
          className={styles.body}
          onPointerDown={() => onFocusTile?.(id)}
        >
          {tile.content}
        </div>
      </MosaicWindow>
    );
  };

  return (
    <div className={`${styles.root}${className ? ` ${className}` : ""}`} style={style}>
      <Mosaic<string>
        className={styles.mosaic}
        value={value}
        onChange={onChange}
        renderTile={renderTile}
        zeroStateView={
          <div className={styles.empty}>No panels open</div>
        }
      />
    </div>
  );
};

export default MosaicGrid;
