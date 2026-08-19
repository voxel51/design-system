import { ChevronDown, User } from "lucide-react";
import * as React from "react";

import { cn } from "../../lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

/**
 * Account menu for the app header — an avatar pill that opens a menu.
 *
 * The pill is deliberately not a bare avatar: at 24px an avatar alone reads as
 * decoration, and the chevron is what marks it as the thing to click. Ported
 * from the Lovable master, where it sits at the right end of both headers.
 *
 * The master hand-rolls the open state with a `mousedown` listener. This uses
 * `DropdownMenu`, so it gets focus return, Escape, arrow-key navigation, and
 * typeahead — none of which the hand-rolled version has.
 *
 * The menu body is yours to compose from the `DropdownMenu*` parts; the
 * contents differ per app and none of it belongs in the design system.
 */
export interface UserMenuProps {
  /** Menu body. Compose from `DropdownMenuItem`, `DropdownMenuSeparator`, … */
  children: React.ReactNode;
  /**
   * Avatar inside the pill. Defaults to a person glyph on `bg-card-elevated`.
   * Pass an `<img>` or initials to show a real user.
   */
  avatar?: React.ReactNode;
  align?: "start" | "center" | "end";
  /** Accessible name for the trigger. */
  label?: string;
  className?: string;
  contentClassName?: string;
}

export function UserMenu({
  children,
  avatar,
  align = "end",
  label = "Account menu",
  className,
  contentClassName,
}: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className={cn(
            "flex items-center gap-1.5 rounded-full border border-border/10 bg-card-2 py-1 pl-1 pr-2 transition-colors",
            "hover:border-border/30 data-[state=open]:border-border/30",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
            className,
          )}
        >
          {avatar ?? (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-card-elevated">
              <User className="h-3 w-3 text-muted-foreground" />
            </span>
          )}
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className={cn("min-w-[12rem]", contentClassName)}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Name-over-detail block for the top of a `UserMenu`. Not a menu item — it is
 * a caption, so it takes no focus and does not close the menu.
 */
export interface UserMenuIdentityProps {
  name: React.ReactNode;
  /** Second line: email in the master, organization in teams-app. */
  detail?: React.ReactNode;
  className?: string;
}

export function UserMenuIdentity({
  name,
  detail,
  className,
}: UserMenuIdentityProps) {
  return (
    <div className={cn("px-2.5 py-1.5", className)}>
      <p className="text-body-sm text-foreground">{name}</p>
      {detail && <p className="text-meta text-muted-foreground">{detail}</p>}
    </div>
  );
}
