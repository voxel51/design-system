/**
 * @deprecated Use the per-icon components instead (e.g. `<EditIcon />`).
 * `IconName` and the legacy `Icon` component exist only to bridge consumers
 * migrating from voodo <= 0.0.39 and will be removed once the migration
 * completes.
 */
export const IconName = {
  Activity: "Activity",
  Add: "Add",
  AI: "AI",
  Annotate: "Annotate",
  ArrowDown: "ArrowDown",
  ArrowLeft: "ArrowLeft",
  ArrowRight: "ArrowRight",
  ArrowUp: "ArrowUp",
  ArrowUpRight: "ArrowUpRight",
  Blocks: "Blocks",
  Boxes: "Boxes",
  CalendarClock: "CalendarClock",
  CaretDown: "CaretDown",
  Check: "Check",
  Checkbox: "Checkbox",
  Checklist: "Checklist",
  ChevronBottom: "ChevronBottom",
  ChevronLeft: "ChevronLeft",
  ChevronRight: "ChevronRight",
  ChevronTop: "ChevronTop",
  Circle: "Circle",
  CircleUser: "CircleUser",
  Close: "Close",
  Cloud: "Cloud",
  CloudCog: "CloudCog",
  Code: "Code",
  Cog: "Cog",
  Contact: "Contact",
  ContentCopy: "ContentCopy",
  Database: "Database",
  DateRange: "DateRange",
  Draw: "Draw",
  Delete: "Delete",
  Detection: "Detection",
  Download: "Download",
  Drag: "Drag",
  Edit: "Edit",
  Embeddings: "Embeddings",
  Enter: "Enter",
  Error: "Error",
  ExitWorkspace: "ExitWorkspace",
  ExternalLink: "ExternalLink",
  FileClock: "FileClock",
  FineTune: "FineTune",
  Fingerprint: "Fingerprint",
  Fullscreen: "Fullscreen",
  GridView: "GridView",
  History: "History",
  IdCard: "IdCard",
  ImageSearch: "ImageSearch",
  Info: "Info",
  Insights: "Insights",
  Inspect: "Inspect",
  JSON: "JSON",
  Key: "Key",
  KeyRound: "KeyRound",
  KeySquare: "KeySquare",
  Label: "Label",
  Lock: "Lock",
  Logs: "Logs",
  Menu: "Menu",
  MoreHorizontal: "MoreHorizontal",
  MoreVertical: "MoreVertical",
  Move: "Move",
  NotebookPen: "NotebookPen",
  Notes: "Notes",
  Orchestrator: "Orchestrator",
  Pause: "Pause",
  Pencil: "Pencil",
  Pin: "Pin",
  Play: "Play",
  Polyline: "Polyline",
  Puzzle: "Puzzle",
  Radio: "Radio",
  Redo: "Redo",
  Refresh: "Refresh",
  Remove: "Remove",
  Review: "Review",
  Search: "Search",
  Server: "Server",
  Settings: "Settings",
  ShieldCheck: "ShieldCheck",
  Slider: "Slider",
  Sliders: "Sliders",
  Spinner: "Spinner",
  Tag: "Tag",
  Text: "Text",
  Toggle: "Toggle",
  Undo: "Undo",
  UnfoldMore: "UnfoldMore",
  Unlock: "Unlock",
  Unsupported: "Unsupported",
  Upload: "Upload",
  User: "User",
  Users: "Users",
  UsersRound: "UsersRound",
  VAL: "VAL",
  VolumeOff: "VolumeOff",
  VolumeUp: "VolumeUp",
  Warning: "Warning",
  Waypoints: "Waypoints",
  Workflow: "Workflow",
  Workspaces: "Workspaces",
  Zap: "Zap",
} as const;
export type IconName = `${(typeof IconName)[keyof typeof IconName]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace IconName {
  export type Activity = typeof IconName.Activity;
  export type Add = typeof IconName.Add;
  export type AI = typeof IconName.AI;
  export type Annotate = typeof IconName.Annotate;
  export type ArrowDown = typeof IconName.ArrowDown;
  export type ArrowLeft = typeof IconName.ArrowLeft;
  export type ArrowRight = typeof IconName.ArrowRight;
  export type ArrowUp = typeof IconName.ArrowUp;
  export type ArrowUpRight = typeof IconName.ArrowUpRight;
  export type Blocks = typeof IconName.Blocks;
  export type Boxes = typeof IconName.Boxes;
  export type CalendarClock = typeof IconName.CalendarClock;
  export type CaretDown = typeof IconName.CaretDown;
  export type Check = typeof IconName.Check;
  export type Checkbox = typeof IconName.Checkbox;
  export type Checklist = typeof IconName.Checklist;
  export type ChevronBottom = typeof IconName.ChevronBottom;
  export type ChevronLeft = typeof IconName.ChevronLeft;
  export type ChevronRight = typeof IconName.ChevronRight;
  export type ChevronTop = typeof IconName.ChevronTop;
  export type Circle = typeof IconName.Circle;
  export type CircleUser = typeof IconName.CircleUser;
  export type Close = typeof IconName.Close;
  export type Cloud = typeof IconName.Cloud;
  export type CloudCog = typeof IconName.CloudCog;
  export type Code = typeof IconName.Code;
  export type Cog = typeof IconName.Cog;
  export type Contact = typeof IconName.Contact;
  export type ContentCopy = typeof IconName.ContentCopy;
  export type Database = typeof IconName.Database;
  export type DateRange = typeof IconName.DateRange;
  export type Draw = typeof IconName.Draw;
  export type Delete = typeof IconName.Delete;
  export type Detection = typeof IconName.Detection;
  export type Download = typeof IconName.Download;
  export type Drag = typeof IconName.Drag;
  export type Edit = typeof IconName.Edit;
  export type Embeddings = typeof IconName.Embeddings;
  export type Enter = typeof IconName.Enter;
  export type Error = typeof IconName.Error;
  export type ExitWorkspace = typeof IconName.ExitWorkspace;
  export type ExternalLink = typeof IconName.ExternalLink;
  export type FileClock = typeof IconName.FileClock;
  export type FineTune = typeof IconName.FineTune;
  export type Fingerprint = typeof IconName.Fingerprint;
  export type Fullscreen = typeof IconName.Fullscreen;
  export type GridView = typeof IconName.GridView;
  export type History = typeof IconName.History;
  export type IdCard = typeof IconName.IdCard;
  export type ImageSearch = typeof IconName.ImageSearch;
  export type Info = typeof IconName.Info;
  export type Insights = typeof IconName.Insights;
  export type Inspect = typeof IconName.Inspect;
  export type JSON = typeof IconName.JSON;
  export type Key = typeof IconName.Key;
  export type KeyRound = typeof IconName.KeyRound;
  export type KeySquare = typeof IconName.KeySquare;
  export type Label = typeof IconName.Label;
  export type Lock = typeof IconName.Lock;
  export type Logs = typeof IconName.Logs;
  export type Menu = typeof IconName.Menu;
  export type MoreHorizontal = typeof IconName.MoreHorizontal;
  export type MoreVertical = typeof IconName.MoreVertical;
  export type Move = typeof IconName.Move;
  export type NotebookPen = typeof IconName.NotebookPen;
  export type Notes = typeof IconName.Notes;
  export type Orchestrator = typeof IconName.Orchestrator;
  export type Pause = typeof IconName.Pause;
  export type Pencil = typeof IconName.Pencil;
  export type Pin = typeof IconName.Pin;
  export type Play = typeof IconName.Play;
  export type Polyline = typeof IconName.Polyline;
  export type Puzzle = typeof IconName.Puzzle;
  export type Radio = typeof IconName.Radio;
  export type Redo = typeof IconName.Redo;
  export type Refresh = typeof IconName.Refresh;
  export type Remove = typeof IconName.Remove;
  export type Review = typeof IconName.Review;
  export type Search = typeof IconName.Search;
  export type Server = typeof IconName.Server;
  export type Settings = typeof IconName.Settings;
  export type ShieldCheck = typeof IconName.ShieldCheck;
  export type Slider = typeof IconName.Slider;
  export type Sliders = typeof IconName.Sliders;
  export type Spinner = typeof IconName.Spinner;
  export type Tag = typeof IconName.Tag;
  export type Text = typeof IconName.Text;
  export type Toggle = typeof IconName.Toggle;
  export type Undo = typeof IconName.Undo;
  export type UnfoldMore = typeof IconName.UnfoldMore;
  export type Unlock = typeof IconName.Unlock;
  export type Unsupported = typeof IconName.Unsupported;
  export type Upload = typeof IconName.Upload;
  export type User = typeof IconName.User;
  export type Users = typeof IconName.Users;
  export type UsersRound = typeof IconName.UsersRound;
  export type VAL = typeof IconName.VAL;
  export type VolumeOff = typeof IconName.VolumeOff;
  export type VolumeUp = typeof IconName.VolumeUp;
  export type Warning = typeof IconName.Warning;
  export type Waypoints = typeof IconName.Waypoints;
  export type Workflow = typeof IconName.Workflow;
  export type Workspaces = typeof IconName.Workspaces;
  export type Zap = typeof IconName.Zap;
}

export default IconName;
