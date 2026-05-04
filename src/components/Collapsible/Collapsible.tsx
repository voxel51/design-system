import clsx from "clsx";
import React from "react";
import { useDisclosure, UseDisclosureOptions } from "@/util/useDisclosure";
import styles from "./Collapsible.module.css";

export interface CollapsibleState {
  open: boolean;
  toggle: () => void;
}

export interface CollapsibleProps extends UseDisclosureOptions {
  /**
   * Render prop for the header. Receives open state and toggle callback.
   * The header decides what to render — a chevron row, a button, nothing.
   */
  header?: (state: CollapsibleState) => React.ReactNode;
  /**
   * When false, content is always visible and no max-height animation runs.
   * Use this inside Drawer where the outer container handles the reveal.
   * Default: true.
   */
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
  const { open, toggle } = useDisclosure({ defaultOpen, open: controlledOpen, onOpenChange });

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
