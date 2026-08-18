/**
 * Services pattern — admin page for orchestrators and runtimes.
 *
 * Composed entirely from v2 atoms (Button, DropdownMenu, Tooltip, IconAction,
 * Dialog, Input, Select, RadioGroup, Switch, Separator, ColorPicker). Ported
 * from the Lovable master's `components/services` group; markup unchanged,
 * data seams turned into props.
 */
export { BrandIcon, brandLabel } from "./BrandIcon";
export { ServiceSheet, type ServiceSheetProps } from "./ServiceSheet";
export { ServicesView, type ServicesViewProps } from "./ServicesView";
export {
  accentClasses,
  formatSince,
  kindGroups,
  kindIcon,
  type Service,
  type ServiceAccent,
  type ServiceInstance,
  type ServiceKindGroup,
  type ServiceOrigin,
  type ServiceScope,
  type ServiceStatus,
} from "./types";
