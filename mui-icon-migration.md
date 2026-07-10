# MUI icon usage inventory & voodo migration

Generated 2026-07-06. 227 unique `@mui/icons-material` icons found across fiftyone-teams + fiftyone (source: `mui_icons.json` alongside this file, with per-file usage lists).

## Consumption API (revised 2026-07-08 per PR #162 review)

The `Icon` component, `IconName` enum, and runtime `iconMap` were **removed**:
a runtime-keyed map makes every icon reachable, so bundlers ship all ~300 SVGs
to any consumer of the package — the same bundle problem this migration exists
to fix. Instead, every SVG in `src/img` is generated into its own component in
`src/components/Icons/icons.tsx` (`npm run generate-icons`):
`import { AddIcon } from "@voxel51/voodo"` — unused icons tree-shake away
(`sideEffects: false` is set). Component props that accepted `FC | IconName`
now accept `FC<IconProps>` (or `ReactNode` for slots). The fiftyone/teams
codemods must target these per-icon exports, and their `MuiIcons.tsx` compat
layers must be flat re-exports, NOT `iconMap[name]` lookups. The internal
hand-drawn drag grip was renamed `DragHandleGripIcon`; `DragHandleIcon` is the
generated MUI glyph.

## Ported into design-system (24x24 viewBox, currentColor)

