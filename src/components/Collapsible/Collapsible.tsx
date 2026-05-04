import clsx from "clsx";
import React from "react";

import { useDisclosure, UseDisclosureOptions } from "@/util/useDisclosure";

import styles from "./Collapsible.module.css";

export interface CollapsibleState {
  open: boolean;
  toggle: () => void;
}

export interface CollapsibleProps extends UseDisclosureOptions {
  header?: (state: CollapsibleState) => React.ReactNode;
  animated?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Collapsible: React.FC<CollapsibleProps> = ({
  defaultOpen = true,
  open: controlledOpen,
  onOpenChange,
  header,
  animated = true,
  children,
  className,
  style,
}) => {
  const { open, toggle } = useDisclosure({
    defaultOpen,
    open: controlledOpen,
    onOpenChange,
  });

  return (
    <div className={clsx(styles.root, className)} style={style}>
      {header?.({ open, toggle })}
      {animated ? (
        <div className={clsx(styles.content, { [styles.contentOpen]: open })}>
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default Collapsible;
