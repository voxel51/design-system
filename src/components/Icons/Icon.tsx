import clsx from "clsx";
import React, { type FC } from "react";

import { Spinner } from "@/components/Spinner";
import AIIcon from "@/img/AI.svg?react";
import ActivityIcon from "@/img/Activity.svg?react";
import AddIcon from "@/img/Add.svg?react";
import AnnotateIcon from "@/img/Annotate.svg?react";
import ArrowDownIcon from "@/img/ArrowDown.svg?react";
import ArrowLeftIcon from "@/img/ArrowLeft.svg?react";
import ArrowRightIcon from "@/img/ArrowRight.svg?react";
import ArrowUpIcon from "@/img/ArrowUp.svg?react";
import ArrowUpRightIcon from "@/img/ArrowUpRight.svg?react";
import BlocksIcon from "@/img/Blocks.svg?react";
import BoxesIcon from "@/img/Boxes.svg?react";
import CalendarClockIcon from "@/img/CalendarClock.svg?react";
import CaretDownIcon from "@/img/CaretDown.svg?react";
import CheckIcon from "@/img/Check.svg?react";
import CheckboxIcon from "@/img/Checkbox.svg?react";
import ChecklistIcon from "@/img/Checklist.svg?react";
import ChevronBottomIcon from "@/img/ChevronBottom.svg?react";
import ChevronLeftIcon from "@/img/ChevronLeft.svg?react";
import ChevronRightIcon from "@/img/ChevronRight.svg?react";
import ChevronTopIcon from "@/img/ChevronTop.svg?react";
import CircleIcon from "@/img/Circle.svg?react";
import CircleUserIcon from "@/img/CircleUser.svg?react";
import CloseIcon from "@/img/Close.svg?react";
import CloudIcon from "@/img/Cloud.svg?react";
import CloudCogIcon from "@/img/CloudCog.svg?react";
import CodeIcon from "@/img/Code.svg?react";
import CogIcon from "@/img/Cog.svg?react";
import ContactIcon from "@/img/Contact.svg?react";
import ContentCopyIcon from "@/img/ContentCopy.svg?react";
import DatabaseIcon from "@/img/Database.svg?react";
import DateRangeIcon from "@/img/DateRange.svg?react";
import DeleteIcon from "@/img/Delete.svg?react";
import DetectionIcon from "@/img/Detection.svg?react";
import DownloadIcon from "@/img/Download.svg?react";
import DragIcon from "@/img/Drag.svg?react";
import DrawIcon from "@/img/Draw.svg?react";
import EditIcon from "@/img/Edit.svg?react";
import EmbeddingsIcon from "@/img/Embeddings.svg?react";
import EnterIcon from "@/img/Enter.svg?react";
import ErrorIcon from "@/img/Error.svg?react";
import ExitWorkspaceIcon from "@/img/ExitWorkspace.svg?react";
import ExternalLinkIcon from "@/img/ExternalLink.svg?react";
import FileClockIcon from "@/img/FileClock.svg?react";
import FineTuneIcon from "@/img/FineTune.svg?react";
import FingerprintIcon from "@/img/Fingerprint.svg?react";
import FullscreenIcon from "@/img/Fullscreen.svg?react";
import GridViewIcon from "@/img/GridView.svg?react";
import HistoryIcon from "@/img/History.svg?react";
import IdCardIcon from "@/img/IdCard.svg?react";
import ImageSearchIcon from "@/img/ImageSearch.svg?react";
import InfoIcon from "@/img/Info.svg?react";
import InsightsIcon from "@/img/Insights.svg?react";
import InspectIcon from "@/img/Inspect.svg?react";
import JSONIcon from "@/img/JSON.svg?react";
import KeyIcon from "@/img/Key.svg?react";
import KeyRoundIcon from "@/img/KeyRound.svg?react";
import KeySquareIcon from "@/img/KeySquare.svg?react";
import LabelIcon from "@/img/Label.svg?react";
import LockIcon from "@/img/Lock.svg?react";
import LogsIcon from "@/img/Logs.svg?react";
import MenuIcon from "@/img/Menu.svg?react";
import MoreHorizontalIcon from "@/img/MoreHorizontal.svg?react";
import MoreVerticalIcon from "@/img/MoreVertical.svg?react";
import MoveIcon from "@/img/Move.svg?react";
import NotebookPenIcon from "@/img/NotebookPen.svg?react";
import NotesIcon from "@/img/Notes.svg?react";
import OrchestratorIcon from "@/img/Orchestrator.svg?react";
import PauseIcon from "@/img/Pause.svg?react";
import PencilIcon from "@/img/Pencil.svg?react";
import PinIcon from "@/img/Pin.svg?react";
import PlayIcon from "@/img/Play.svg?react";
import PolylineIcon from "@/img/Polyline.svg?react";
import PuzzleIcon from "@/img/Puzzle.svg?react";
import RadioIcon from "@/img/Radio.svg?react";
import RedoIcon from "@/img/Redo.svg?react";
import RefreshIcon from "@/img/Refresh.svg?react";
import RemoveIcon from "@/img/Remove.svg?react";
import ReviewIcon from "@/img/Review.svg?react";
import SearchIcon from "@/img/Search.svg?react";
import ServerIcon from "@/img/Server.svg?react";
import SettingsIcon from "@/img/Settings.svg?react";
import ShieldCheckIcon from "@/img/ShieldCheck.svg?react";
import SliderIcon from "@/img/Slider.svg?react";
import SlidersIcon from "@/img/Sliders.svg?react";
import TagIcon from "@/img/Tag.svg?react";
import TextIcon from "@/img/Text.svg?react";
import ToggleIcon from "@/img/Toggle.svg?react";
import UndoIcon from "@/img/Undo.svg?react";
import UnfoldMoreIcon from "@/img/UnfoldMore.svg?react";
import UnlockIcon from "@/img/Unlock.svg?react";
import UnsupportedIcon from "@/img/Unsupported.svg?react";
import UploadIcon from "@/img/Upload.svg?react";
import UserIcon from "@/img/User.svg?react";
import UsersIcon from "@/img/Users.svg?react";
import UsersRoundIcon from "@/img/UsersRound.svg?react";
import VALIcon from "@/img/VAL.svg?react";
import VolumeOffIcon from "@/img/VolumeOff.svg?react";
import VolumeUpIcon from "@/img/VolumeUp.svg?react";
import WarningIcon from "@/img/Warning.svg?react";
import WaypointsIcon from "@/img/Waypoints.svg?react";
import WorkflowIcon from "@/img/Workflow.svg?react";
import WorkspacesIcon from "@/img/Workspaces.svg?react";
import ZapIcon from "@/img/Zap.svg?react";
import { type ThemeableColor, isColorToken, textColorClass } from "@/types";
import { IconName } from "@/types/icons";
import { Size } from "@/types/size";