- AccessTime — 3 file(s) (fiftyone-teams)
- AccountTree — 3 file(s) (fiftyone-teams+fiftyone)
- AddBox — 2 file(s) (fiftyone-teams+fiftyone)
- AddLink — 1 file(s) (fiftyone-teams)
- AltRoute — 2 file(s) (fiftyone-teams)
- Apps — 6 file(s) (fiftyone-teams+fiftyone)
- Archive — 2 file(s) (fiftyone-teams)
- ArchiveOutlined — 1 file(s) (fiftyone-teams)
- ArrowBack — 5 file(s) (fiftyone-teams+fiftyone)
- ArrowCircleDown — 1 file(s) (fiftyone-teams)
- ArrowCircleLeftOutlined — 1 file(s) (fiftyone-teams)
- ArrowDownward — 5 file(s) (fiftyone-teams+fiftyone)
- ArrowDropDown — 13 file(s) (fiftyone-teams+fiftyone)
- ArrowDropUp — 8 file(s) (fiftyone-teams+fiftyone)
- ArrowForwardIos — 2 file(s) (fiftyone-teams)
- ArrowForwardIosSharp — 2 file(s) (fiftyone-teams+fiftyone)
- ArrowOutward — 1 file(s) (fiftyone-teams)
- ArrowUpward — 5 file(s) (fiftyone-teams+fiftyone)
- ArticleOutlined — 1 file(s) (fiftyone-teams)
- Assignment — 1 file(s) (fiftyone-teams)
- AssignmentOutlined — 1 file(s) (fiftyone-teams)
- AutoAwesome — 5 file(s) (fiftyone-teams+fiftyone)
- AutoAwesomeMosaicOutlined — 2 file(s) (fiftyone-teams+fiftyone)
- Autorenew — 4 file(s) (fiftyone-teams+fiftyone)
- BarChart — 2 file(s) (fiftyone-teams+fiftyone)
- Bolt — 6 file(s) (fiftyone-teams+fiftyone)
- Bookmark — 2 file(s) (fiftyone-teams+fiftyone)
- Brush — 4 file(s) (fiftyone-teams+fiftyone)
- BubbleChart — 2 file(s) (fiftyone-teams+fiftyone)
- CachedOutlined — 1 file(s) (fiftyone-teams)
- CallMerge — 4 file(s) (fiftyone-teams+fiftyone)
- CallSplit — 4 file(s) (fiftyone-teams+fiftyone)
- CallSplitOutlined — 2 file(s) (fiftyone-teams+fiftyone)
- Cancel — 3 file(s) (fiftyone-teams+fiftyone)
- CancelOutlined — 3 file(s) (fiftyone-teams+fiftyone)
- Casino — 2 file(s) (fiftyone-teams)
- CenterFocusWeak — 6 file(s) (fiftyone-teams+fiftyone)
- ChatBubbleOutlineRounded — 1 file(s) (fiftyone-teams)
- CheckBoxOutlineBlank — 1 file(s) (fiftyone-teams)
- CheckCircle — 3 file(s) (fiftyone-teams)
- CheckCircleOutline — 5 file(s) (fiftyone-teams)
- CheckOutlined — 1 file(s) (fiftyone-teams)
- CircleOutlined — 2 file(s) (fiftyone-teams+fiftyone)
- Clear — 5 file(s) (fiftyone-teams+fiftyone)
- ClearAll — 3 file(s) (fiftyone-teams+fiftyone)
- ClearOutlined — 2 file(s) (fiftyone-teams+fiftyone)
- CloseOutlined — 3 file(s) (fiftyone-teams)
- CloseRounded — 4 file(s) (fiftyone-teams+fiftyone)
- CloseTwoTone — 2 file(s) (fiftyone-teams+fiftyone)
- CloudOutlined — 1 file(s) (fiftyone-teams)
- CloudUpload — 2 file(s) (fiftyone-teams+fiftyone)
- CodeOutlined — 1 file(s) (fiftyone-teams)
- ColorLens — 4 file(s) (fiftyone-teams+fiftyone)
- ContentCopyOutlined — 1 file(s) (fiftyone-teams)
- CopyAllOutlined — 1 file(s) (fiftyone-teams)
- CorporateFare — 1 file(s) (fiftyone-teams)
- CrisisAlertOutlined — 2 file(s) (fiftyone-teams+fiftyone)
- CropSquare — 4 file(s) (fiftyone-teams+fiftyone)
- DarkMode — 3 file(s) (fiftyone-teams+fiftyone)
- DataObject — 1 file(s) (fiftyone-teams)
- DeleteOutline — 19 file(s) (fiftyone-teams+fiftyone)
- DeleteOutlineOutlined — 1 file(s) (fiftyone-teams)
- DeleteOutlined — 2 file(s) (fiftyone-teams)
- DesktopWindowsOutlined — 1 file(s) (fiftyone-teams)
- DisplaySettings — 2 file(s) (fiftyone-teams+fiftyone)
- Done — 2 file(s) (fiftyone-teams+fiftyone)
- DoneOutlined — 4 file(s) (fiftyone-teams+fiftyone)
- DownloadOutlined — 1 file(s) (fiftyone-teams)
- DragHandle — 2 file(s) (fiftyone-teams+fiftyone)
- DragIndicator — 4 file(s) (fiftyone-teams+fiftyone)
- EditNote — 3 file(s) (fiftyone-teams+fiftyone)
- EditOutlined — 7 file(s) (fiftyone-teams+fiftyone)
- EmailOutlined — 1 file(s) (fiftyone-teams)
- ErrorOutline — 4 file(s) (fiftyone-teams+fiftyone)
- ErrorOutlineOutlined — 2 file(s) (fiftyone-teams+fiftyone)
- ExpandLess — 4 file(s) (fiftyone-teams+fiftyone)
- ExpandMore — 24 file(s) (fiftyone-teams+fiftyone)
- Extension — 8 file(s) (fiftyone-teams+fiftyone)
- FactCheck — 1 file(s) (fiftyone-teams)
- Feedback — 2 file(s) (fiftyone-teams+fiftyone)
- FiberManualRecord — 4 file(s) (fiftyone-teams+fiftyone)
- FileCopy — 2 file(s) (fiftyone-teams+fiftyone)
- FileDownloadOutlined — 1 file(s) (fiftyone-teams)
- FileUploadOutlined — 1 file(s) (fiftyone; re-export in similarity-search/src/mui.ts, missed by first inventory pass)
- FilterAlt — 4 file(s) (fiftyone-teams+fiftyone)
- FilterAltOff — 2 file(s) (fiftyone-teams+fiftyone)
- FilterDrama — 1 file(s) (fiftyone)
- FilterList — 8 file(s) (fiftyone-teams+fiftyone)
- FitScreen — 3 file(s) (fiftyone-teams+fiftyone)
- FlipToBack — 2 file(s) (fiftyone-teams+fiftyone)
- Folder — 8 file(s) (fiftyone-teams+fiftyone)
- FolderOff — 2 file(s) (fiftyone-teams+fiftyone)
- FolderOpen — 1 file(s) (fiftyone-teams)
- FullscreenExit — 3 file(s) (fiftyone-teams+fiftyone)
- GridOn — 2 file(s) (fiftyone-teams+fiftyone)
- GroupAdd — 1 file(s) (fiftyone-teams)
- GroupAddOutlined — 1 file(s) (fiftyone-teams)
- Help — 14 file(s) (fiftyone-teams+fiftyone)
- HideImage — 2 file(s) (fiftyone-teams+fiftyone)
- HighlightAlt — 2 file(s) (fiftyone-teams+fiftyone)
- HowToVote — 2 file(s) (fiftyone-teams)
- Hub — 1 file(s) (fiftyone-teams)
- HubOutlined — 2 file(s) (fiftyone-teams)
- Image — 2 file(s) (fiftyone-teams+fiftyone)
- ImageAspectRatio — 2 file(s) (fiftyone-teams+fiftyone)
- InfoOutlined — 13 file(s) (fiftyone-teams+fiftyone)
- Input — 1 file(s) (fiftyone-teams)
- InsertChartOutlined — 6 file(s) (fiftyone-teams+fiftyone)
- InsertDriveFile — 2 file(s) (fiftyone-teams+fiftyone)
- Inventory2 — 2 file(s) (fiftyone-teams)
- Inventory2Outlined — 1 file(s) (fiftyone-teams)
- KeyboardArrowDown — 10 file(s) (fiftyone-teams+fiftyone)
- KeyboardArrowDownOutlined — 8 file(s) (fiftyone-teams+fiftyone)
- KeyboardArrowLeft — 3 file(s) (fiftyone-teams+fiftyone)
- KeyboardArrowRight — 3 file(s) (fiftyone-teams+fiftyone)
- KeyboardArrowUp — 6 file(s) (fiftyone-teams+fiftyone)
- KeyboardArrowUpOutlined — 8 file(s) (fiftyone-teams+fiftyone)
- KeyboardBackspace — 3 file(s) (fiftyone-teams)
- KeyboardDoubleArrowLeft — 1 file(s) (fiftyone-teams)
- KeyboardDoubleArrowRight — 1 file(s) (fiftyone-teams)
- LabelImportant — 2 file(s) (fiftyone-teams)
- LabelOutlined — 2 file(s) (fiftyone-teams+fiftyone)
- Launch — 9 file(s) (fiftyone-teams+fiftyone)
- Layers — 6 file(s) (fiftyone-teams+fiftyone)
- LibraryAdd — 1 file(s) (fiftyone-teams)
- LightMode — 3 file(s) (fiftyone-teams+fiftyone)
- Lightbulb — 1 file(s) (fiftyone-teams)
- List — 2 file(s) (fiftyone-teams+fiftyone)
- LocalOffer — 4 file(s) (fiftyone-teams+fiftyone)
- LocalOfferOutlined — 1 file(s) (fiftyone-teams)
- LockOpenOutlined — 2 file(s) (fiftyone-teams+fiftyone)
- LockOutlined — 2 file(s) (fiftyone-teams+fiftyone)
- Logout — 1 file(s) (fiftyone-teams)
- MailOutline — 1 file(s) (fiftyone-teams)
- Map — 2 file(s) (fiftyone-teams+fiftyone)
- MoreHoriz — 2 file(s) (fiftyone-teams)
- MoreVert — 10 file(s) (fiftyone-teams+fiftyone)
- NotificationsActive — 1 file(s) (fiftyone-teams)
- OpenInNew — 5 file(s) (fiftyone-teams+fiftyone)
- OpenWith — 4 file(s) (fiftyone-teams+fiftyone)
- Palette — 2 file(s) (fiftyone-teams+fiftyone)
- Percent — 2 file(s) (fiftyone-teams+fiftyone)
- PersonAddAlt — 1 file(s) (fiftyone-teams)
- PersonAddOutlined — 1 file(s) (fiftyone-teams)
- PhotoCamera — 1 file(s) (fiftyone-teams)
- PieChartOutlined — 2 file(s) (fiftyone-teams+fiftyone)
- PlayArrow — 3 file(s) (fiftyone-teams)
- Psychology — 2 file(s) (fiftyone-teams)
- QuestionMark — 2 file(s) (fiftyone-teams+fiftyone)
- Rectangle — 2 file(s) (fiftyone-teams+fiftyone)
- RemoveCircleOutline — 4 file(s) (fiftyone-teams)
- Replay — 3 file(s) (fiftyone-teams+fiftyone)
- ReportProblem — 2 file(s) (fiftyone-teams+fiftyone)
- RestartAlt — 3 file(s) (fiftyone-teams+fiftyone)
- RestartAltOutlined — 1 file(s) (fiftyone-teams)
- RocketLaunch — 2 file(s) (fiftyone-teams)
- Rule — 2 file(s) (fiftyone-teams)
- RuleFolder — 2 file(s) (fiftyone-teams)
- Save — 3 file(s) (fiftyone-teams+fiftyone)
- SaveOutlined — 2 file(s) (fiftyone-teams+fiftyone)
- ScatterPlot — 3 file(s) (fiftyone-teams+fiftyone)
- School — 1 file(s) (fiftyone-teams)
- SearchOutlined — 4 file(s) (fiftyone-teams)
- Sell — 1 file(s) (fiftyone-teams)
- SettingsBackupRestore — 3 file(s) (fiftyone-teams+fiftyone)
- SettingsInputCompositeRounded — 1 file(s) (fiftyone-teams)
- SettingsOutlined — 2 file(s) (fiftyone-teams)
- SettingsSystemDaydreamOutlined — 1 file(s) (fiftyone-teams)
- ShowChartOutlined — 2 file(s) (fiftyone-teams+fiftyone)
- Shuffle — 1 file(s) (fiftyone-teams)
- SkipNext — 2 file(s) (fiftyone-teams)
- SmartToy — 2 file(s) (fiftyone-teams)
- Speed — 4 file(s) (fiftyone-teams+fiftyone)
- Splitscreen — 2 file(s) (fiftyone-teams+fiftyone)
- StopCircleOutlined — 2 file(s) (fiftyone-teams)
- Storage — 3 file(s) (fiftyone-teams)
- Straighten — 2 file(s) (fiftyone-teams+fiftyone)
- SubdirectoryArrowRight — 1 file(s) (fiftyone-teams)
- Subject — 1 file(s) (fiftyone-teams)
- SupportOutlined — 3 file(s) (fiftyone-teams)
- Sync — 2 file(s) (fiftyone-teams)
- TableChartOutlined — 6 file(s) (fiftyone-teams+fiftyone)
- Texture — 2 file(s) (fiftyone-teams+fiftyone)
- ThreeSixty — 2 file(s) (fiftyone-teams+fiftyone)
- Timeline — 10 file(s) (fiftyone-teams+fiftyone)
- TimelineOutlined — 2 file(s) (fiftyone-teams+fiftyone)
- Timer — 2 file(s) (fiftyone-teams)
- TimerOff — 2 file(s) (fiftyone-teams)
- TrackChanges — 1 file(s) (fiftyone-teams)
- Tune — 2 file(s) (fiftyone-teams)
- UnarchiveOutlined — 1 file(s) (fiftyone-teams)
- UpgradeOutlined — 1 file(s) (fiftyone-teams)
- VerticalAlignTop — 2 file(s) (fiftyone-teams)
- Videocam — 4 file(s) (fiftyone-teams+fiftyone)
- ViewComfy — 2 file(s) (fiftyone-teams+fiftyone)
- ViewInAr — 4 file(s) (fiftyone-teams+fiftyone)
- Visibility — 10 file(s) (fiftyone-teams+fiftyone)
- VisibilityOff — 11 file(s) (fiftyone-teams+fiftyone)
- VisibilityOffOutlined — 2 file(s) (fiftyone-teams+fiftyone)
- VisibilityOutlined — 3 file(s) (fiftyone-teams+fiftyone)
- Wallpaper — 4 file(s) (fiftyone-teams+fiftyone)
- WarningAmber — 2 file(s) (fiftyone-teams)
- Webhook — 2 file(s) (fiftyone-teams)
- West — 8 file(s) (fiftyone-teams+fiftyone)

