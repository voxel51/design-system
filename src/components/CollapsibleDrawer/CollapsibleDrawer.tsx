import { ExpandMore } from "@mui/icons-material";
import classnames from "classnames";
import React, { useState } from "react";
import styles from "./CollapsibleDrawer.module.css";

export interface CollapsibleDrawerProps {
  label?: string;
  defaultOpen?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const CollapsibleDrawer: React.FC<CollapsibleDrawerProps> = ({
  label,
  defaultOpen = true,
  children,
  className,
  style,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={classnames(styles.root, className)} style={style}>
      <div
        className={styles.toggle}
        onClick={() => setOpen((prev) => !prev)}
        role="button"
        aria-expanded={open}
      >
        <ExpandMore
          className={classnames(styles.chevron, { [styles.chevronOpen]: open })}
          fontSize="small"
        />
        {label && <span className={styles.label}>{label}</span>}
      </div>
      <div className={classnames(styles.drawer, { [styles.drawerOpen]: open })}>
        {children}
      </div>
    </div>
  );
};

export default CollapsibleDrawer;