import { type IconProps as BaseIconProps } from "./IconBase";

type SvgComponent = React.FC<React.SVGProps<SVGSVGElement>>;

/**
 * @deprecated Legacy runtime icon map (bundles all icons regardless of
 * usage). Do NOT add new icons here — add the SVG and regenerate the
 * per-icon components instead (`npm run generate-icons`).
 */
export const iconMap: Record<
  Exclude<IconName, IconName.Spinner>,
  SvgComponent
> = {
  [IconName.Activity]: ActivityIcon,
  [IconName.Add]: AddIcon,
  [IconName.AI]: AIIcon,
  [IconName.Annotate]: AnnotateIcon,
  [IconName.ArrowDown]: ArrowDownIcon,
  [IconName.ArrowLeft]: ArrowLeftIcon,
  [IconName.ArrowRight]: ArrowRightIcon,
  [IconName.ArrowUp]: ArrowUpIcon,
  [IconName.ArrowUpRight]: ArrowUpRightIcon,
  [IconName.Blocks]: BlocksIcon,
  [IconName.Boxes]: BoxesIcon,
  [IconName.CalendarClock]: CalendarClockIcon,
  [IconName.CaretDown]: CaretDownIcon,
  [IconName.Check]: CheckIcon,
  [IconName.Checkbox]: CheckboxIcon,
  [IconName.Checklist]: ChecklistIcon,
  [IconName.ChevronBottom]: ChevronBottomIcon,
  [IconName.ChevronLeft]: ChevronLeftIcon,
  [IconName.ChevronRight]: ChevronRightIcon,
  [IconName.ChevronTop]: ChevronTopIcon,
  [IconName.Circle]: CircleIcon,
  [IconName.CircleUser]: CircleUserIcon,
  [IconName.Close]: CloseIcon,
  [IconName.Cloud]: CloudIcon,
  [IconName.CloudCog]: CloudCogIcon,
  [IconName.Code]: CodeIcon,
  [IconName.Cog]: CogIcon,
  [IconName.Contact]: ContactIcon,
  [IconName.ContentCopy]: ContentCopyIcon,
  [IconName.Database]: DatabaseIcon,
  [IconName.DateRange]: DateRangeIcon,
  [IconName.Delete]: DeleteIcon,
  [IconName.Detection]: DetectionIcon,
  [IconName.Download]: DownloadIcon,
  [IconName.Drag]: DragIcon,
  [IconName.Draw]: DrawIcon,
  [IconName.Edit]: EditIcon,
  [IconName.Embeddings]: EmbeddingsIcon,
  [IconName.Enter]: EnterIcon,
  [IconName.Error]: ErrorIcon,
  [IconName.ExitWorkspace]: ExitWorkspaceIcon,
  [IconName.ExternalLink]: ExternalLinkIcon,
  [IconName.FileClock]: FileClockIcon,
  [IconName.FineTune]: FineTuneIcon,
  [IconName.Fingerprint]: FingerprintIcon,
  [IconName.Fullscreen]: FullscreenIcon,
  [IconName.GridView]: GridViewIcon,
  [IconName.History]: HistoryIcon,
  [IconName.IdCard]: IdCardIcon,
  [IconName.ImageSearch]: ImageSearchIcon,
  [IconName.Info]: InfoIcon,
  [IconName.Insights]: InsightsIcon,
  [IconName.Inspect]: InspectIcon,
  [IconName.JSON]: JSONIcon,
  [IconName.Key]: KeyIcon,
  [IconName.KeyRound]: KeyRoundIcon,
  [IconName.KeySquare]: KeySquareIcon,
  [IconName.Label]: LabelIcon,
  [IconName.Lock]: LockIcon,
  [IconName.Logs]: LogsIcon,
  [IconName.Menu]: MenuIcon,
  [IconName.MoreHorizontal]: MoreHorizontalIcon,
  [IconName.MoreVertical]: MoreVerticalIcon,
  [IconName.Move]: MoveIcon,
  [IconName.NotebookPen]: NotebookPenIcon,
  [IconName.Notes]: NotesIcon,
  [IconName.Orchestrator]: OrchestratorIcon,
  [IconName.Pause]: PauseIcon,
  [IconName.Pencil]: PencilIcon,
  [IconName.Pin]: PinIcon,
  [IconName.Play]: PlayIcon,
  [IconName.Polyline]: PolylineIcon,
  [IconName.Puzzle]: PuzzleIcon,
  [IconName.Radio]: RadioIcon,
  [IconName.Redo]: RedoIcon,
  [IconName.Refresh]: RefreshIcon,
  [IconName.Remove]: RemoveIcon,
  [IconName.Review]: ReviewIcon,
  [IconName.Search]: SearchIcon,
  [IconName.Server]: ServerIcon,
  [IconName.Settings]: SettingsIcon,
  [IconName.ShieldCheck]: ShieldCheckIcon,
  [IconName.Slider]: SliderIcon,
  [IconName.Sliders]: SlidersIcon,
  [IconName.Tag]: TagIcon,
  [IconName.Text]: TextIcon,
  [IconName.Toggle]: ToggleIcon,
  [IconName.Undo]: UndoIcon,
  [IconName.UnfoldMore]: UnfoldMoreIcon,
  [IconName.Unlock]: UnlockIcon,
  [IconName.Unsupported]: UnsupportedIcon,
  [IconName.Upload]: UploadIcon,
  [IconName.User]: UserIcon,
  [IconName.Users]: UsersIcon,
  [IconName.UsersRound]: UsersRoundIcon,
  [IconName.VAL]: VALIcon,
  [IconName.VolumeOff]: VolumeOffIcon,
  [IconName.VolumeUp]: VolumeUpIcon,
  [IconName.Warning]: WarningIcon,
  [IconName.Waypoints]: WaypointsIcon,
  [IconName.Workflow]: WorkflowIcon,
  [IconName.Workspaces]: WorkspacesIcon,
  [IconName.Zap]: ZapIcon,
};