## Skipped — design system already has its own design (use existing voodo icon)

- MUI `Add` -> voodo `IconName.Add`
- MUI `Check` -> voodo `IconName.Check`
- MUI `CheckBox` -> voodo `IconName.Checkbox`
- MUI `Checklist` -> voodo `IconName.Checklist`
- MUI `ChevronRight` -> voodo `IconName.ChevronRight`
- MUI `Circle` -> voodo `IconName.Circle`
- MUI `Close` -> voodo `IconName.Close`
- MUI `Code` -> voodo `IconName.Code`
- MUI `ContentCopy` -> voodo `IconName.ContentCopy`
- MUI `Delete` -> voodo `IconName.Delete`
- MUI `Edit` -> voodo `IconName.Edit`
- MUI `Error` -> voodo `IconName.Error`
- MUI `Fullscreen` -> voodo `IconName.Fullscreen`
- MUI `GridView` -> voodo `IconName.GridView`
- MUI `Info` -> voodo `IconName.Info`
- MUI `Lock` -> voodo `IconName.Lock`
- MUI `Polyline` -> voodo `IconName.Polyline`
- MUI `Refresh` -> voodo `IconName.Refresh`
- MUI `Remove` -> voodo `IconName.Remove`
- MUI `Search` -> voodo `IconName.Search`
- MUI `Settings` -> voodo `IconName.Settings`
- MUI `Undo` -> voodo `IconName.Undo`
- MUI `Warning` -> voodo `IconName.Warning`
- MUI `Workspaces` -> voodo `IconName.Workspaces`

## Non-MUI icons ported

- AutoLabel (from app/packages/auto-labeling AutoLabelIcons.tsx TagIcon, currentColor)
- AutoLabelGradient (CustomAutoLabelIcon, fixed brand gradient #FF6D04->#B681FF)

## Not ported / notes

- Third-party company logos (Google, HuggingFace, Meta, Microsoft, Nvidia, OpenAI, PyTorch, Ultralytics — model provider logos in app/packages/app/public/panels) are intentionally NOT served by voodo: they are trademarks, not licensable icon artwork, and stay in the consuming app's own assets.
- Data Quality panel icons are PNGs (brightness/blurriness/aspect_ratio/entropy/near_dup/exact_dup/unsupported/alert/alert_in_circle/data_quality in public/panels) — raster, no SVG source in repo; need SVG exports from design before porting.
- Data Quality + Auto Labeling python panels also use material icon FONT names (troubleshoot, local_offer, search, warning_amber, arrow_back, arrow_forward, expand_more) via MuiIconFont — font-based, unaffected by removing @mui/icons-material package.
- MUI variant near-duplicates were ported 1:1 (e.g. DeleteOutline/DeleteOutlined/DeleteOutlineOutlined); consolidation is a follow-up design decision.