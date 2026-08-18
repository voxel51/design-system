import React from "react";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

/* ── Shared dropdown panel container ── */
interface DropdownPanelProps {
  children: React.ReactNode;
  className?: string;
  width?: string;
  onClick?: (e: React.MouseEvent) => void;
  onClose?: () => void;
}

export function DropdownPanel({ children, className, width = "w-52", onClick, onClose }: DropdownPanelProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);

  /**
   * Outside-click dismissal without a full-screen backdrop.
   *
   * A `fixed inset-0` backdrop swallows the *first* click on any other
   * control (it only closes this menu), which is why in-context menus felt
   * like they needed two clicks. Listening on the document instead lets the
   * same click both dismiss this panel and activate whatever was clicked.
   *
   * Clicks inside the panel's positioning wrapper (which also holds the
   * trigger) are ignored so the trigger keeps its own toggle behaviour.
   */
  React.useEffect(() => {
    if (!onClose) return;
    const handler = (e: MouseEvent) => {
      const panel = panelRef.current;
      if (!panel) return;
      const target = e.target as Node | null;
      if (!target || !target.isConnected) return;
      const scope = panel.parentElement ?? panel;
      if (scope.contains(target)) return;
      onClose();
    };
    // `mousedown` in the capture phase: fires before React onClick handlers,
    // so state settles before the new trigger toggles.
    document.addEventListener("mousedown", handler, true);
    return () => document.removeEventListener("mousedown", handler, true);
  }, [onClose]);

  React.useEffect(() => {
    if (!onClose) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      onClick={onClick ?? ((e) => e.stopPropagation())}
      className={cn(
        "absolute top-full mt-1 z-30 rounded-md bg-popover border border-border p-1.5 shadow-xl",
        width,
        className,
      )}
    >
      {children}
    </div>
  );
}


/* ── Section heading ── */
export function DropdownHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2.5 py-1.5 text-meta uppercase tracking-wider text-muted-foreground font-semibold">
      {children}
    </div>
  );
}

/* ── Separator ── */
export function DropdownDivider() {
  return <div className="my-1 h-px bg-border/40" />;
}

/* ── Simple text row (select-style) ── */
interface DropdownSelectItemProps {
  label: string;
  selected?: boolean;
  onClick: () => void;
  trailing?: React.ReactNode;
}

export function DropdownSelectItem({ label, selected, onClick, trailing }: DropdownSelectItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-body transition-colors",
        selected
          ? "bg-primary/10 text-foreground font-medium"
          : "text-secondary-foreground hover:bg-card hover:text-foreground",
      )}
    >
      <span className="flex-1 text-left">{label}</span>
      {trailing && <span className="ml-auto">{trailing}</span>}
      {selected && <Check className="h-3.5 w-3.5 text-primary shrink-0" strokeWidth={2.5} />}
    </button>
  );
}

/* ── Action row with icon + optional description ── */
interface DropdownActionItemProps {
  icon: React.ElementType;
  label: string;
  desc?: string;
  disabled?: boolean;
  onClick: () => void;
}

export function DropdownActionItem({ icon: Icon, label, desc, disabled, onClick }: DropdownActionItemProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-md px-2.5 py-2.5 transition-colors hover:bg-card disabled:opacity-40"
    >
      <Icon className="h-4 w-4 text-icon shrink-0" />
      <div className="text-left">
        <div className="text-body text-foreground">{label}</div>
        {desc && <div className="text-body text-muted-foreground">{desc}</div>}
      </div>
    </button>
  );
}

/* ── Toggle row (icon + label, highlighted when active) ── */
interface DropdownToggleItemProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}

export function DropdownToggleItem({ icon: Icon, label, active, onClick }: DropdownToggleItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-body transition-colors hover:bg-card hover:text-foreground",
        active ? "text-foreground" : "text-secondary-foreground",
      )}
    >
      <Icon className={cn("h-4 w-4", active ? "text-icon" : "text-icon")} />
      {label}
    </button>
  );
}