type IconSize = Exclude<Size, "Xs">;

const sizeMap: Partial<Record<IconSize, number>> = {
  [Size.Sm]: 12,
  [Size.Md]: 14,
  [Size.Lg]: 16,
  [Size.Xl]: 18,
};

/**
 * @deprecated Props for the legacy map-based {@link Icon}. Renamed from
 * `IconProps` so the per-icon components' `IconProps` (see `IconBase`)
 * keeps that name.
 */
export interface LegacyIconProps {
  name: IconName;
  size?: Size | number;
  className?: string;
  /**
   * A theme-aware color token for anything the design system controls, or a
   * raw CSS color for anything the app controls (user-defined palettes,
   * data-driven colors) — a token can't exist for a color chosen at runtime
   * by app data, so this isn't a fallback, it's the correct tool for that
   * case.
   */
  color?: ThemeableColor | string;
  style?: React.CSSProperties;
}

/**
 * An generic icon component which will take the form of the icon specified by `name`.
 *
 * @deprecated Use the per-icon components instead (e.g. `<EditIcon />`),
 * which are tree-shakable. `Icon` and {@link IconName} exist only to bridge
 * consumers migrating from voodo <= 0.0.39 and will be removed once the
 * migration completes.
 *
 * @example
 * ```tsx
 * <Icon name={IconName.Edit} size={Size.Md} />
 * ```
 *
 * @param name Icon to display. See {@link IconName}.
 * @param size The size of the icon. Accepts a {@link Size} token, or a raw
 * pixel number for cases the token scale doesn't cover.
 * @param className `class` overrides to apply to the component.
 * @param color Color of the icon. See {@link LegacyIconProps.color}. By
 * default, the icon inherits the text color of its container.
 * @param style `style` overrides to apply to the icon.
 * @param props Additional HTML properties to apply to the component.
 */
