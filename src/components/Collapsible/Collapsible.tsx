import clsx from "clsx";
import React from "react";

import { useDisclosure, UseDisclosureOptions } from "@/util/useDisclosure";

import styles from "./Collapsible.module.css";

/**
 * Snapshot of open/close state passed to the `header` render prop so the
 * caller can style the trigger element (e.g. rotate a chevron icon).
 */
export interface CollapsibleState {
  /** Whether the content area is currently open. */
  open: boolean;
  /** Toggles the open state. Calls `onOpenChange` when in controlled mode. */
  toggle: () => void;
}

/**
 * Props for {@link Collapsible}.
 *
 * Extends {@link UseDisclosureOptions} so the component supports both
 * uncontrolled (`defaultOpen`) and controlled (`open` + `onOpenChange`) usage.
 */
export interface CollapsibleProps extends UseDisclosureOptions {
  /**
   * Render prop for the clickable header. Receives the current
   * {@link CollapsibleState} so the caller can wire up the toggle and reflect
   * open state in the trigger UI.
   *
   * @example
   * ```tsx
   * <Collapsible header={({ open, toggle }) => (
   *   <button onClick={toggle}>{open ? "Hide" : "Show"}</button>
   * )}>
   *   content
   * </Collapsible>
   * ```
   */
  header?: (state: CollapsibleState) => React.ReactNode;
  /**
   * When `true` (default), the content area expands and collapses with a CSS
   * `max-height` transition so the DOM node stays mounted and accessible while
   * collapsed. When `false`, children are unmounted immediately with no animation.
   * @default true
   */
  animated?: boolean;
  /** Content to show or hide. */
  children?: React.ReactNode;
  /** Additional class name applied to the root element. */
  className?: string;
  /** Inline styles applied to the root element. */
  style?: React.CSSProperties;
}

/**
 * A vertically collapsible container with an optional header trigger.
 *
 * Supports uncontrolled and controlled open state via {@link useDisclosure}.
 * When `animated` is true, content visibility is driven by a CSS `max-height`
 * transition so the DOM node stays mounted and accessible while collapsed.
 *
 * @example
 * ```tsx
 * // Uncontrolled — starts open
 * <Collapsible
 *   header={({ open, toggle }) => (
 *     <button onClick={toggle}>{open ? "Collapse" : "Expand"}</button>
 *   )}
 * >
 *   <p>Hidden content</p>
 * </Collapsible>
 *
 * // Controlled
 * const [open, setOpen] = useState(false);
 * <Collapsible open={open} onOpenChange={setOpen} header={({ toggle }) => (
 *   <button onClick={toggle}>Toggle</button>
 * )}>
 *   <p>Controlled content</p>
 * </Collapsible>
 * ```
 */
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
      ) : open ? (
        children
      ) : null}
    </div>
  );
};

export default Collapsible;
