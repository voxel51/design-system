import { Avatar, AvatarFallback } from "./avatar";
import { cn } from "../../lib/utils";

/**
 * Inline identity chip — avatar + name. Used anywhere metadata shows a person
 * ("Run by", "Created by", assignees) so identity always reads the same way.
 */
export function UserBadge({
  name,
  className,
  size = "sm",
}: {
  name?: string | null;
  className?: string;
  size?: "sm" | "md";
}) {
  const label = name?.trim() || "Unknown";
  const initials = label
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  const dim = size === "md" ? "h-6 w-6" : "h-5 w-5";

  return (
    <span className={cn("inline-flex items-center gap-1.5 min-w-0", className)}>
      <Avatar className={cn(dim, "shrink-0")}>
        <AvatarFallback className="bg-card-elevated text-icon text-[10px] font-medium">
          {initials || "?"}
        </AvatarFallback>
      </Avatar>
      <span className="truncate text-foreground">{label}</span>
    </span>
  );
}
