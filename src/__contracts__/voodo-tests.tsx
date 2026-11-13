/**
 * Public type-contract test (dtslint style, like the `*-tests.ts` files
 * that ship with @types/ packages). Nothing here runs — compiling IS the
 * test, and it compiles twice:
 *
 *   1. `npm run type-check` — against src/ (fast feedback while editing)
 *   2. `npm run check:contracts` — against dist/index.d.ts, the artifact
 *      consumers actually install (requires `npm run build` first)
 *
 * This file pins the CURRENT string-literal API: every token type is
 * enumerated exhaustively (a missing or extra member fails the check),
 * every component is mounted with token props as plain string literals,
 * enum-style usage (Value.Member as value and as type) is mixed in, and
 * @ts-expect-error probes prove invalid strings are rejected. An
 * unintended change to the public type surface should fail this file;
 * an intended one should be visible here as a reviewed diff.
 *
 * See voodo-enum-compat-tests.tsx for the deprecated enum-style contract.
 */
import {
  Avatar,
  LiveToggle,
  InteractiveColor,
  ActivityToast,
  Alert,
  MetaList,
  TextLink,
  AddIcon,
  Align,
  Anchor,
  BackgroundColor,
  BorderColor,
  BrandColor,
  Button,
  Card,
  CardBackground,
  Checkbox,
  ClampedText,
  CopyAction,
  CodeColor,
  Collapsible,
  DatePicker,
  DataTable,
  Divider,
  Drawer,
  DrawerLength,
  DrawerSide,
  Dropdown,
  DropdownTrigger,
  Dropzone,
  DropdownAnchor,
  ElementState,
  EmptyState,
  FocusColor,
  FormField,
  formatBytes,
  FormFieldGroup,
  Heading,
  HeadingLevel,
  IconAction,
  IconColor,
  IconName,
  Input,
  Justify,
  Kbd,
  LinkColor,
  ListItem,
  Loader,
  LoadingDots,
  MenuIconTextItem,
  MenuSeparator,
  ModalSize,
  OverflowRow,
  Pagination,
  ChipSelect,
  FilterBar,
  FilterChip,
  TagInput,
  ListRow,
  CollapsibleCard,
  SplitButton,
  Orientation,
  ScrimColor,
  VizChartColor,
  VizOverlayColor,
  Pill,
  Popover,
  PopoverAnchor,
  PillColor,
  PillSize,
  Radio,
  RadioGroup,
  RadioGroupSize,
  Radius,
  RichButton,
  RichButtonGroup,
  RichList,
  ScrollbarColor,
  Select,
  SelectAnchor,
  SelectionColor,
  SemanticColor,
  Shadow,
  SheetSide,
  SingleValueSlider,
  Size,
  SkeletonColor,
  Spacing,
  MarkdownEditor,
  Spinner,
  StatusDot,
  Stack,
  StatTile,
  StatTileGroup,
  StatTileTone,
  Combobox,
  DocsButton,
  StepRail,
  StatusColor,
  Text,
  TextAction,
  TextArea,
  TextBadge,
  TextColor,
  TextVariant,
  Toast,
  ToastContainer,
  Toggle,
  ToggleSwitch,
  ToggleSwitchSize,
  Toolbar,
  Tooltip,
  TooltipAnchor,
  TooltipColor,
  TooltipLabel,
  transitionDuration,
  TransitionDuration,
  transitionEasing,
  TransitionEasing,
  transitionPreset,
  TransitionPreset,
  transitionPresetValue,
  TreeSelect,
  UnsetHint,
  UploadList,
  Variant,
  ZIndex,
  zIndexStyles,
  PillList,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableAlign,
  TableSort,
  TableVariant,
  Tab,
  Tabs,
  SpinnerIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  type SliderMark,
  MultiValueSlider,
  EmptyArtFrame,
  EmptyArtColor,
  EmptyArtMotion,
} from "@voxel51/voodo";

const noop = (): void => undefined;

/* ────────────────────────────────────────────────────────────────────
 * Exhaustive token enumerations.
 * `Record<Token, true>` fails to compile if a literal is missing
 * (missing property) OR if a bogus literal sneaks in (excess property),
 * so each map is a two-way exhaustiveness proof written entirely in
 * plain strings.
 * ──────────────────────────────────────────────────────────────────── */

