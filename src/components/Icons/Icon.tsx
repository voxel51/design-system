import clsx from "clsx";
import { type FC } from "react";

import { Size } from "@/types/size";

import AddIcon from "@/img/Add.svg?react";
import AIIcon from "@/img/AI.svg?react";
import ArrowDownIcon from "@/img/ArrowDown.svg?react";
import ArrowLeftIcon from "@/img/ArrowLeft.svg?react";
import ArrowRightIcon from "@/img/ArrowRight.svg?react";
import ArrowUpIcon from "@/img/ArrowUp.svg?react";
import CaretDownIcon from "@/img/CaretDown.svg?react";
import CheckIcon from "@/img/Check.svg?react";
import CheckboxIcon from "@/img/Checkbox.svg?react";
import ChecklistIcon from "@/img/Checklist.svg?react";
import ChevronBottomIcon from "@/img/ChevronBottom.svg?react";
import ChevronLeftIcon from "@/img/ChevronLeft.svg?react";
import ChevronRightIcon from "@/img/ChevronRight.svg?react";
import ChevronTopIcon from "@/img/ChevronTop.svg?react";
import CloseIcon from "@/img/Close.svg?react";
import CodeIcon from "@/img/Code.svg?react";
import DateRangeIcon from "@/img/DateRange.svg?react";
import DeleteIcon from "@/img/Delete.svg?react";
import DetectionIcon from "@/img/Detection.svg?react";
import DragIcon from "@/img/Drag.svg?react";
import EditIcon from "@/img/Edit.svg?react";
import EmbeddingsIcon from "@/img/Embeddings.svg?react";
import EnterIcon from "@/img/Enter.svg?react";
import ErrorIcon from "@/img/Error.svg?react";
import ExitWorkspaceIcon from "@/img/ExitWorkspace.svg?react";
import ExternalLinkIcon from "@/img/ExternalLink.svg?react";
import FineTuneIcon from "@/img/FineTune.svg?react";
import FullscreenIcon from "@/img/Fullscreen.svg?react";
import InfoIcon from "@/img/Info.svg?react";
import InspectIcon from "@/img/Inspect.svg?react";
import JSONIcon from "@/img/JSON.svg?react";
import LockIcon from "@/img/Lock.svg?react";
import LogsIcon from "@/img/Logs.svg?react";
import MenuIcon from "@/img/Menu.svg?react";
import MoreHorizontalIcon from "@/img/MoreHorizontal.svg?react";
import MoreVerticalIcon from "@/img/MoreVertical.svg?react";
import MoveIcon from "@/img/Move.svg?react";
import NotesIcon from "@/img/Notes.svg?react";
import PinIcon from "@/img/Pin.svg?react";
import PolylineIcon from "@/img/Polyline.svg?react";
import RadioIcon from "@/img/Radio.svg?react";
import RedoIcon from "@/img/Redo.svg?react";
import RefreshIcon from "@/img/Refresh.svg?react";
import RemoveIcon from "@/img/Remove.svg?react";
import SearchIcon from "@/img/Search.svg?react";
import SettingsIcon from "@/img/Settings.svg?react";
import SliderIcon from "@/img/Slider.svg?react";
import TagIcon from "@/img/Tag.svg?react";
import TextIcon from "@/img/Text.svg?react";
import ToggleIcon from "@/img/Toggle.svg?react";
import UndoIcon from "@/img/Undo.svg?react";
import UnfoldMoreIcon from "@/img/UnfoldMore.svg?react";
import UnlockIcon from "@/img/Unlock.svg?react";
import UnsupportedIcon from "@/img/Unsupported.svg?react";
import VALIcon from "@/img/VAL.svg?react";
import WarningIcon from "@/img/Warning.svg?react";
import WorkspacesIcon from "@/img/Workspaces.svg?react";
import { IconName } from "@/types/icons";

type SvgComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export const iconMap: Record<IconName, SvgComponent> = {
  [IconName.Add]: AddIcon,
  [IconName.AI]: AIIcon,
  [IconName.ArrowDown]: ArrowDownIcon,
  [IconName.ArrowLeft]: ArrowLeftIcon,
  [IconName.ArrowRight]: ArrowRightIcon,
  [IconName.ArrowUp]: ArrowUpIcon,
  [IconName.CaretDown]: CaretDownIcon,
  [IconName.Check]: CheckIcon,
  [IconName.Checkbox]: CheckboxIcon,
  [IconName.Checklist]: ChecklistIcon,
  [IconName.ChevronBottom]: ChevronBottomIcon,
  [IconName.ChevronLeft]: ChevronLeftIcon,
  [IconName.ChevronRight]: ChevronRightIcon,
  [IconName.ChevronTop]: ChevronTopIcon,
  [IconName.Close]: CloseIcon,
  [IconName.Code]: CodeIcon,
  [IconName.DateRange]: DateRangeIcon,
  [IconName.Delete]: DeleteIcon,
  [IconName.Detection]: DetectionIcon,
  [IconName.Drag]: DragIcon,
  [IconName.Edit]: EditIcon,
  [IconName.Embeddings]: EmbeddingsIcon,
  [IconName.Enter]: EnterIcon,
  [IconName.Error]: ErrorIcon,
  [IconName.ExitWorkspace]: ExitWorkspaceIcon,
  [IconName.ExternalLink]: ExternalLinkIcon,
  [IconName.FineTune]: FineTuneIcon,
  [IconName.Fullscreen]: FullscreenIcon,
  [IconName.Info]: InfoIcon,
  [IconName.Inspect]: InspectIcon,
  [IconName.JSON]: JSONIcon,
  [IconName.Lock]: LockIcon,
  [IconName.Logs]: LogsIcon,
  [IconName.Menu]: MenuIcon,
  [IconName.MoreHorizontal]: MoreHorizontalIcon,
  [IconName.MoreVertical]: MoreVerticalIcon,
  [IconName.Move]: MoveIcon,
  [IconName.Notes]: NotesIcon,
  [IconName.Pin]: PinIcon,
  [IconName.Polyline]: PolylineIcon,
  [IconName.Radio]: RadioIcon,
  [IconName.Redo]: RedoIcon,
  [IconName.Refresh]: RefreshIcon,
  [IconName.Remove]: RemoveIcon,
  [IconName.Search]: SearchIcon,
  [IconName.Settings]: SettingsIcon,
  [IconName.Slider]: SliderIcon,
  [IconName.Tag]: TagIcon,
  [IconName.Text]: TextIcon,
  [IconName.Toggle]: ToggleIcon,
  [IconName.Undo]: UndoIcon,
  [IconName.UnfoldMore]: UnfoldMoreIcon,
  [IconName.Unlock]: UnlockIcon,
  [IconName.Unsupported]: UnsupportedIcon,
  [IconName.VAL]: VALIcon,
  [IconName.Warning]: WarningIcon,
  [IconName.Workspaces]: WorkspacesIcon,
};

type IconSize = Exclude<Size, "Xs">;

const sizeMap: Partial<Record<IconSize, number>> = {
  [Size.Sm]: 12,
  [Size.Md]: 14,
  [Size.Lg]: 16,
};

export interface IconProps {
  name: IconName;
  size?: Size;
  className?: string;
  color?: string;
  style?: React.CSSProperties;
}

export const Icon: FC<IconProps> = ({
  name,
  size = Size.Md,
  className,
  color,
  style,
  ...props
}) => {
  const iconSize = sizeMap[size];
  const IconComponent = iconMap[name];

  return (
    <IconComponent
      width={iconSize}
      height={iconSize}
      className={clsx(className)}
      style={{ color, ...style }}
      {...props}
    />
  );
};
