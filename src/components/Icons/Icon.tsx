import clsx from "clsx";
import React, { type FC } from "react";

import { Spinner } from "@/components/Spinner";
import AIIcon from "@/img/AI.svg?react";
import AddIcon from "@/img/Add.svg?react";
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
import CircleIcon from "@/img/Circle.svg?react";
import CloseIcon from "@/img/Close.svg?react";
import CodeIcon from "@/img/Code.svg?react";
import ContentCopyIcon from "@/img/ContentCopy.svg?react";
import DateRangeIcon from "@/img/DateRange.svg?react";
import DeleteIcon from "@/img/Delete.svg?react";
import DetectionIcon from "@/img/Detection.svg?react";
import DragIcon from "@/img/Drag.svg?react";
import DrawIcon from "@/img/Draw.svg?react";
import EditIcon from "@/img/Edit.svg?react";
import EmbeddingsIcon from "@/img/Embeddings.svg?react";
import EnterIcon from "@/img/Enter.svg?react";
import ErrorIcon from "@/img/Error.svg?react";
import ExitWorkspaceIcon from "@/img/ExitWorkspace.svg?react";
import ExternalLinkIcon from "@/img/ExternalLink.svg?react";
import FineTuneIcon from "@/img/FineTune.svg?react";
import FullscreenIcon from "@/img/Fullscreen.svg?react";
import GridViewIcon from "@/img/GridView.svg?react";
import ImageSearchIcon from "@/img/ImageSearch.svg?react";
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
import OrchestratorIcon from "@/img/Orchestrator.svg?react";
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
import { BrandColor, IconColor, TextColor, textColorClass } from "@/types";
import { IconName } from "@/types/icons";
import { Size } from "@/types/size";

type SvgComponent = React.FC<React.SVGProps<SVGSVGElement>>;

/**
 * To add a new icon:
 * 1. add the SVG file to the image directory,
 * 2. create a enum value for the icon name
 * 3. import the SVG file and add it to this map
 */
export const iconMap: Record<
  Exclude<IconName, IconName.Spinner>,
  SvgComponent
> = {
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
  [IconName.Circle]: CircleIcon,
  [IconName.Close]: CloseIcon,
  [IconName.Code]: CodeIcon,
  [IconName.ContentCopy]: ContentCopyIcon,
  [IconName.DateRange]: DateRangeIcon,
  [IconName.Delete]: DeleteIcon,
  [IconName.Detection]: DetectionIcon,
  [IconName.Drag]: DragIcon,
  [IconName.Draw]: DrawIcon,
  [IconName.Edit]: EditIcon,
  [IconName.Embeddings]: EmbeddingsIcon,
  [IconName.Enter]: EnterIcon,
  [IconName.Error]: ErrorIcon,
  [IconName.ExitWorkspace]: ExitWorkspaceIcon,
  [IconName.ExternalLink]: ExternalLinkIcon,
  [IconName.FineTune]: FineTuneIcon,
  [IconName.Fullscreen]: FullscreenIcon,
  [IconName.GridView]: GridViewIcon,
  [IconName.ImageSearch]: ImageSearchIcon,
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
  [IconName.Orchestrator]: OrchestratorIcon,
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
  [Size.Xl]: 18,
};

export interface IconProps {
  name: IconName;
  size?: Size;
  className?: string;
  color?: TextColor | IconColor | BrandColor;
  style?: React.CSSProperties;
}

/**
 * An generic icon component which will take the form of the icon specified by `name`.
 *
 * @example
 * ```tsx
 * <Icon name={IconName.Edit} size={Size.Md} />
 * ```
 *
 * @param name Icon to display. See {@link IconName}.
 * @param size The size of the icon. See {@link Size}.
 * @param className `class` overrides to apply to the component.
 * @param color Color of the icon. By default, the icon inherits the text color of its container.
 * @param style `style` overrides to apply to the icon.
 * @param props Additional HTML properties to apply to the component.
 */
export const Icon: FC<IconProps> = ({
  name,
  size = undefined, // if no size specified, fill the parent container
  className,
  color,
  ...props
}) => {
  // We are making a strong opinion here that we should treat the SVG
  // as a square - the viewbox on the SVG will still handle the aspect
  // ratio but it's possible that VERY rectangular SVGs will not behave
  // as expected.
  const iconSize = size ? sizeMap[size] : undefined;
  const IconComponent = name === IconName.Spinner ? Spinner : iconMap[name];

  return (
    <IconComponent
      width={iconSize}
      height={iconSize}
      size={size}
      className={clsx(color && textColorClass(color), className)}
      {...props}
    />
  );
};