export const exhaustive = {
  size: {
    xs: true,
    sm: true,
    md: true,
    lg: true,
    xl: true,
  } satisfies Record<Size, true>,

  variant: {
    primary: true,
    secondary: true,
    success: true,
    danger: true,
    icon: true,
    borderless: true,
    expressive: true,
  } satisfies Record<Variant, true>,

  textVariant: {
    xxs: true,
    xs: true,
    sm: true,
    md: true,
    lg: true,
    xl: true,
    xxl: true,
    label: true,
    caption: true,
    "heading-xl": true,
    "heading-lg": true,
    "heading-md": true,
    "heading-sm": true,
    "heading-xs": true,
    "body-primary": true,
    "body-secondary": true,
    "body-tertiary": true,
    "code-primary": true,
    "code-secondary": true,
    "metric-lg": true,
    "metric-sm": true,
  } satisfies Record<TextVariant, true>,

  radius: {
    full: true,
    xl: true,
    lg: true,
    md: true,
    sm: true,
    xs: true,
    none: true,
  } satisfies Record<Radius, true>,

  shadow: {
    none: true,
    xl: true,
    lg: true,
    md: true,
    sm: true,
    xs: true,
  } satisfies Record<Shadow, true>,

  spacing: {
    none: true,
    xs: true,
    sm: true,
    md: true,
    lg: true,
    xl: true,
  } satisfies Record<Spacing, true>,

  align: {
    start: true,
    center: true,
    end: true,
    baseline: true,
  } satisfies Record<Align, true>,

  justify: {
    around: true,
    between: true,
    center: true,
    end: true,
    evenly: true,
    start: true,
  } satisfies Record<Justify, true>,

  orientation: {
    row: true,
    col: true,
  } satisfies Record<Orientation, true>,

  anchor: {
    "top-left": true,
    top: true,
    "top-right": true,
    right: true,
    "bottom-right": true,
    bottom: true,
    "bottom-left": true,
    left: true,
  } satisfies Record<Anchor, true>,

  zIndex: {
    default: true,
    low: true,
    medium: true,
    high: true,
    "above-modal": true,
  } satisfies Record<ZIndex, true>,

  headingLevel: {
    h1: true,
    h2: true,
    h3: true,
    h4: true,
  } satisfies Record<HeadingLevel, true>,

  elementState: {
    "data-active": true,
    "data-autofocus": true,
    "data-checked": true,
    disabled: true,
    "data-dragging": true,
    "data-focus": true,
    hover: true,
    none: true,
    "data-open": true,
    "data-selected": true,
  } satisfies Record<ElementState, true>,

  textColor: {
    "text-foreground": true,
    "text-primary": true,
    "text-secondary": true,
    "text-tertiary": true,
    "text-muted": true,
    "text-placeholder": true,
    "text-success": true,
    "text-failure": true,
    "text-warning": true,
    "text-info": true,
    "text-accent": true,
    "text-decorative": true,
    "text-inverse": true,
  } satisfies Record<TextColor, true>,

  iconColor: {
    "icon-default": true,
    "icon-subtle": true,
    "icon-emphasis": true,
    "icon-muted": true,
    "icon-disabled": true,
    "icon-decorative": true,
    "icon-brand": true,
    "icon-success": true,
    "icon-failure": true,
    "icon-warning": true,
    "icon-info": true,
    "icon-dark": true,
  } satisfies Record<IconColor, true>,

  brandColor: {
    "brand-primary": true,
    "brand-accent": true,
  } satisfies Record<BrandColor, true>,

  transitionDuration: {
    instant: true,
    fast: true,
    normal: true,
    moderate: true,
    slow: true,
    deliberate: true,
  } satisfies Record<TransitionDuration, true>,

  transitionEasing: {
    linear: true,
    in: true,
    out: true,
    "in-out": true,
    spring: true,
    sharp: true,
  } satisfies Record<TransitionEasing, true>,

  transitionPreset: {
    colors: true,
    opacity: true,
    transform: true,
    shadow: true,
    menu: true,
    panel: true,
    overlay: true,
    all: true,
  } satisfies Record<TransitionPreset, true>,

  cardBackground: {
    primary: true,
    secondary: true,
    elevated: true,
  } satisfies Record<CardBackground, true>,

  // note the values are space-separated ("bottom start"), not kebab-case
  dropdownAnchor: {
    bottom: true,
    "bottom start": true,
    "bottom end": true,
    top: true,
    "top start": true,
    "top end": true,
  } satisfies Record<DropdownAnchor, true>,

  // popover anchors are floating UI placements: kebab-case
  popoverAnchor: {
    bottom: true,
    "bottom-start": true,
    "bottom-end": true,
    top: true,
    "top-start": true,
    "top-end": true,
  } satisfies Record<PopoverAnchor, true>,

  selectAnchor: {
    bottom: true,
    "bottom start": true,
    "bottom end": true,
    top: true,
    "top start": true,
    "top end": true,
  } satisfies Record<SelectAnchor, true>,

  /* Exported subset aliases — pinned so widening OR narrowing a subset is
   * a visible contract change. (The module-local subsets — ButtonSize,
   * ToastVariant, ToggleSize — are pinned behaviorally by the expect-error
   * probes in the component grids below.) */
  pillSize: {
    xs: true,
    sm: true,
    md: true,
  } satisfies Record<PillSize, true>,

  radioGroupSize: {
    sm: true,
    md: true,
    lg: true,
    xl: true,
  } satisfies Record<RadioGroupSize, true>,

  toggleSwitchSize: {
    xs: true,
    sm: true,
    md: true,
  } satisfies Record<ToggleSwitchSize, true>,

  tooltipAnchor: {
    top: true,
    right: true,
    bottom: true,
    left: true,
  } satisfies Record<TooltipAnchor, true>,

  drawerSide: {
    left: true,
    right: true,
    top: true,
    bottom: true,
  } satisfies Record<DrawerSide, true>,

  drawerLength: [240, "62%"] satisfies DrawerLength[],

  // These two were TS string enums, which rejected plain strings
  modalSize: {
    sm: true,
    md: true,
    lg: true,
    xl: true,
  } satisfies Record<ModalSize, true>,

  sheetSide: {
    left: true,
    right: true,
  } satisfies Record<SheetSide, true>,

  tableVariant: {
    default: true,
    boxed: true,
    rows: true,
  } satisfies Record<TableVariant, true>,

  tableAlign: {
    start: true,
    end: true,
  } satisfies Record<TableAlign, true>,

  tableSort: {
    asc: true,
    desc: true,
    none: true,
  } satisfies Record<TableSort, true>,

  // PillColor spans three color families; spot-check assignability from each
  pillColor: ["bg-card", "bg-transparent"] satisfies readonly PillColor[],
};

