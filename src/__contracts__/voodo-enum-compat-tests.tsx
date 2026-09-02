/**
 * Deprecated-API type-contract test (dtslint style). Nothing here runs —
 * compiling IS the test; it runs against src/ via `npm run type-check`
 * and against the built dist/index.d.ts via `npm run check:contracts`.
 *
 * The mirror image of voodo-tests.tsx: this file is written the way an
 * OLD consumer is — enum-style `Value.Member` everywhere, zero string
 * literals for token values. It simulates code targeting voodo <= 1.0's
 * enum API and must keep compiling, unchanged, for as long as we claim
 * backward compatibility. When enum-style usage is eventually dropped
 * for real (the const objects and/or namespace types go away), this
 * file is the tripwire: whatever breaks here is what breaks consumers,
 * and deleting it is the explicit, reviewable semver-major event.
 */
import {
  ActivityToast,
  Align,
  Anchor,
  BrandColor,
  Button,
  Card,
  CardBackground,
  Checkbox,
  Collapsible,
  DatePicker,
  Divider,
  Drawer,
  Dropdown,
  DropdownAnchor,
  ElementState,
  EmptyState,
  FormField,
  FormFieldGroup,
  Heading,
  HeadingLevel,
  Icon,
  IconColor,
  IconName,
  Input,
  Justify,
  ListItem,
  MenuSeparator,
  Orientation,
  Pill,
  Radio,
  RadioGroup,
  Radius,
  RichButton,
  RichButtonGroup,
  RichList,
  Select,
  SelectAnchor,
  Shadow,
  SingleValueSlider,
  Size,
  Spacing,
  Spinner,
  Stack,
  Text,
  TextArea,
  TextBadge,
  TextColor,
  TextVariant,
  Toast,
  ToastContainer,
  Toggle,
  ToggleSwitch,
  ToggleSwitchVariant,
  Toolbar,
  Tooltip,
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
 * 1. Members as values — the bread-and-butter old-consumer pattern
 * ──────────────────────────────────────────────────────────────────── */

const size: Size = Size.Md;
const variant: Variant = Variant.Secondary;
const spacing: Spacing = Spacing.Lg;
const anchor: Anchor = Anchor.BottomLeft;
const align: Align = Align.Baseline;
const justify: Justify = Justify.Between;
const orientation: Orientation = Orientation.Column;
const zIndex: ZIndex = ZIndex.AboveModal;
const textColor: TextColor = TextColor.Secondary;
const textVariant: TextVariant = TextVariant.Caption;
const radius: Radius = Radius.Full;
const shadow: Shadow = Shadow.Xs;
const headingLevel: HeadingLevel = HeadingLevel.H3;
const elementState: ElementState = ElementState.Hover;
const brand: BrandColor = BrandColor.Accent;
const icon: IconColor = IconColor.Emphasis;
const duration: TransitionDuration = TransitionDuration.Deliberate;
const easing: TransitionEasing = TransitionEasing.InOut;
const preset: TransitionPreset = TransitionPreset.Overlay;
const cardBg: CardBackground = CardBackground.Elevated;
const dropAnchor: DropdownAnchor = DropdownAnchor.BottomStart;
const selAnchor: SelectAnchor = SelectAnchor.TopEnd;
const iconName: IconName = IconName.Add;
const toggleVariant: ToggleSwitchVariant = ToggleSwitchVariant.Soft;

/* ────────────────────────────────────────────────────────────────────
 * 2. Members as TYPES — the case the namespace merge exists for.
 *    Old consumers could write `Size.Sm` in a type position because
 *    TS enums put members in the type namespace. These must all hold.
 * ──────────────────────────────────────────────────────────────────── */

interface OldConsumerConfig {
  compactSize: Size.Sm;
  dangerOnly: Variant.Danger;
  topOnly: Anchor.Top;
  captionText: TextVariant.Caption;
  overlayLayer: ZIndex.AboveModal;
}
const oldConfig: OldConsumerConfig = {
  compactSize: Size.Sm,
  dangerOnly: Variant.Danger,
  topOnly: Anchor.Top,
  captionText: TextVariant.Caption,
  overlayLayer: ZIndex.AboveModal,
};

// member types inside utility types — patterns lifted from real code
type CompactSizes = Extract<Size, Size.Xs | Size.Sm>;
type NonIconVariants = Exclude<Variant, Variant.Icon | Variant.Borderless>;
type EdgeAnchors = Extract<
  Anchor,
  Anchor.Top | Anchor.Right | Anchor.Bottom | Anchor.Left
>;
const compact: CompactSizes = Size.Xs;
const nonIcon: NonIconVariants = Variant.Success;
const edge: EdgeAnchors = Anchor.Left;

// member types as function parameter constraints
function onlyMd(input: Size.Md): Size.Md {
  return input;
}
const mdOut = onlyMd(Size.Md);
// @ts-expect-error - Size.Sm is not Size.Md
onlyMd(Size.Sm);

/* ────────────────────────────────────────────────────────────────────
 * 3. Computed-key Record maps — the dominant in-repo enum idiom
 *    (`[Spacing.Xl]: "gap-xl"` style). Both partial-by-subset and
 *    exhaustive forms must compile.
 * ──────────────────────────────────────────────────────────────────── */

const sizeLabels: Record<Size, string> = {
  [Size.Xs]: "extra small",
  [Size.Sm]: "small",
  [Size.Md]: "medium",
  [Size.Lg]: "large",
  [Size.Xl]: "extra large",
};

const variantWeights: Record<Variant, number> = {
  [Variant.Primary]: 0,
  [Variant.Secondary]: 1,
  [Variant.Success]: 2,
  [Variant.Danger]: 3,
  [Variant.Icon]: 4,
  [Variant.Borderless]: 5,
};

const edgeOffsets: Record<EdgeAnchors, number> = {
  [Anchor.Top]: 0,
  [Anchor.Right]: 1,
  [Anchor.Bottom]: 2,
  [Anchor.Left]: 3,
};

// indexing back out with a member
const mdLabel: string = sizeLabels[Size.Md];
const dangerWeight: number = variantWeights[Variant.Danger];

/* ────────────────────────────────────────────────────────────────────
 * 4. Control flow over members — switch/if patterns from old consumers
 * ──────────────────────────────────────────────────────────────────── */

function describeAnchor(a: EdgeAnchors): string {
  switch (a) {
    case Anchor.Top:
      return "above";
    case Anchor.Right:
      return "after";
    case Anchor.Bottom:
      return "below";
    case Anchor.Left:
      return "before";
  }
}

function isLoud(v: Variant): boolean {
  if (v === Variant.Danger) return true;
  return v === Variant.Success;
}

// iteration + membership, enum-object style
const allSizes: Size[] = Object.values(Size);
const allVariants: Variant[] = Object.values(Variant);
const hasMd: boolean = allSizes.includes(Size.Md);
const sizeKeys: (keyof typeof Size)[] = Object.keys(
  Size
) as (keyof typeof Size)[];

// helpers called member-style only
const helperResults: string[] = [
  zIndexStyles(ZIndex.High),
  transitionDuration(TransitionDuration.Fast),
  transitionEasing(TransitionEasing.Spring),
  transitionPreset(TransitionPreset.Menu),
  transitionPresetValue(TransitionPreset.Panel),
];

/* ────────────────────────────────────────────────────────────────────
 * 5. Components mounted enum-style only — no string literals anywhere
 * ──────────────────────────────────────────────────────────────────── */

export const OldConsumerApp = (
  <ToastContainer>
    <Stack
      orientation={Orientation.Row}
      spacing={Spacing.Md}
      align={Align.Center}
      justify={Justify.Between}
    >
      <Heading level={HeadingLevel.H2}>Headline</Heading>
      <Text variant={TextVariant.Label} color={TextColor.Tertiary}>
        old-style text
      </Text>
      <Text variant={TextVariant.Md} color={IconColor.Info}>
        icon-color text
      </Text>
      <TextBadge color={TextColor.Info}>3</TextBadge>
      <UnsetHint hint="unset" />
    </Stack>

    <Stack orientation={Orientation.Column} spacing={Spacing.Xs}>
      <Button
        variant={Variant.Primary}
        size={Size.Md}
        leadingIcon={IconName.Add}
        onClick={noop}
      >
        Go
      </Button>
      <Button variant={Variant.Borderless} size={Size.Sm}>
        quiet
      </Button>
      {/* @ts-expect-error - Size.Lg is excluded from ButtonSize */}
      <Button size={Size.Lg}>too big</Button>

      <RichButtonGroup
        buttons={[{ id: "a", data: { children: "A" } }]}
        onChange={noop}
      />
      <RichButton onClick={noop}>standalone</RichButton>

      <Pill
        size={Size.Sm}
        radius={Radius.Full}
        shadow={Shadow.Md}
        color={TextColor.Success}
      >
        pill
      </Pill>
      <Spinner size={Size.Lg} />
      <Icon name={IconName.ArrowDown} size={Size.Sm} color={IconColor.Muted} />
      <Divider orientation={Orientation.Row} />
    </Stack>

    <FormFieldGroup orientation={Orientation.Column} spacing={Spacing.Lg}>
      <FormField
        spacing={Spacing.Sm}
        label="name"
        control={<Input size={Size.Md} />}
      />
      <FormField control={<TextArea size={Size.Sm} resize="None" />} />
      <Checkbox size={Size.Md} radius={Radius.Sm} label="check" />
      <RadioGroup
        size={Size.Lg}
        value="a"
        onChange={noop}
        options={[{ value: "a", label: "A" }]}
      />
      <Radio value="c" label="standalone" size={Size.Sm} />
      <Toggle size={Size.Sm} checked onChange={noop} />
      <ToggleSwitch
        variant={ToggleSwitchVariant.Full}
        size={Size.Sm}
        tabs={[{ id: "one", data: { label: "One", content: "First" } }]}
      />
      {/* @ts-expect-error - Size.Xl is excluded from ToggleSwitchSize */}
      <ToggleSwitch size={Size.Xl} tabs={[]} />
      <SingleValueSlider min={0} max={10} value={5} onChange={noop} />
      <DatePicker size={Size.Md} radius={Radius.Lg} onChange={noop} />
      <Select
        zIndex={ZIndex.High}
        anchor={SelectAnchor.Bottom}
        options={[{ id: "x", data: { label: "X" } }]}
        onChange={noop}
      />
    </FormFieldGroup>

    <Card background={CardBackground.Secondary} shadow={Shadow.Lg} border>
      <ListItem>item</ListItem>
      <RichList spacing={Spacing.Md} listItems={[]} />
      <EmptyState
        orientation={Orientation.Column}
        spacing={Spacing.Md}
        title="Nothing here"
      />
      <Collapsible
        defaultOpen
        header={({ open }) => <span>{String(open)}</span>}
      >
        hidden
      </Collapsible>
      <Tooltip content="tip" anchor={Anchor.Top} shadow={Shadow.Sm}>
        <span>hover me</span>
      </Tooltip>
    </Card>

    <Toolbar orientation={Orientation.Row} zIndex={ZIndex.Low}>
      <span>tools</span>
    </Toolbar>
    <Dropdown
      anchor={DropdownAnchor.BottomEnd}
      zIndex={ZIndex.Medium}
      trigger={<Button variant={Variant.Icon}>open</Button>}
    >
      <MenuSeparator />
    </Dropdown>
    <Drawer maxSize={400} side="right" defaultOpen={false}>
      drawer body
    </Drawer>
    <TreeSelect
      root={{ name: "root", values: [{ name: "leaf", can_select: true }] }}
      onChange={noop}
      zIndex={ZIndex.Medium}
      anchor={SelectAnchor.TopStart}
    />
    <ActivityToast
      anchor={Anchor.BottomRight}
      variant={Variant.Success}
      message="done"
    />
    <Toast
      anchor={Anchor.TopLeft}
      variant={Variant.Primary}
      title="hi"
      description="there"
    />
    {/* @ts-expect-error - Variant.Borderless is excluded from ToastVariant */}
    <Toast variant={Variant.Borderless} title="nope" />
  </ToastContainer>
);

/* keep every check "used" so no-unused-vars stays quiet */
export const enumCompatChecks = {
  size,
  variant,
  spacing,
  anchor,
  align,
  justify,
  orientation,
  zIndex,
  textColor,
  textVariant,
  radius,
  shadow,
  headingLevel,
  elementState,
  brand,
  icon,
  duration,
  easing,
  preset,
  cardBg,
  dropAnchor,
  selAnchor,
  iconName,
  toggleVariant,
  oldConfig,
  compact,
  nonIcon,
  edge,
  mdOut,
  sizeLabels,
  variantWeights,
  edgeOffsets,
  mdLabel,
  dangerWeight,
  describeAnchor,
  isLoud,
  allSizes,
  allVariants,
  hasMd,
  sizeKeys,
  helperResults,
};
