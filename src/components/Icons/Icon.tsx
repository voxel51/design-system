import clsx from "clsx";
import React, { type FC } from "react";

import { Spinner } from "@/components/Spinner";
import AIIcon from "@/img/AI.svg?react";
import AccessTimeIcon from "@/img/AccessTime.svg?react";
import AccountTreeIcon from "@/img/AccountTree.svg?react";
import AddIcon from "@/img/Add.svg?react";
import AddBoxIcon from "@/img/AddBox.svg?react";
import AddLinkIcon from "@/img/AddLink.svg?react";
import AltRouteIcon from "@/img/AltRoute.svg?react";
import AnnotateIcon from "@/img/Annotate.svg?react";
import AppsIcon from "@/img/Apps.svg?react";
import ArchiveIcon from "@/img/Archive.svg?react";
import ArchiveOutlinedIcon from "@/img/ArchiveOutlined.svg?react";
import ArrowBackIcon from "@/img/ArrowBack.svg?react";
import ArrowCircleDownIcon from "@/img/ArrowCircleDown.svg?react";
import ArrowCircleLeftOutlinedIcon from "@/img/ArrowCircleLeftOutlined.svg?react";
import ArrowDownIcon from "@/img/ArrowDown.svg?react";
import ArrowDownwardIcon from "@/img/ArrowDownward.svg?react";
import ArrowDropDownIcon from "@/img/ArrowDropDown.svg?react";
import ArrowDropUpIcon from "@/img/ArrowDropUp.svg?react";
import ArrowForwardIosIcon from "@/img/ArrowForwardIos.svg?react";
import ArrowForwardIosSharpIcon from "@/img/ArrowForwardIosSharp.svg?react";
import ArrowLeftIcon from "@/img/ArrowLeft.svg?react";
import ArrowOutwardIcon from "@/img/ArrowOutward.svg?react";
import ArrowRightIcon from "@/img/ArrowRight.svg?react";
import ArrowUpIcon from "@/img/ArrowUp.svg?react";
import ArrowUpRightIcon from "@/img/ArrowUpRight.svg?react";
import ArrowUpwardIcon from "@/img/ArrowUpward.svg?react";
import ArticleOutlinedIcon from "@/img/ArticleOutlined.svg?react";
import AssignmentIcon from "@/img/Assignment.svg?react";
import AssignmentOutlinedIcon from "@/img/AssignmentOutlined.svg?react";
import AutoAwesomeIcon from "@/img/AutoAwesome.svg?react";
import AutoAwesomeMosaicOutlinedIcon from "@/img/AutoAwesomeMosaicOutlined.svg?react";
import AutoLabelIcon from "@/img/AutoLabel.svg?react";
import AutoLabelGradientIcon from "@/img/AutoLabelGradient.svg?react";
import AutorenewIcon from "@/img/Autorenew.svg?react";
import BarChartIcon from "@/img/BarChart.svg?react";
import BoltIcon from "@/img/Bolt.svg?react";
import BookmarkIcon from "@/img/Bookmark.svg?react";
import BrushIcon from "@/img/Brush.svg?react";
import BubbleChartIcon from "@/img/BubbleChart.svg?react";
import CachedOutlinedIcon from "@/img/CachedOutlined.svg?react";
import CallMergeIcon from "@/img/CallMerge.svg?react";
import CallSplitIcon from "@/img/CallSplit.svg?react";
import CallSplitOutlinedIcon from "@/img/CallSplitOutlined.svg?react";
import CancelIcon from "@/img/Cancel.svg?react";
import CancelOutlinedIcon from "@/img/CancelOutlined.svg?react";
import CaretDownIcon from "@/img/CaretDown.svg?react";
import CasinoIcon from "@/img/Casino.svg?react";
import CenterFocusWeakIcon from "@/img/CenterFocusWeak.svg?react";
import ChatBubbleOutlineRoundedIcon from "@/img/ChatBubbleOutlineRounded.svg?react";
import CheckIcon from "@/img/Check.svg?react";
import CheckBoxOutlineBlankIcon from "@/img/CheckBoxOutlineBlank.svg?react";
import CheckCircleIcon from "@/img/CheckCircle.svg?react";
import CheckCircleOutlineIcon from "@/img/CheckCircleOutline.svg?react";
import CheckOutlinedIcon from "@/img/CheckOutlined.svg?react";
import CheckboxIcon from "@/img/Checkbox.svg?react";
import ChecklistIcon from "@/img/Checklist.svg?react";
import ChevronBottomIcon from "@/img/ChevronBottom.svg?react";
import ChevronLeftIcon from "@/img/ChevronLeft.svg?react";
import ChevronRightIcon from "@/img/ChevronRight.svg?react";
import ChevronTopIcon from "@/img/ChevronTop.svg?react";
import CircleIcon from "@/img/Circle.svg?react";
import CircleOutlinedIcon from "@/img/CircleOutlined.svg?react";
import ClearIcon from "@/img/Clear.svg?react";
import ClearAllIcon from "@/img/ClearAll.svg?react";
import ClearOutlinedIcon from "@/img/ClearOutlined.svg?react";
import CloseIcon from "@/img/Close.svg?react";
import CloseOutlinedIcon from "@/img/CloseOutlined.svg?react";
import CloseRoundedIcon from "@/img/CloseRounded.svg?react";
import CloseTwoToneIcon from "@/img/CloseTwoTone.svg?react";
import CloudOutlinedIcon from "@/img/CloudOutlined.svg?react";
import CloudUploadIcon from "@/img/CloudUpload.svg?react";
import CodeIcon from "@/img/Code.svg?react";
import CodeOutlinedIcon from "@/img/CodeOutlined.svg?react";
import ColorLensIcon from "@/img/ColorLens.svg?react";
import ContentCopyIcon from "@/img/ContentCopy.svg?react";
import ContentCopyOutlinedIcon from "@/img/ContentCopyOutlined.svg?react";
import CopyAllOutlinedIcon from "@/img/CopyAllOutlined.svg?react";
import CorporateFareIcon from "@/img/CorporateFare.svg?react";
import CrisisAlertOutlinedIcon from "@/img/CrisisAlertOutlined.svg?react";
import CropSquareIcon from "@/img/CropSquare.svg?react";
import DarkModeIcon from "@/img/DarkMode.svg?react";
import DataObjectIcon from "@/img/DataObject.svg?react";
import DateRangeIcon from "@/img/DateRange.svg?react";
import DeleteIcon from "@/img/Delete.svg?react";
import DeleteOutlineIcon from "@/img/DeleteOutline.svg?react";
import DeleteOutlineOutlinedIcon from "@/img/DeleteOutlineOutlined.svg?react";
import DeleteOutlinedIcon from "@/img/DeleteOutlined.svg?react";
import DesktopWindowsOutlinedIcon from "@/img/DesktopWindowsOutlined.svg?react";
import DetectionIcon from "@/img/Detection.svg?react";
import DisplaySettingsIcon from "@/img/DisplaySettings.svg?react";
import DoneIcon from "@/img/Done.svg?react";
import DoneOutlinedIcon from "@/img/DoneOutlined.svg?react";
import DownloadIcon from "@/img/Download.svg?react";
import DownloadOutlinedIcon from "@/img/DownloadOutlined.svg?react";
import DragIcon from "@/img/Drag.svg?react";
import DragHandleIcon from "@/img/DragHandle.svg?react";
import DragIndicatorIcon from "@/img/DragIndicator.svg?react";
import DrawIcon from "@/img/Draw.svg?react";
import EditIcon from "@/img/Edit.svg?react";
import EditNoteIcon from "@/img/EditNote.svg?react";
import EditOutlinedIcon from "@/img/EditOutlined.svg?react";
import EmailOutlinedIcon from "@/img/EmailOutlined.svg?react";
import EmbeddingsIcon from "@/img/Embeddings.svg?react";
import EnterIcon from "@/img/Enter.svg?react";
import ErrorIcon from "@/img/Error.svg?react";
import ErrorOutlineIcon from "@/img/ErrorOutline.svg?react";
import ErrorOutlineOutlinedIcon from "@/img/ErrorOutlineOutlined.svg?react";
import ExitWorkspaceIcon from "@/img/ExitWorkspace.svg?react";
import ExpandLessIcon from "@/img/ExpandLess.svg?react";
import ExpandMoreIcon from "@/img/ExpandMore.svg?react";
import ExtensionIcon from "@/img/Extension.svg?react";
import ExternalLinkIcon from "@/img/ExternalLink.svg?react";
import FactCheckIcon from "@/img/FactCheck.svg?react";
import FeedbackIcon from "@/img/Feedback.svg?react";
import FiberManualRecordIcon from "@/img/FiberManualRecord.svg?react";
import FileCopyIcon from "@/img/FileCopy.svg?react";
import FileDownloadOutlinedIcon from "@/img/FileDownloadOutlined.svg?react";
import FileUploadOutlinedIcon from "@/img/FileUploadOutlined.svg?react";
import FilterAltIcon from "@/img/FilterAlt.svg?react";
import FilterAltOffIcon from "@/img/FilterAltOff.svg?react";
import FilterDramaIcon from "@/img/FilterDrama.svg?react";
import FilterListIcon from "@/img/FilterList.svg?react";
import FineTuneIcon from "@/img/FineTune.svg?react";
import FitScreenIcon from "@/img/FitScreen.svg?react";
import FlipToBackIcon from "@/img/FlipToBack.svg?react";
import FolderIcon from "@/img/Folder.svg?react";
import FolderOffIcon from "@/img/FolderOff.svg?react";
import FolderOpenIcon from "@/img/FolderOpen.svg?react";
import FullscreenIcon from "@/img/Fullscreen.svg?react";
import FullscreenExitIcon from "@/img/FullscreenExit.svg?react";
import GridOnIcon from "@/img/GridOn.svg?react";
import GridViewIcon from "@/img/GridView.svg?react";
import GroupAddIcon from "@/img/GroupAdd.svg?react";
import GroupAddOutlinedIcon from "@/img/GroupAddOutlined.svg?react";
import HelpIcon from "@/img/Help.svg?react";
import HideImageIcon from "@/img/HideImage.svg?react";
import HighlightAltIcon from "@/img/HighlightAlt.svg?react";
import HistoryIcon from "@/img/History.svg?react";
import HowToVoteIcon from "@/img/HowToVote.svg?react";
import HubIcon from "@/img/Hub.svg?react";
import HubOutlinedIcon from "@/img/HubOutlined.svg?react";
import ImageIcon from "@/img/Image.svg?react";
import ImageAspectRatioIcon from "@/img/ImageAspectRatio.svg?react";
import ImageSearchIcon from "@/img/ImageSearch.svg?react";
import InfoIcon from "@/img/Info.svg?react";
import InfoOutlinedIcon from "@/img/InfoOutlined.svg?react";
import InputIcon from "@/img/Input.svg?react";
import InsertChartOutlinedIcon from "@/img/InsertChartOutlined.svg?react";
import InsertDriveFileIcon from "@/img/InsertDriveFile.svg?react";
import InsightsIcon from "@/img/Insights.svg?react";
import InspectIcon from "@/img/Inspect.svg?react";
import Inventory2Icon from "@/img/Inventory2.svg?react";
import Inventory2OutlinedIcon from "@/img/Inventory2Outlined.svg?react";
import JSONIcon from "@/img/JSON.svg?react";
import KeyboardArrowDownIcon from "@/img/KeyboardArrowDown.svg?react";
import KeyboardArrowDownOutlinedIcon from "@/img/KeyboardArrowDownOutlined.svg?react";
import KeyboardArrowLeftIcon from "@/img/KeyboardArrowLeft.svg?react";
import KeyboardArrowRightIcon from "@/img/KeyboardArrowRight.svg?react";
import KeyboardArrowUpIcon from "@/img/KeyboardArrowUp.svg?react";
import KeyboardArrowUpOutlinedIcon from "@/img/KeyboardArrowUpOutlined.svg?react";
import KeyboardBackspaceIcon from "@/img/KeyboardBackspace.svg?react";
import KeyboardDoubleArrowLeftIcon from "@/img/KeyboardDoubleArrowLeft.svg?react";
import KeyboardDoubleArrowRightIcon from "@/img/KeyboardDoubleArrowRight.svg?react";
import LabelIcon from "@/img/Label.svg?react";
import LabelImportantIcon from "@/img/LabelImportant.svg?react";
import LabelOutlinedIcon from "@/img/LabelOutlined.svg?react";
import LaunchIcon from "@/img/Launch.svg?react";
import LayersIcon from "@/img/Layers.svg?react";
import LibraryAddIcon from "@/img/LibraryAdd.svg?react";
import LightModeIcon from "@/img/LightMode.svg?react";
import LightbulbIcon from "@/img/Lightbulb.svg?react";
import ListIcon from "@/img/List.svg?react";
import LocalOfferIcon from "@/img/LocalOffer.svg?react";
import LocalOfferOutlinedIcon from "@/img/LocalOfferOutlined.svg?react";
import LockIcon from "@/img/Lock.svg?react";
import LockOpenOutlinedIcon from "@/img/LockOpenOutlined.svg?react";
import LockOutlinedIcon from "@/img/LockOutlined.svg?react";
import LogoutIcon from "@/img/Logout.svg?react";
import LogsIcon from "@/img/Logs.svg?react";
import MailOutlineIcon from "@/img/MailOutline.svg?react";
import MapIcon from "@/img/Map.svg?react";
import MenuIcon from "@/img/Menu.svg?react";
import MoreHorizIcon from "@/img/MoreHoriz.svg?react";
import MoreHorizontalIcon from "@/img/MoreHorizontal.svg?react";
import MoreVertIcon from "@/img/MoreVert.svg?react";
import MoreVerticalIcon from "@/img/MoreVertical.svg?react";
import MoveIcon from "@/img/Move.svg?react";
import NotesIcon from "@/img/Notes.svg?react";
import NotificationsActiveIcon from "@/img/NotificationsActive.svg?react";
import OpenInNewIcon from "@/img/OpenInNew.svg?react";
import OpenWithIcon from "@/img/OpenWith.svg?react";
import OrchestratorIcon from "@/img/Orchestrator.svg?react";
import PaletteIcon from "@/img/Palette.svg?react";
import PencilIcon from "@/img/Pencil.svg?react";
import PercentIcon from "@/img/Percent.svg?react";
import PersonAddAltIcon from "@/img/PersonAddAlt.svg?react";
import PersonAddOutlinedIcon from "@/img/PersonAddOutlined.svg?react";
import PhotoCameraIcon from "@/img/PhotoCamera.svg?react";
import PieChartOutlinedIcon from "@/img/PieChartOutlined.svg?react";
import PinIcon from "@/img/Pin.svg?react";
import PlayArrowIcon from "@/img/PlayArrow.svg?react";
import PolylineIcon from "@/img/Polyline.svg?react";
import PsychologyIcon from "@/img/Psychology.svg?react";
import QuestionMarkIcon from "@/img/QuestionMark.svg?react";
import RadioIcon from "@/img/Radio.svg?react";
import RectangleIcon from "@/img/Rectangle.svg?react";
import RedoIcon from "@/img/Redo.svg?react";
import RefreshIcon from "@/img/Refresh.svg?react";
import RemoveIcon from "@/img/Remove.svg?react";
import RemoveCircleOutlineIcon from "@/img/RemoveCircleOutline.svg?react";
import ReplayIcon from "@/img/Replay.svg?react";
import ReportProblemIcon from "@/img/ReportProblem.svg?react";
import RestartAltIcon from "@/img/RestartAlt.svg?react";
import RestartAltOutlinedIcon from "@/img/RestartAltOutlined.svg?react";
import ReviewIcon from "@/img/Review.svg?react";
import RocketLaunchIcon from "@/img/RocketLaunch.svg?react";
import RuleIcon from "@/img/Rule.svg?react";
import RuleFolderIcon from "@/img/RuleFolder.svg?react";
import SaveIcon from "@/img/Save.svg?react";
import SaveOutlinedIcon from "@/img/SaveOutlined.svg?react";
import ScatterPlotIcon from "@/img/ScatterPlot.svg?react";
import SchoolIcon from "@/img/School.svg?react";
import SearchIcon from "@/img/Search.svg?react";
import SearchOutlinedIcon from "@/img/SearchOutlined.svg?react";
import SellIcon from "@/img/Sell.svg?react";
import SettingsIcon from "@/img/Settings.svg?react";
import SettingsBackupRestoreIcon from "@/img/SettingsBackupRestore.svg?react";
import SettingsInputCompositeRoundedIcon from "@/img/SettingsInputCompositeRounded.svg?react";
import SettingsOutlinedIcon from "@/img/SettingsOutlined.svg?react";
import SettingsSystemDaydreamOutlinedIcon from "@/img/SettingsSystemDaydreamOutlined.svg?react";
import ShowChartOutlinedIcon from "@/img/ShowChartOutlined.svg?react";
import ShuffleIcon from "@/img/Shuffle.svg?react";
import SkipNextIcon from "@/img/SkipNext.svg?react";
import SliderIcon from "@/img/Slider.svg?react";
import SlidersIcon from "@/img/Sliders.svg?react";
import SmartToyIcon from "@/img/SmartToy.svg?react";
import SpeedIcon from "@/img/Speed.svg?react";
import SplitscreenIcon from "@/img/Splitscreen.svg?react";
import StopCircleOutlinedIcon from "@/img/StopCircleOutlined.svg?react";
import StorageIcon from "@/img/Storage.svg?react";
import StraightenIcon from "@/img/Straighten.svg?react";
import SubdirectoryArrowRightIcon from "@/img/SubdirectoryArrowRight.svg?react";
import SubjectIcon from "@/img/Subject.svg?react";
import SupportOutlinedIcon from "@/img/SupportOutlined.svg?react";
import SyncIcon from "@/img/Sync.svg?react";
import TableChartOutlinedIcon from "@/img/TableChartOutlined.svg?react";
import TagIcon from "@/img/Tag.svg?react";
import TextIcon from "@/img/Text.svg?react";
import TextureIcon from "@/img/Texture.svg?react";
import ThreeSixtyIcon from "@/img/ThreeSixty.svg?react";
import TimelineIcon from "@/img/Timeline.svg?react";
import TimelineOutlinedIcon from "@/img/TimelineOutlined.svg?react";
import TimerIcon from "@/img/Timer.svg?react";
import TimerOffIcon from "@/img/TimerOff.svg?react";
import ToggleIcon from "@/img/Toggle.svg?react";
import TrackChangesIcon from "@/img/TrackChanges.svg?react";
import TuneIcon from "@/img/Tune.svg?react";
import UnarchiveOutlinedIcon from "@/img/UnarchiveOutlined.svg?react";
import UndoIcon from "@/img/Undo.svg?react";
import UnfoldMoreIcon from "@/img/UnfoldMore.svg?react";
import UnlockIcon from "@/img/Unlock.svg?react";
import UnsupportedIcon from "@/img/Unsupported.svg?react";
import UpgradeOutlinedIcon from "@/img/UpgradeOutlined.svg?react";
import UploadIcon from "@/img/Upload.svg?react";
import VALIcon from "@/img/VAL.svg?react";
import VerticalAlignTopIcon from "@/img/VerticalAlignTop.svg?react";
import VideocamIcon from "@/img/Videocam.svg?react";
import ViewComfyIcon from "@/img/ViewComfy.svg?react";
import ViewInArIcon from "@/img/ViewInAr.svg?react";
import VisibilityIcon from "@/img/Visibility.svg?react";
import VisibilityOffIcon from "@/img/VisibilityOff.svg?react";
import VisibilityOffOutlinedIcon from "@/img/VisibilityOffOutlined.svg?react";
import VisibilityOutlinedIcon from "@/img/VisibilityOutlined.svg?react";
import WallpaperIcon from "@/img/Wallpaper.svg?react";
import WarningIcon from "@/img/Warning.svg?react";
import WarningAmberIcon from "@/img/WarningAmber.svg?react";
import WebhookIcon from "@/img/Webhook.svg?react";
import WestIcon from "@/img/West.svg?react";
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
  [IconName.AccessTime]: AccessTimeIcon,
  [IconName.AccountTree]: AccountTreeIcon,
  [IconName.Add]: AddIcon,
  [IconName.AddBox]: AddBoxIcon,
  [IconName.AddLink]: AddLinkIcon,
  [IconName.AI]: AIIcon,
  [IconName.AltRoute]: AltRouteIcon,
  [IconName.Annotate]: AnnotateIcon,
  [IconName.Apps]: AppsIcon,
  [IconName.Archive]: ArchiveIcon,
  [IconName.ArchiveOutlined]: ArchiveOutlinedIcon,
  [IconName.ArrowBack]: ArrowBackIcon,
  [IconName.ArrowCircleDown]: ArrowCircleDownIcon,
  [IconName.ArrowCircleLeftOutlined]: ArrowCircleLeftOutlinedIcon,
  [IconName.ArrowDown]: ArrowDownIcon,
  [IconName.ArrowDownward]: ArrowDownwardIcon,
  [IconName.ArrowDropDown]: ArrowDropDownIcon,
  [IconName.ArrowDropUp]: ArrowDropUpIcon,
  [IconName.ArrowForwardIos]: ArrowForwardIosIcon,
  [IconName.ArrowForwardIosSharp]: ArrowForwardIosSharpIcon,
  [IconName.ArrowLeft]: ArrowLeftIcon,
  [IconName.ArrowOutward]: ArrowOutwardIcon,
  [IconName.ArrowRight]: ArrowRightIcon,
  [IconName.ArrowUp]: ArrowUpIcon,
  [IconName.ArrowUpRight]: ArrowUpRightIcon,
  [IconName.ArrowUpward]: ArrowUpwardIcon,
  [IconName.ArticleOutlined]: ArticleOutlinedIcon,
  [IconName.Assignment]: AssignmentIcon,
  [IconName.AssignmentOutlined]: AssignmentOutlinedIcon,
  [IconName.AutoAwesome]: AutoAwesomeIcon,
  [IconName.AutoAwesomeMosaicOutlined]: AutoAwesomeMosaicOutlinedIcon,
  [IconName.AutoLabel]: AutoLabelIcon,
  [IconName.AutoLabelGradient]: AutoLabelGradientIcon,
  [IconName.Autorenew]: AutorenewIcon,
  [IconName.BarChart]: BarChartIcon,
  [IconName.Bolt]: BoltIcon,
  [IconName.Bookmark]: BookmarkIcon,
  [IconName.Brush]: BrushIcon,
  [IconName.BubbleChart]: BubbleChartIcon,
  [IconName.CachedOutlined]: CachedOutlinedIcon,
  [IconName.CallMerge]: CallMergeIcon,
  [IconName.CallSplit]: CallSplitIcon,
  [IconName.CallSplitOutlined]: CallSplitOutlinedIcon,
  [IconName.Cancel]: CancelIcon,
  [IconName.CancelOutlined]: CancelOutlinedIcon,
  [IconName.CaretDown]: CaretDownIcon,
  [IconName.Casino]: CasinoIcon,
  [IconName.CenterFocusWeak]: CenterFocusWeakIcon,
  [IconName.ChatBubbleOutlineRounded]: ChatBubbleOutlineRoundedIcon,
  [IconName.Check]: CheckIcon,
  [IconName.Checkbox]: CheckboxIcon,
  [IconName.CheckBoxOutlineBlank]: CheckBoxOutlineBlankIcon,
  [IconName.CheckCircle]: CheckCircleIcon,
  [IconName.CheckCircleOutline]: CheckCircleOutlineIcon,
  [IconName.Checklist]: ChecklistIcon,
  [IconName.CheckOutlined]: CheckOutlinedIcon,
  [IconName.ChevronBottom]: ChevronBottomIcon,
  [IconName.ChevronLeft]: ChevronLeftIcon,
  [IconName.ChevronRight]: ChevronRightIcon,
  [IconName.ChevronTop]: ChevronTopIcon,
  [IconName.Circle]: CircleIcon,
  [IconName.CircleOutlined]: CircleOutlinedIcon,
  [IconName.Clear]: ClearIcon,
  [IconName.ClearAll]: ClearAllIcon,
  [IconName.ClearOutlined]: ClearOutlinedIcon,
  [IconName.Close]: CloseIcon,
  [IconName.CloseOutlined]: CloseOutlinedIcon,
  [IconName.CloseRounded]: CloseRoundedIcon,
  [IconName.CloseTwoTone]: CloseTwoToneIcon,
  [IconName.CloudOutlined]: CloudOutlinedIcon,
  [IconName.CloudUpload]: CloudUploadIcon,
  [IconName.Code]: CodeIcon,
  [IconName.CodeOutlined]: CodeOutlinedIcon,
  [IconName.ColorLens]: ColorLensIcon,
  [IconName.ContentCopy]: ContentCopyIcon,
  [IconName.ContentCopyOutlined]: ContentCopyOutlinedIcon,
  [IconName.CopyAllOutlined]: CopyAllOutlinedIcon,
  [IconName.CorporateFare]: CorporateFareIcon,
  [IconName.CrisisAlertOutlined]: CrisisAlertOutlinedIcon,
  [IconName.CropSquare]: CropSquareIcon,
  [IconName.DarkMode]: DarkModeIcon,
  [IconName.DataObject]: DataObjectIcon,
  [IconName.DateRange]: DateRangeIcon,
  [IconName.Delete]: DeleteIcon,
  [IconName.DeleteOutline]: DeleteOutlineIcon,
  [IconName.DeleteOutlined]: DeleteOutlinedIcon,
  [IconName.DeleteOutlineOutlined]: DeleteOutlineOutlinedIcon,
  [IconName.DesktopWindowsOutlined]: DesktopWindowsOutlinedIcon,
  [IconName.Detection]: DetectionIcon,
  [IconName.DisplaySettings]: DisplaySettingsIcon,
  [IconName.Done]: DoneIcon,
  [IconName.DoneOutlined]: DoneOutlinedIcon,
  [IconName.Download]: DownloadIcon,
  [IconName.DownloadOutlined]: DownloadOutlinedIcon,
  [IconName.Drag]: DragIcon,
  [IconName.DragHandle]: DragHandleIcon,
  [IconName.DragIndicator]: DragIndicatorIcon,
  [IconName.Draw]: DrawIcon,
  [IconName.Edit]: EditIcon,
  [IconName.EditNote]: EditNoteIcon,
  [IconName.EditOutlined]: EditOutlinedIcon,
  [IconName.EmailOutlined]: EmailOutlinedIcon,
  [IconName.Embeddings]: EmbeddingsIcon,
  [IconName.Enter]: EnterIcon,
  [IconName.Error]: ErrorIcon,
  [IconName.ErrorOutline]: ErrorOutlineIcon,
  [IconName.ErrorOutlineOutlined]: ErrorOutlineOutlinedIcon,
  [IconName.ExitWorkspace]: ExitWorkspaceIcon,
  [IconName.ExpandLess]: ExpandLessIcon,
  [IconName.ExpandMore]: ExpandMoreIcon,
  [IconName.Extension]: ExtensionIcon,
  [IconName.ExternalLink]: ExternalLinkIcon,
  [IconName.FactCheck]: FactCheckIcon,
  [IconName.Feedback]: FeedbackIcon,
  [IconName.FiberManualRecord]: FiberManualRecordIcon,
  [IconName.FileCopy]: FileCopyIcon,
  [IconName.FileDownloadOutlined]: FileDownloadOutlinedIcon,
  [IconName.FileUploadOutlined]: FileUploadOutlinedIcon,
  [IconName.FilterAlt]: FilterAltIcon,
  [IconName.FilterAltOff]: FilterAltOffIcon,
  [IconName.FilterDrama]: FilterDramaIcon,
  [IconName.FilterList]: FilterListIcon,
  [IconName.FineTune]: FineTuneIcon,
  [IconName.FitScreen]: FitScreenIcon,
  [IconName.FlipToBack]: FlipToBackIcon,
  [IconName.Folder]: FolderIcon,
  [IconName.FolderOff]: FolderOffIcon,
  [IconName.FolderOpen]: FolderOpenIcon,
  [IconName.Fullscreen]: FullscreenIcon,
  [IconName.FullscreenExit]: FullscreenExitIcon,
  [IconName.GridOn]: GridOnIcon,
  [IconName.GridView]: GridViewIcon,
  [IconName.GroupAdd]: GroupAddIcon,
  [IconName.GroupAddOutlined]: GroupAddOutlinedIcon,
  [IconName.Help]: HelpIcon,
  [IconName.HideImage]: HideImageIcon,
  [IconName.HighlightAlt]: HighlightAltIcon,
  [IconName.History]: HistoryIcon,
  [IconName.HowToVote]: HowToVoteIcon,
  [IconName.Hub]: HubIcon,
  [IconName.HubOutlined]: HubOutlinedIcon,
  [IconName.Image]: ImageIcon,
  [IconName.ImageAspectRatio]: ImageAspectRatioIcon,
  [IconName.ImageSearch]: ImageSearchIcon,
  [IconName.Info]: InfoIcon,
  [IconName.InfoOutlined]: InfoOutlinedIcon,
  [IconName.Input]: InputIcon,
  [IconName.InsertChartOutlined]: InsertChartOutlinedIcon,
  [IconName.InsertDriveFile]: InsertDriveFileIcon,
  [IconName.Insights]: InsightsIcon,
  [IconName.Inspect]: InspectIcon,
  [IconName.Inventory2]: Inventory2Icon,
  [IconName.Inventory2Outlined]: Inventory2OutlinedIcon,
  [IconName.JSON]: JSONIcon,
  [IconName.KeyboardArrowDown]: KeyboardArrowDownIcon,
  [IconName.KeyboardArrowDownOutlined]: KeyboardArrowDownOutlinedIcon,
  [IconName.KeyboardArrowLeft]: KeyboardArrowLeftIcon,
  [IconName.KeyboardArrowRight]: KeyboardArrowRightIcon,
  [IconName.KeyboardArrowUp]: KeyboardArrowUpIcon,
  [IconName.KeyboardArrowUpOutlined]: KeyboardArrowUpOutlinedIcon,
  [IconName.KeyboardBackspace]: KeyboardBackspaceIcon,
  [IconName.KeyboardDoubleArrowLeft]: KeyboardDoubleArrowLeftIcon,
  [IconName.KeyboardDoubleArrowRight]: KeyboardDoubleArrowRightIcon,
  [IconName.Label]: LabelIcon,
  [IconName.LabelImportant]: LabelImportantIcon,
  [IconName.LabelOutlined]: LabelOutlinedIcon,
  [IconName.Launch]: LaunchIcon,
  [IconName.Layers]: LayersIcon,
  [IconName.LibraryAdd]: LibraryAddIcon,
  [IconName.Lightbulb]: LightbulbIcon,
  [IconName.LightMode]: LightModeIcon,
  [IconName.List]: ListIcon,
  [IconName.LocalOffer]: LocalOfferIcon,
  [IconName.LocalOfferOutlined]: LocalOfferOutlinedIcon,
  [IconName.Lock]: LockIcon,
  [IconName.LockOpenOutlined]: LockOpenOutlinedIcon,
  [IconName.LockOutlined]: LockOutlinedIcon,
  [IconName.Logout]: LogoutIcon,
  [IconName.Logs]: LogsIcon,
  [IconName.MailOutline]: MailOutlineIcon,
  [IconName.Map]: MapIcon,
  [IconName.Menu]: MenuIcon,
  [IconName.MoreHoriz]: MoreHorizIcon,
  [IconName.MoreHorizontal]: MoreHorizontalIcon,
  [IconName.MoreVert]: MoreVertIcon,
  [IconName.MoreVertical]: MoreVerticalIcon,
  [IconName.Move]: MoveIcon,
  [IconName.Notes]: NotesIcon,
  [IconName.NotificationsActive]: NotificationsActiveIcon,
  [IconName.OpenInNew]: OpenInNewIcon,
  [IconName.OpenWith]: OpenWithIcon,
  [IconName.Orchestrator]: OrchestratorIcon,
  [IconName.Palette]: PaletteIcon,
  [IconName.Pencil]: PencilIcon,
  [IconName.Percent]: PercentIcon,
  [IconName.PersonAddAlt]: PersonAddAltIcon,
  [IconName.PersonAddOutlined]: PersonAddOutlinedIcon,
  [IconName.PhotoCamera]: PhotoCameraIcon,
  [IconName.PieChartOutlined]: PieChartOutlinedIcon,
  [IconName.Pin]: PinIcon,
  [IconName.PlayArrow]: PlayArrowIcon,
  [IconName.Polyline]: PolylineIcon,
  [IconName.Psychology]: PsychologyIcon,
  [IconName.QuestionMark]: QuestionMarkIcon,
  [IconName.Radio]: RadioIcon,
  [IconName.Rectangle]: RectangleIcon,
  [IconName.Redo]: RedoIcon,
  [IconName.Refresh]: RefreshIcon,
  [IconName.Remove]: RemoveIcon,
  [IconName.RemoveCircleOutline]: RemoveCircleOutlineIcon,
  [IconName.Replay]: ReplayIcon,
  [IconName.ReportProblem]: ReportProblemIcon,
  [IconName.RestartAlt]: RestartAltIcon,
  [IconName.RestartAltOutlined]: RestartAltOutlinedIcon,
  [IconName.Review]: ReviewIcon,
  [IconName.RocketLaunch]: RocketLaunchIcon,
  [IconName.Rule]: RuleIcon,
  [IconName.RuleFolder]: RuleFolderIcon,
  [IconName.Save]: SaveIcon,
  [IconName.SaveOutlined]: SaveOutlinedIcon,
  [IconName.ScatterPlot]: ScatterPlotIcon,
  [IconName.School]: SchoolIcon,
  [IconName.Search]: SearchIcon,
  [IconName.SearchOutlined]: SearchOutlinedIcon,
  [IconName.Sell]: SellIcon,
  [IconName.Settings]: SettingsIcon,
  [IconName.SettingsBackupRestore]: SettingsBackupRestoreIcon,
  [IconName.SettingsInputCompositeRounded]: SettingsInputCompositeRoundedIcon,
  [IconName.SettingsOutlined]: SettingsOutlinedIcon,
  [IconName.SettingsSystemDaydreamOutlined]: SettingsSystemDaydreamOutlinedIcon,
  [IconName.ShowChartOutlined]: ShowChartOutlinedIcon,
  [IconName.Shuffle]: ShuffleIcon,
  [IconName.SkipNext]: SkipNextIcon,
  [IconName.Slider]: SliderIcon,
  [IconName.Sliders]: SlidersIcon,
  [IconName.SmartToy]: SmartToyIcon,
  [IconName.Speed]: SpeedIcon,
  [IconName.Splitscreen]: SplitscreenIcon,
  [IconName.StopCircleOutlined]: StopCircleOutlinedIcon,
  [IconName.Storage]: StorageIcon,
  [IconName.Straighten]: StraightenIcon,
  [IconName.SubdirectoryArrowRight]: SubdirectoryArrowRightIcon,
  [IconName.Subject]: SubjectIcon,
  [IconName.SupportOutlined]: SupportOutlinedIcon,
  [IconName.Sync]: SyncIcon,
  [IconName.TableChartOutlined]: TableChartOutlinedIcon,
  [IconName.Tag]: TagIcon,
  [IconName.Text]: TextIcon,
  [IconName.Texture]: TextureIcon,
  [IconName.ThreeSixty]: ThreeSixtyIcon,
  [IconName.Timeline]: TimelineIcon,
  [IconName.TimelineOutlined]: TimelineOutlinedIcon,
  [IconName.Timer]: TimerIcon,
  [IconName.TimerOff]: TimerOffIcon,
  [IconName.Toggle]: ToggleIcon,
  [IconName.TrackChanges]: TrackChangesIcon,
  [IconName.Tune]: TuneIcon,
  [IconName.UnarchiveOutlined]: UnarchiveOutlinedIcon,
  [IconName.Undo]: UndoIcon,
  [IconName.UnfoldMore]: UnfoldMoreIcon,
  [IconName.Unlock]: UnlockIcon,
  [IconName.Unsupported]: UnsupportedIcon,
  [IconName.UpgradeOutlined]: UpgradeOutlinedIcon,
  [IconName.Upload]: UploadIcon,
  [IconName.VAL]: VALIcon,
  [IconName.VerticalAlignTop]: VerticalAlignTopIcon,
  [IconName.Videocam]: VideocamIcon,
  [IconName.ViewComfy]: ViewComfyIcon,
  [IconName.ViewInAr]: ViewInArIcon,
  [IconName.Visibility]: VisibilityIcon,
  [IconName.VisibilityOff]: VisibilityOffIcon,
  [IconName.VisibilityOffOutlined]: VisibilityOffOutlinedIcon,
  [IconName.VisibilityOutlined]: VisibilityOutlinedIcon,
  [IconName.Wallpaper]: WallpaperIcon,
  [IconName.Warning]: WarningIcon,
  [IconName.WarningAmber]: WarningAmberIcon,
  [IconName.Webhook]: WebhookIcon,
  [IconName.West]: WestIcon,
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