/* The remaining color families are large; prove object⇄type agreement
 * without enumerating: every value of the const object inhabits the
 * derived type, plus one literal spot-check each. */
export const colorFamilies = {
  interactive: Object.values(
    InteractiveColor
  ) satisfies readonly InteractiveColor[],
  background: Object.values(
    BackgroundColor
  ) satisfies readonly BackgroundColor[],
  border: Object.values(BorderColor) satisfies readonly BorderColor[],
  semantic: Object.values(SemanticColor) satisfies readonly SemanticColor[],
  status: Object.values(StatusColor) satisfies readonly StatusColor[],
  scrim: Object.values(ScrimColor) satisfies readonly ScrimColor[],
  focus: Object.values(FocusColor) satisfies readonly FocusColor[],
  link: Object.values(LinkColor) satisfies readonly LinkColor[],
  vizChart: Object.values(VizChartColor) satisfies readonly VizChartColor[],
  vizOverlay: Object.values(
    VizOverlayColor
  ) satisfies readonly VizOverlayColor[],
  skeleton: Object.values(SkeletonColor) satisfies readonly SkeletonColor[],
  tooltip: Object.values(TooltipColor) satisfies readonly TooltipColor[],
  code: Object.values(CodeColor) satisfies readonly CodeColor[],
  scrollbar: Object.values(ScrollbarColor) satisfies readonly ScrollbarColor[],
  selection: Object.values(SelectionColor) satisfies readonly SelectionColor[],
  icons: Object.values(IconName) satisfies readonly IconName[],
};

/* ────────────────────────────────────────────────────────────────────
 * Literal ⇄ member interchangeability + namespace types
 * ──────────────────────────────────────────────────────────────────── */

// members are the literals — exact type equality, both directions
const md1: "md" = Size.Md;
const md2: Size.Md = "md";
const spring: TransitionEasing.Spring = TransitionEasing.Spring;
const aboveModal: ZIndex.AboveModal = "above-modal";
const dropStart: DropdownAnchor.BottomStart = "bottom start";
const popStart: PopoverAnchor.BottomStart = "bottom-start";

// namespace types compose with utility types
type SmallSizes = Extract<Size, Size.Xs | Size.Sm>;
type LoudVariants = Exclude<Variant, Variant.Borderless | Variant.Icon>;
const small: SmallSizes = "xs";
const loud: LoudVariants = "danger";

// literal unions flow through template literals
const zVar: `--z-${ZIndex}` = "--z-above-modal";

// helper functions accept literals and members alike
const helperResults: string[] = [
  zIndexStyles("high"),
  zIndexStyles(ZIndex.Low),
  transitionDuration("fast"),
  transitionEasing(TransitionEasing.InOut),
  transitionPreset("menu"),
  transitionPresetValue("panel"),
  formatBytes(2048),
];

/* ────────────────────────────────────────────────────────────────────
 * Negative probes — invalid strings must still be rejected
 * ──────────────────────────────────────────────────────────────────── */

