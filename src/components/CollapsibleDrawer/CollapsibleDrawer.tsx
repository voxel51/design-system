import clsx from "clsx";
import React, { useState } from "react";
import ChevronBottomIcon from "@/img/ChevronBottom.svg?react";
import styles from "./CollapsibleDrawer.module.css";

export interface CollapsibleDrawerProps {
  label?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: "left" | "right";
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const CollapsibleDrawer: React.FC<CollapsibleDrawerProps> = ({
  label,
  defaultOpen = true,
  open: controlledOpen,
  onOpenChange,
  align = "left",
  children,
  className,
  style,
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleToggle = () => {
    const next = !open;
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <div className={clsx(styles.root, className)} style={style}>
      <div
        className={clsx(styles.toggle, { [styles.toggleRight]: align === "right" })}
        onClick={handleToggle}
        role="button"
        aria-expanded={open}
      >
        <ChevronBottomIcon
          className={clsx(styles.chevron, { [styles.chevronOpen]: open })}
          width={16}
          height={16}
        />
        {label && <span className={styles.label}>{label}</span>}
      </div>
      <div className={clsx(styles.drawer, { [styles.drawerOpen]: open })}>
        {children}
      </div>
    </div>
  );
};

export default CollapsibleDrawer;
