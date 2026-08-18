import { useState } from "react";
import { Pencil, ClipboardCheck, MoreHorizontal, Tag, FolderPlus, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { TextAction } from "../../ui/text-action";
import { IconAction } from "../../ui/icon-action";
import { buildSelectionPrompt } from "./prompt";
import { IconTooltip } from "../../chrome/IconTooltip";
import { VoxelIcon } from "../../chrome/VoxelIcon";
import {
  DropdownPanel,
  DropdownActionItem,
} from "../../chrome/DropdownPanel";

interface SelectionActionsProps {
  count: number;
  /** Compact = icon-only for the two secondary actions (toolbar swap variant). */
  compact?: boolean;
  onAnnotate?: () => void;
  onReview?: () => void;
  onAskAgent?: () => void;
  /**
   * Hand a starter prompt to the agent surface. The Lovable master pushed
   * this onto a module-level `agentPromptBus`; where the agent lives and how
   * it receives a prompt is application wiring, so it arrives as a callback.
   */
  onSendPrompt?: (prompt: string) => void;
}

/**
 * Single source of truth for the contextual action set that appears on any
 * non-empty sample selection. Reused by the top toolbar swap and by the
 * bottom selection tray so the two never drift.
 *
 * Primaries: Annotate · Review · Ask agent · ⋯ More (overflow placeholder)
 */
export function SelectionActions({
  count,
  compact,
  onAnnotate,
  onReview,
  onAskAgent,
  onSendPrompt,
}: SelectionActionsProps) {
  const [moreOpen, setMoreOpen] = useState(false);

  const handleAnnotate = () => {
    if (onAnnotate) return onAnnotate();
    toast.info("Annotate", { description: `${count} sample${count === 1 ? "" : "s"} queued for annotation` });
  };
  const handleReview = () => {
    if (onReview) return onReview();
    toast.info("Review", { description: `Review started on ${count} sample${count === 1 ? "" : "s"}` });
  };
  const handleAgent = () => {
    // Hand a multi-direction starter prompt to the agent panel; user can
    // trim to the direction they want. Panel-open is a separate concern
    // (parent decides where the agent lives).
    onSendPrompt?.(buildSelectionPrompt(count));
    if (onAskAgent) return onAskAgent();
    toast.info("Voxel Agent", { description: `Context: ${count} selected sample${count === 1 ? "" : "s"}` });
  };

  return (
    <div className="flex items-center gap-0.5">
      <TextAction size="sm" onClick={handleAnnotate} className="gap-1.5">
        <Pencil className="h-3.5 w-3.5 text-icon" strokeWidth={1.5} />
        {!compact && <span>Annotate</span>}
      </TextAction>

      <TextAction size="sm" onClick={handleReview} className="gap-1.5">
        <ClipboardCheck className="h-3.5 w-3.5 text-icon" strokeWidth={1.5} />
        {!compact && <span>Review</span>}
      </TextAction>

      <TextAction size="sm" onClick={handleAgent} className="gap-1.5">
        <VoxelIcon size={14} />
        {!compact && <span>Ask agent</span>}
      </TextAction>

      <div className="relative">
        <IconTooltip label="More actions">
          <IconAction
            size="md"
            onClick={(e) => {
              e.stopPropagation();
              setMoreOpen((v) => !v);
            }}
            data-state={moreOpen ? "open" : undefined}
            aria-label="More actions"
          >
            <MoreHorizontal />
          </IconAction>
        </IconTooltip>
        {moreOpen && (
          <DropdownPanel width="w-56" className="right-0" onClose={() => setMoreOpen(false)}>
            <DropdownActionItem
              icon={Tag}
              label="Tag…"
              desc={`Apply a tag to ${count} sample${count === 1 ? "" : "s"}`}
              onClick={() => {
                setMoreOpen(false);
                toast.info("Tag flow — coming soon");
              }}
            />
            <DropdownActionItem
              icon={FolderPlus}
              label="Add to collection…"
              onClick={() => {
                setMoreOpen(false);
                toast.info("Add to collection — coming soon");
              }}
            />
            <DropdownActionItem
              icon={Download}
              label="Export…"
              onClick={() => {
                setMoreOpen(false);
                toast.info("Export — coming soon");
              }}
            />
            <DropdownActionItem
              icon={Trash2}
              label="Delete…"
              onClick={() => {
                setMoreOpen(false);
                toast.info("Delete — coming soon");
              }}
            />
          </DropdownPanel>
        )}
      </div>
    </div>
  );
}
