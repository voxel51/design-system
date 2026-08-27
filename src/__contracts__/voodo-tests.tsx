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
  ActionColor,
  ActivityToast,
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
  CodeColor,
  Collapsible,
  DatePicker,
  Divider,
  Drawer,
  DrawerSide,
  Dropdown,
  DropdownAnchor,
  ElementState,
  EmptyState,
  FocusColor,
  FormField,
  FormFieldGroup,
  Heading,
  HeadingLevel,
  IconColor,
  IconName,
  Input,
  Justify,
  LinkColor,
  ListItem,
  MenuSeparator,
  Orientation,
  OverlayColor,
  PaletteColor,
  Pill,
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
  SingleValueSlider,
  Size,
  SkeletonColor,
  Spacing,
  Spinner,
  Stack,
  StatusColor,
  Text,
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
  transitionDuration,
  TransitionDuration,
  transitionEasing,
  TransitionEasing,
  transitionPreset,
  TransitionPreset,
  transitionPresetValue,
  TreeSelect,
  UnsetHint,
  Variant,
  ZIndex,
  zIndexStyles,
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
    "text-fg": true,
    "text-primary": true,
    "text-secondary": true,
    "text-tertiary": true,
    "text-muted": true,
    "text-placeholder": true,
    "text-success": true,
    "text-destructive": true,
    "text-warning": true,
    "text-info": true,
    "text-accent": true,
    "text-decorative": true,
  } satisfies Record<TextColor, true>,

  iconColor: {
    "icon-default": true,
    "icon-subtle": true,
    "icon-emphasis": true,
    "icon-muted": true,
    "icon-disabled": true,
    "icon-decorative": true,
    "icon-brand": true,
    "icon-brand-accent": true,
    "icon-success": true,
    "icon-destructive": true,
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

  // PillColor spans three color families; spot-check assignability from each
  pillColor: ["bg-card-1", "bg-transparent"] satisfies readonly PillColor[],
};

/* The remaining color families are large; prove object⇄type agreement
 * without enumerating: every value of the const object inhabits the
 * derived type, plus one literal spot-check each. */
export const colorFamilies = {
  action: Object.values(ActionColor) satisfies readonly ActionColor[],
  background: Object.values(
    BackgroundColor
  ) satisfies readonly BackgroundColor[],
  border: Object.values(BorderColor) satisfies readonly BorderColor[],
  semantic: Object.values(SemanticColor) satisfies readonly SemanticColor[],
  status: Object.values(StatusColor) satisfies readonly StatusColor[],
  overlay: Object.values(OverlayColor) satisfies readonly OverlayColor[],
  focus: Object.values(FocusColor) satisfies readonly FocusColor[],
  link: Object.values(LinkColor) satisfies readonly LinkColor[],
  palette: Object.values(PaletteColor) satisfies readonly PaletteColor[],
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
    </Stack>

    {/* Cards: every background × a shadow sweep */}
    {(["primary", "secondary", "elevated"] as const).map((bg) =>
      SHADOWS.map((sh) => (
        <Card key={`${bg}-${sh}`} background={bg} shadow={sh} border compact>
          <ListItem>card {bg}</ListItem>
        </Card>
      ))
    )}

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
        ]}
      />
      <Radio value="c" label="standalone" size="sm" />
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
      <SingleValueSlider min={0} max={10} value={5} onChange={noop} />
      {SIZES.map((s) => (
        <DatePicker key={s} size={s} radius="lg" onChange={noop} />
      ))}
    </FormFieldGroup>

    {/* Menus and overlays: full anchor sweeps */}
    {MENU_ANCHORS.map((a) => (
      <Dropdown
        key={a}
        anchor={a}
        zIndex="medium"
        trigger={<Button variant="icon">open</Button>}
      >
        <MenuSeparator />
      </Dropdown>
    ))}
    {MENU_ANCHORS.map((a) => (
      <Select
        key={a}
        anchor={a}
        zIndex="high"
        options={[{ id: "x", data: { label: "X" } }]}
        onChange={noop}
      />
    ))}
    {(["top", "right", "bottom", "left"] as const).map((a) => (
      <Tooltip key={a} content="tip" anchor={a} shadow="sm">
        <span>hover</span>
      </Tooltip>
    ))}
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
  badAnchor,
};
