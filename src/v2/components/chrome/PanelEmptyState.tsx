import type { ComponentType, ReactNode } from "react";

interface Props {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: ReactNode;
}

/**
 * Standard empty state for panels with no content yet.
 * Matches the run/agent/embeddings list empty states:
 * decorative icon → title → description → optional CTA.
 */
export function PanelEmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <Icon className="h-9 w-9 text-icon-decorative mb-4" />
      <div className="text-title font-medium text-foreground mb-2">{title}</div>
      <div className="text-body text-secondary-foreground mb-6 max-w-[370px] leading-relaxed">
        {description}
      </div>
      {action}
    </div>
  );
}