export const Icon: FC<LegacyIconProps> = ({
  name,
  size = undefined, // if no size specified, fill the parent container
  className,
  color,
  style,
  ...props
}) => {
  // We are making a strong opinion here that we should treat the SVG
  // as a square - the viewbox on the SVG will still handle the aspect
  // ratio but it's possible that VERY rectangular SVGs will not behave
  // as expected.
  const iconSize = typeof size === "number" ? size : size ? sizeMap[size] : undefined;
  const IconComponent = name === IconName.Spinner ? Spinner : iconMap[name];
  const isToken = color !== undefined && isColorToken(color);

  return (
    <IconComponent
      width={iconSize}
      height={iconSize}
      size={typeof size === "number" ? undefined : size}
      className={clsx(isToken && textColorClass(color), className)}
      style={color && !isToken ? { color, ...style } : style}
      {...props}
    />
  );
};

/**
 * Accepted value for component icon props while the legacy icon API is
 * bridged: a per-icon component (preferred) or a legacy {@link IconName}.
 * The IconName form is deprecated and will be removed with the legacy API,
 * at which point icon props return to plain `FC<IconProps>`.
 */
export type IconInput = FC<BaseIconProps> | IconName;

// Cached per IconName so repeated resolutions return the same component
// identity — a fresh wrapper each render would change the element type and
// remount the icon subtree on every parent re-render.
const legacyIconCache = new Map<IconName, FC<BaseIconProps>>();

/**
 * Resolves an {@link IconInput} to a renderable icon component, rendering
 * legacy {@link IconName} values through the deprecated map-based
 * {@link Icon}.
 */
export function resolveIconInput(
  icon?: IconInput
): FC<BaseIconProps> | undefined {
  if (typeof icon === "string") {
    let component = legacyIconCache.get(icon);
    if (!component) {
      component = (props) => <Icon name={icon} {...props} />;
      legacyIconCache.set(icon, component);
    }
    return component;
  }

  return icon;
}