// @ts-expect-error - not a Size
const badSize: Size = "xxxl";
// @ts-expect-error - not a Variant
const badVariant: Variant = "fancy";
// @ts-expect-error - color families don't cross-assign
const badColor: TextColor = "icon-default";
// @ts-expect-error - excluded member
const badSubset: Exclude<Size, Size.Xs> = "xs";
// @ts-expect-error - dropdown anchors are space-separated, not kebab-case
const badDropdownAnchor: DropdownAnchor = "bottom-start";
// @ts-expect-error - popover anchors are kebab-case, not space-separated
const badPopoverAnchor: PopoverAnchor = "bottom start";
// @ts-expect-error - anchor midpoints don't exist
const badAnchor: Anchor = "middle";

/* ────────────────────────────────────────────────────────────────────
 * Component grids — every component, sweeping its token props
 * ──────────────────────────────────────────────────────────────────── */

const SIZES = ["xs", "sm", "md", "lg", "xl"] as const satisfies readonly Size[];
const VARIANTS = Object.values(Variant);
const BUTTON_SIZES = ["xs", "sm", "md"] as const;
const TEXT_VARIANTS = Object.values(TextVariant);
const RADII = Object.values(Radius);
const SHADOWS = Object.values(Shadow);
const ANCHORS = Object.values(Anchor);
const HEADING_LEVELS = ["h1", "h2", "h3", "h4"] as const;
const MENU_ANCHORS = Object.values(DropdownAnchor);
const POPOVER_ANCHORS = Object.values(PopoverAnchor);
const RESIZES = ["None", "Vertical", "Horizontal", "BiDirectional"] as const;
const DRAWER_SIDES = ["left", "right", "top", "bottom"] as const;
const TOGGLE_SWITCH_VARIANTS = [
  "default",
  "soft",
  "full",
  "borderless",
] as const;

