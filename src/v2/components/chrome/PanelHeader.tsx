import { History, Plus, X, ArrowLeft, Settings, Info } from "lucide-react";
import { VoxelIcon } from "./VoxelIcon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { UnderlineTab, UnderlineTabs } from "../ui/underline-tabs";
import { IconAction } from "../ui/icon-action";
import { TextAction } from "../ui/text-action";

const IconTip = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <Tooltip>
    <TooltipTrigger asChild>{children}</TooltipTrigger>
    <TooltipContent side="bottom"><p className="text-meta">{label}</p></TooltipContent>
  </Tooltip>
);

interface Props {
  activeTab: "chat" | "skills";
  onTabChange: (tab: "chat" | "skills") => void;
  onClose?: () => void;
  onNewChat?: () => void;
  showHistory: boolean;
  onToggleHistory: (show: boolean) => void;
  showSettings?: boolean;
  onToggleSettings?: (show: boolean) => void;
}

export function PanelHeader({ activeTab, onTabChange, onClose, onNewChat, showHistory, onToggleHistory, showSettings, onToggleSettings }: Props) {
  if (showSettings) {
    return (
      <TooltipProvider delayDuration={200}>
      <div className="border-b border-border/30">
        <div className="flex items-center gap-2.5 px-4 py-3">
          <IconTip label="Back">
            <IconAction size="md" className="[&_svg]:size-4" onClick={() => onToggleSettings?.(false)} aria-label="Back">
              <ArrowLeft />
            </IconAction>
          </IconTip>
          <span className="text-body font-medium text-foreground/90">Agent Settings</span>
          <div className="ml-auto">
            <IconTip label="Close panel">
              <IconAction size="md" className="[&_svg]:size-4" onClick={onClose} aria-label="Close panel">
                <X />
              </IconAction>
            </IconTip>
          </div>
        </div>
      </div>
      </TooltipProvider>
    );
  }

  if (showHistory) {
    return (
      <TooltipProvider delayDuration={200}>
      <div className="border-b border-border/30">
        <div className="flex items-center gap-2.5 px-4 py-3">
          <IconTip label="Back">
            <IconAction size="md" className="[&_svg]:size-4" onClick={() => onToggleHistory(false)} aria-label="Back">
              <ArrowLeft />
            </IconAction>
          </IconTip>
          <div className="flex items-center gap-1">
            <span className="text-body font-medium text-foreground/90">Chat History</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <IconAction size="md" className="[&_svg]:size-4" aria-label="About chat history">
                  <Info />
                </IconAction>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[240px]">
                <p className="text-meta leading-relaxed">Your chats are private to you and live in this dataset.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="ml-auto">
            <IconTip label="New chat">
              <TextAction
                onClick={() => { onNewChat?.(); onToggleHistory(false); }}
              >
                <Plus /> New chat
              </TextAction>
            </IconTip>
          </div>
        </div>
      </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
    <div className="border-b border-border/30">
      <div className="flex items-center gap-2.5 px-4 py-3">
        <VoxelIcon size={20} />
        <span className="text-body font-medium text-foreground/90">Voxel Agent</span>

        <div className="ml-auto flex items-center gap-0.5">
          <IconTip label="New chat">
            <IconAction size="md" className="[&_svg]:size-4" aria-label="New chat" onClick={() => { onNewChat?.(); }}>
              <Plus />
            </IconAction>
          </IconTip>
          <IconTip label="Chat history">
            <IconAction size="md" className="[&_svg]:size-4" aria-label="Chat history" onClick={() => onToggleHistory(true)}>
              <History />
            </IconAction>
          </IconTip>
          <IconTip label="Agent settings">
            <IconAction size="md" className="[&_svg]:size-4" aria-label="Agent settings" onClick={() => onToggleSettings?.(true)}>
              <Settings />
            </IconAction>
          </IconTip>
          <IconTip label="Close panel">
            <IconAction size="md" className="[&_svg]:size-4" aria-label="Close panel" onClick={onClose}>
              <X />
            </IconAction>
          </IconTip>
        </div>
      </div>

      <UnderlineTabs className="px-4">
        {(["chat", "skills"] as const).map((tab) => (
          <UnderlineTab
            key={tab}
            active={activeTab === tab}
            onClick={() => onTabChange(tab)}
          >
            {tab === "chat" ? "Prompt" : "Skills"}
          </UnderlineTab>
        ))}
      </UnderlineTabs>
    </div>
    </TooltipProvider>
  );
}