export const Everything = (
  <ToastContainer>
    {/* Text: every variant, then every color family that Text accepts */}
    <Stack orientation="col" spacing="xs">
      {TEXT_VARIANTS.map((v) => (
        <Text key={v} variant={v}>
          text {v}
        </Text>
      ))}
      {Object.values(TextColor).map((c) => (
        <Text key={c} color={c}>
          color {c}
        </Text>
      ))}
      {Object.values(IconColor).map((c) => (
        <Text key={c} color={c}>
          color {c}
        </Text>
      ))}
      <Text color="brand-primary">brand text</Text>
      <Text variant={TextVariant.Caption} color={TextColor.Muted}>
        enum-style still compiles
      </Text>
      {HEADING_LEVELS.map((l) => (
        <Heading key={l} level={l}>
          heading {l}
        </Heading>
      ))}
      <TextBadge color="text-info">3</TextBadge>
      <TextBadge color="icon-warning">!</TextBadge>
      <UnsetHint hint="unset" />
    </Stack>

    {/* Buttons: full variant × size grid, string literals throughout */}
    <Stack orientation="row" spacing="sm" align="baseline" justify="around">
      {VARIANTS.map((v) =>
        BUTTON_SIZES.map((s) => (
          <Button
            key={`${v}-${s}`}
            variant={v}
            size={s}
            leadingIcon="Add"
            trailingIcon={IconName.ArrowDown}
            onClick={noop}
          >
            {v}/{s}
          </Button>
        ))
      )}
      {/* @ts-expect-error - lg is excluded from ButtonSize */}
      <Button size="lg">too big</Button>
      {/* @ts-expect-error - not a Variant */}
      <Button variant="fancy">nope</Button>
    </Stack>

    {/* Icon + spinner sweeps */}
    <Stack orientation="row" spacing="none">
      {SIZES.map((s) => (
        <Spinner key={s} size={s} />
      ))}
      {Object.values(IconColor).map((c) => (
        <AddIcon key={c} size="sm" color={c} />
      ))}
      <AddIcon size={Size.Xl} color={BrandColor.Accent} />
      <StatusDot pulse color={BrandColor.Accent} />
      <Kbd title="Escape">Esc</Kbd>
      {(["sm", "md", "lg"] as const).map((s) => (
        <Avatar key={s} name="Ada Lovelace" size={s} />
      ))}
      <Avatar name="Ada Lovelace" size="sm" showName />
      <Avatar name="Ada Lovelace" tone="neutral" />
      <LiveToggle
        checked
        onCheckedChange={() => undefined}
        active={false}
        onRefresh={() => undefined}
        title="Refreshes every 5 seconds"
      />
      <Pill isStatus color={StatusColor.ProgressText}>
        Running
      </Pill>
    </Stack>

    {/* Pills: size × radius × shadow, plus rich buttons */}
    <Stack orientation="row" spacing="md">
      {(["xs", "sm", "md"] as const).map((s) => (
        <Pill key={s} size={s} radius="full" shadow="xs" color="text-success">
          pill {s}
        </Pill>
      ))}
      {RADII.map((r) => (
        <Pill key={r} radius={r}>
          r={r}
        </Pill>
      ))}
      <Pill isStatus color="text-foreground" dotColor="text-failure">
        dot
      </Pill>
      <FilterBar search={<span>search</span>} actions={<span>actions</span>}>
        <ChipSelect
          aria-label="Sort by"
          prefix="Sort by"
          value="a"
          onChange={() => {}}
          options={[{ id: "a", label: "A" }]}
        />
        <ChipSelect
          aria-label="Owner"
          value="a"
          onChange={() => {}}
          options={[{ id: "a", label: "A" }]}
          active
          className="px-2"
        />
      </FilterBar>
      <Tabs>
        <Tab active count={3} size="sm">
          t
        </Tab>
        <Tab size="md">t</Tab>
      </Tabs>
      {/* @ts-expect-error - Tab has no lg size */}
      <Tab size="lg">t</Tab>
      <ListRow
        href="#"
        title="t"
        subtitle="s"
        leading={<span />}
        actions={<span />}
      />
      <ListRow title="t" onClick={() => {}} />
      <ListRow title="t" active disabled />
      <ListRow title="t" icon={AddIcon} onClick={noop} />
      <Avatar name="Run" icon={<span />} size="lg" highlighted />
      <StatTileGroup>
        <StatTile label="l" value="1" hint="2%" />
        <StatTile
          label="l"
          value="1"
          color="brand-primary"
          delta="+1"
          deltaTone="success"
          onSelect={noop}
          selected
          selectLabel="Show"
          compare={{ value: "2", color: "#0af", onSelect: noop }}
        />
        <StatTile label="l" value="1" deltaTone={StatTileTone.Failure} />
      </StatTileGroup>
      {/* @ts-expect-error - deltaTone is a fixed set */}
      <StatTile label="l" value="1" deltaTone="warning" />
      <Combobox
        trigger={<button type="button">t</button>}
        options={[{ id: "a", label: "a" }]}
        value={null}
        onChange={noop}
        footer={<span />}
      />
      <CollapsibleCard
        title="t"
        summary="s"
        icon={AddIcon}
        actions={<span />}
        loading
        open
        onOpenChange={() => {}}
      >
        c
      </CollapsibleCard>
      {/* @ts-expect-error - the card's surface is fixed */}
      <CollapsibleCard title="t" background="secondary" />
      <CollapsibleCard title="t" defaultOpen={false} />
      <CollapsibleCard title="t" keepMounted />
      <SplitButton onClick={() => {}} menuLabel="m" menu={<span />}>
        t
      </SplitButton>
      <FilterChip count={3} selected onClick={() => {}}>
        tag
      </FilterChip>
      <TagInput
        value={["a"]}
        onChange={() => {}}
        inputValue=""
        onInputChange={() => {}}
        suggestions={["b"]}
        loading
        maxTags={1}
        aria-label="Tags"
      />
      <RichButtonGroup
        buttons={[
          { id: "a", data: { children: "A" } },
          { id: "b", data: { children: "B" } },
        ]}
        exclusive
        onChange={noop}
      />
      <RichButton onClick={noop}>standalone</RichButton>
      {(["row", "col"] as const).map((o) => (
        <Divider key={o} orientation={o} />
      ))}
      {(["failure", "warning", "info", "success"] as const).map((tone) => (
        <Alert key={tone} tone={tone} action={<button>act</button>}>
          {tone}
        </Alert>
      ))}
      <Divider onCard />
      <MetaList truncate>
        <span>a</span>
      </MetaList>
      <MetaList>
        <span>a</span>
        <TextLink href="/b" external accent truncate>
          b
        </TextLink>
      </MetaList>
    </Stack>

    {/* Cards: every background × a shadow sweep */}
    {(["primary", "secondary", "elevated"] as const).map((bg) =>
      SHADOWS.map((sh) => (
        <Card key={`${bg}-${sh}`} background={bg} shadow={sh} border compact>
          <ListItem>card {bg}</ListItem>
        </Card>
      ))
    )}

    {/* Step rail: static and revisitable */}
    <StepRail
      steps={[
        { id: "a", label: "A" },
        { id: "b", label: "B" },
      ]}
      current="b"
      onSelect={noop}
    />

    {/* Text and icon actions: every size, string and enum icons */}
    <Stack orientation="row" spacing="sm">
      {(["sm", "md"] as const).map((s) => (
        <TextAction
          key={s}
          size={s}
          leadingIcon="Add"
          trailingIcon={IconName.ArrowDown}
          onClick={noop}
        >
          {s}
        </TextAction>
      ))}
      {(["xs", "sm", "md", "lg"] as const).map((s) => (
        <IconAction key={s} icon="Add" size={s} aria-label={s} />
      ))}
      <IconAction icon="Add" tone="brand" aria-label="Pin" />
      <IconAction icon="Add" tone="danger" aria-label="Remove" />
      <IconAction icon="Add" aria-label="Archive" tooltip hint="Archived" />
      <IconAction icon="Add" active activeLook="tint" aria-label="Panel" />
      {/* @ts-expect-error - unknown tone */}
      <IconAction icon="Add" tone="warning" aria-label="Pin" />
      {/* @ts-expect-error - unknown active look */}
      <IconAction icon="Add" active activeLook="solid" aria-label="Panel" />
      <TextAction collapse leadingIcon="Add" aria-label="Share" onClick={noop}>
        Share
      </TextAction>
      <TextAction collapse="always" leadingIcon="Add" aria-label="Share">
        Share
      </TextAction>
      <TextAction collapse="auto" hint="Locked" aria-label="Share">
        Share
      </TextAction>
      <TextAction tone="danger" onClick={noop}>
        Stop import
      </TextAction>
      {/* @ts-expect-error - xl is excluded from TextAction sizes */}
      <TextAction size="xl">too big</TextAction>
      {/* @ts-expect-error - aria-label is required */}
      <IconAction icon="Add" />
    </Stack>

    {/* TooltipLabel: every prop */}
    <TooltipLabel
      label="Show only selected"
      detail="No members in this scope"
    />
    <TooltipLabel label="Tag" />
    {/* @ts-expect-error - label is required */}
    <TooltipLabel />

    {/* OverflowRow: every prop */}
    <OverflowRow
      label="More actions"
      compactable
      size="sm"
      hug
      onFitChange={(fit) => fit.compact && fit.folded}
      className="x"
    >
      <button>a</button>
    </OverflowRow>
    {/* @ts-expect-error - children are required */}
    <OverflowRow />

    {/* DataTable: every prop */}
    <DataTable
      columns={[
        { key: "name", label: "Name", role: "primary", width: "16rem" },
        { key: "state", label: "State", role: "status" },
        { key: "size", label: "Size", role: "meta", hideBelow: "md" },
        { key: "menu", label: "", role: "actions", align: "end" },
      ]}
      rows={[
        {
          id: "a",
          cells: { name: "Alpha", state: "On", size: 1, menu: null },
          onClick: noop,
          props: { className: "x" },
          detail: "Details",
        },
      ]}
      empty="None"
      cardBelow="md"
      className="x"
    />
    {/* @ts-expect-error - rows are required */}
    <DataTable columns={[]} />
    {/* @ts-expect-error - role is a fixed set */}
    <DataTable columns={[{ key: "a", label: "A", role: "title" }]} rows={[]} />

    {/* Table: boxed variant, align, sort */}
    <Table variant="boxed" wrapperClassName="x">
      <TableHeader>
        <TableRow>
          <TableHead align={TableAlign.End} sort="asc" onSort={noop}>
            A
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell align="end">1</TableCell>
        </TableRow>
      </TableBody>
    </Table>
    {/* Table: rows variant, indented cell */}
    <Table variant="rows">
      <TableBody>
        <TableRow>
          <TableCell indent={1} style={{ width: 196 }}>
            nested
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    {/* CopyAction: every prop */}
    <CopyAction text="x" size="sm" className="x" onCopy={noop} />
    {/* @ts-expect-error - text is required */}
    <CopyAction />
    {/* ClampedText and PillList: every prop */}
    <ClampedText lines={4} expanded className="x">
      text
    </ClampedText>
    <PillList
      items={["a"]}
      max={3}
      expanded
      size="sm"
      backgroundColor="bg-card-nested"
    />
    {/* @ts-expect-error - items are required */}
    <PillList />
    {/* @ts-expect-error - variant is a fixed set */}
    <Table variant="striped" />
    {/* @ts-expect-error - sort is a fixed set */}
    <TableHead sort="up" />
    <Table variant={TableVariant.Default}>
      <TableHeader>
        <TableRow>
          <TableHead sort={TableSort.None} onSort={noop}>
            B
          </TableHead>
        </TableRow>
      </TableHeader>
    </Table>

    {/* Pagination: every prop */}
    <Pagination
      page={1}
      pageCount={10}
      onPageChange={noop}
      pageSize={25}
      pageSizes={[25, 50]}
      onPageSizeChange={noop}
      total={250}
      disabled
      siblingCount={1}
      boundaryCount={1}
      align="center"
      jump="both"
      hide={["summary", "page-size", "jump", "edges", "pages"]}
      className="x"
    />
    {/* @ts-expect-error - page, pageCount and onPageChange are required */}
    <Pagination />

    {/* Dropzone: every prop */}
    <Dropzone
      title="Drop files"
      description="or browse"
      accept="image/*"
      multiple={false}
      disabled
      onFiles={noop}
    />
    {/* @ts-expect-error - Dropzone owns its drop handler */}
    <Dropzone title="Drop files" onFiles={noop} onDrop={noop} />

    {/* Upload list: removable rows and a custom summary */}
    <UploadList
      items={[
        { id: "a", name: "a.jpg", kind: "JPG", size: 2048, status: "done" },
      ]}
      summary="1 file"
      onRemove={noop}
      onRemoveAll={noop}
    />

    {/* Form controls */}
    <FormFieldGroup orientation="col" spacing="lg">
      {SIZES.map((s) => (
        <FormField
          key={s}
          spacing="sm"
          label={`input ${s}`}
          control={<Input size={s} placeholder={s} />}
        />
      ))}
      {RESIZES.map((r) => (
        <FormField key={r} control={<TextArea size="sm" resize={r} />} />
      ))}
      <MarkdownEditor
        value="# Title"
        onChange={() => {}}
        renderPreview={(text) => <p>{text}</p>}
        rows={4}
      />
      {RADII.map((r) => (
        <Checkbox key={r} size="md" radius={r} label={`radius ${r}`} />
      ))}
      <RadioGroup
        size="lg"
        value="a"
        onChange={noop}
        options={[
          { value: "a", label: "A" },
          { value: "b", label: "B", disabled: true },
          { value: "d", label: "D", fieldProps: { "data-testid": "d" } },
        ]}
        radioProps={{ fieldProps: { className: "row" } }}
      />
      <Radio
        value="c"
        label="standalone"
        size="sm"
        fieldProps={{ title: "row", "data-testid": "c" }}
      />
      {(["sm", "md"] as const).map((s) => (
        <Toggle key={s} size={s} checked onChange={noop} />
      ))}
      {/* @ts-expect-error - xs is excluded from ToggleSize */}
      <Toggle size="xs" />
      {TOGGLE_SWITCH_VARIANTS.map((v) => (
        <ToggleSwitch
          key={v}
          variant={v}
          size="sm"
          tabs={[
            { id: "one", data: { label: "One", content: "First" } },
            { id: "two", data: { label: "Two", content: "Second" } },
          ]}
        />
      ))}
      {/* @ts-expect-error - lg is excluded from ToggleSwitchSize */}
      <ToggleSwitch size="lg" tabs={[]} />
      <ToggleSwitch
        collapse="auto"
        tabs={[{ id: "one", data: { label: "One", icon: AddIcon } }]}
      />
      <ToggleSwitch
        linkComponent="a"
        tabListRef={{ current: null }}
        tabs={[
          { id: "one", data: { label: "One", href: "/one" } },
          { id: "two", data: { label: "Two", href: "/two", disabled: true } },
        ]}
      />
      <SingleValueSlider min={0} max={10} value={5} onChange={noop} />
      <SingleValueSlider
        min={0}
        max={10}
        value={5}
        formatLabel={(v: number) => <span>{v}%</span>}
        formatInput={(v: number) => String(v * 100)}
        parseInput={(text: string) => Number.parseFloat(text) / 100}
      />
      <SingleValueSlider
        min={0}
        max={1}
        marks={[{ value: 0, label: "0" }, { value: 0.5 } satisfies SliderMark]}
      />
      <MultiValueSlider min={0} max={1} marks={[{ value: 1, label: "1" }]} />
      <ToggleSwitch index={-1} tabs={[{ id: "a", data: { label: "A" } }]} />
      <Button leadingIcon={SpinnerIcon}>busy</Button>
      <ThumbsUpIcon size="sm" />
      <ThumbsDownIcon size={16} />
      <EmptyArtFrame
        label="l"
        glow={{ cx: 1, cy: 1, rx: 1, ry: 1 }}
        className="x"
      >
        {(id) => (
          <circle
            id={id}
            stroke={EmptyArtColor.Accent}
            className={EmptyArtMotion.Breathe}
          />
        )}
      </EmptyArtFrame>
      {SIZES.map((s) => (
        <DatePicker key={s} size={s} radius="lg" onChange={noop} />
      ))}
    </FormFieldGroup>

    {/* Menus and overlays: full anchor sweeps */}
    <Dropdown
      open
      onOpenChange={(open: boolean) => void open}
      trigger={<Button variant="icon">open</Button>}
    >
      <MenuSeparator />
    </Dropdown>
    {/* @ts-expect-error - open needs onOpenChange, or the menu could never close */}
    <Dropdown open trigger={<Button variant="icon">open</Button>}>
      <MenuSeparator />
    </Dropdown>
    {MENU_ANCHORS.map((a) => (
      <Dropdown
        key={a}
        anchor={a}
        zIndex="medium"
        trigger={<Button variant="icon">open</Button>}
      >
        <MenuSeparator />
        <MenuIconTextItem
          icon={<span />}
          text="Auto labeling"
          badge={<TextBadge color="text-tertiary">Beta</TextBadge>}
        />
      </Dropdown>
    ))}
    {POPOVER_ANCHORS.map((a) => (
      <Popover
        key={a}
        anchor={a}
        zIndex="medium"
        portal={false}
        trigger={<Button variant="icon">open</Button>}
      >
        {({ close }) => <Button onClick={close}>done</Button>}
      </Popover>
    ))}
    <Popover trigger={<Button>anchor</Button>} open onOpenChange={() => {}}>
      controlled
    </Popover>
    <Loader type="bars" size="xl" aria-label="Generating" />
    <Text gradient>Generating</Text>
    <Text truncate>A long title</Text>
    <Stack scroll>
      <DropdownTrigger prefix="Sort by">Newest</DropdownTrigger>
      <DropdownTrigger borderless active>
        Owner
      </DropdownTrigger>
    </Stack>
    <LoadingDots text="Searching" variant="sm" color="text-tertiary" />
    {MENU_ANCHORS.map((a) => (
      <Select
        key={a}
        anchor={a}
        zIndex="high"
        size="sm"
        variant="borderless"
        placeholder="Pick"
        options={[{ id: "x", data: { label: "X" } }]}
        onChange={noop}
      />
    ))}
    {(["top", "right", "bottom", "left"] as const).map((a) => (
      <Tooltip key={a} content="tip" anchor={a} shadow="sm">
        <span>hover</span>
      </Tooltip>
    ))}
    <Tooltip content="tip" collisionPadding={12} avoidCollisions portal={false}>
      <span>hover</span>
    </Tooltip>
    <Tooltip content={<a href="/docs">docs</a>} interactive>
      <span>hover</span>
    </Tooltip>
    {ANCHORS.map((a) => (
      <Toast key={a} anchor={a} variant="primary" title={a} />
    ))}
    {(["primary", "secondary", "success", "danger", "icon"] as const).map(
      (v) => (
        <ActivityToast key={v} anchor="bottom-right" variant={v} message={v} />
      )
    )}
    {/* @ts-expect-error - borderless is excluded from ToastVariant */}
    <Toast variant="borderless" title="nope" />

    {/* Structure and containers */}
    <Stack orientation="row" spacing="xl" align="end" justify="evenly">
      <RichList spacing="md" listItems={[]} />
      <EmptyState orientation="col" spacing="md" title="Nothing here" />
      <EmptyState size="sm" title="Nothing here" />
      <EmptyState
        title="Nothing here"
        actions={<span />}
        docsHref="/docs"
        docsLabel="Docs"
        note={<span />}
        stepsTitle="How"
        steps={[
          { icon: AddIcon, title: "1", description: "d", action: <span /> },
        ]}
        footer={<span />}
      />
      <DocsButton href="/docs" label="Docs" size="xs" />
      <Collapsible
        defaultOpen
        header={({ open }) => <span>{String(open)}</span>}
      >
        hidden
      </Collapsible>
    </Stack>
    <Toolbar orientation="row" zIndex="low" lockY visible>
      <span>tools</span>
    </Toolbar>
    {DRAWER_SIDES.map((side) => (
      <Drawer key={side} maxSize={400} side={side} defaultOpen={false}>
        drawer {side}
      </Drawer>
    ))}
    <Drawer maxSize={400} size={240} onSizeChange={(size: number) => size}>
      drawer with a controlled size
    </Drawer>
    <Drawer
      side="bottom"
      mode="float"
      scrim
      resizable={false}
      size="62%"
      maxSize="90%"
    >
      floating drawer sized by the viewport
    </Drawer>
    <TreeSelect
      root={{ name: "root", values: [{ name: "leaf", can_select: true }] }}
      onChange={noop}
      zIndex="medium"
      anchor="top start"
    />
  </ToastContainer>
);

/* keep the scalar checks "used" so no-unused-vars stays quiet */
export const tokenChecks = {
  md1,
  md2,
  spring,
  aboveModal,
  dropStart,
  small,
  loud,
  zVar,
  helperResults,
  badSize,
  badVariant,
  badColor,
  badSubset,
  badDropdownAnchor,
  badPopoverAnchor,
  badAnchor,
  popStart,
};
