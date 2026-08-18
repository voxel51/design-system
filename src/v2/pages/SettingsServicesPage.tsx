import * as React from "react";
import {
  Activity,
  CreditCard,
  KeyRound,
  Plug,
  Server,
  Shield,
  User,
  Users,
  Workflow,
} from "lucide-react";

import { SettingsShell, type SettingsNavGroup } from "../components/chrome";
import { WorkspaceHeader } from "../components/chrome";
import { ServicesView } from "../components/patterns/services";
import { UserBadge } from "../components/ui/user-badge";
import { SERVICES } from "./demoData";

/**
 * Settings → Services, assembled end to end.
 *
 * The whole page is four design-system pieces: `WorkspaceHeader`,
 * `SettingsShell`, `ServicesView`, and a `UserBadge`. Everything below —
 * the table, the status pills, the per-user instance rows, the create sheet,
 * the dropdown menus — comes from inside `ServicesView`.
 *
 * That ratio is the argument for a pattern layer. The equivalent page in
 * teams-app is 617 lines that import from MUI, voodo and
 * `@fiftyone/teams-components` at once, plus a hand-rolled `cssVar()` bridge
 * to feed voodo tokens into MUI's `sx`.
 */

const NAV: SettingsNavGroup[] = [
  {
    label: "Personal",
    items: [
      { id: "account", label: "Account", icon: User },
      { id: "api-keys", label: "API keys", icon: KeyRound },
    ],
  },
  {
    label: "Workspace",
    items: [
      { id: "services", label: "Services", icon: Server },
      { id: "orchestrators", label: "Orchestrators", icon: Workflow },
      { id: "plugins", label: "Plugins", icon: Plug, badge: "Beta" },
      { id: "activity", label: "Activity", icon: Activity },
      { id: "billing", label: "Billing", icon: CreditCard },
    ],
  },
  {
    label: "Administration",
    items: [
      { id: "users", label: "Users", icon: Users },
      { id: "roles", label: "Roles", icon: Shield, disabled: true },
    ],
  },
];

const TABS = [
  { id: "work", label: "Work" },
  { id: "datasets", label: "Datasets", count: 6 },
  { id: "models", label: "Models", count: 4 },
  { id: "settings", label: "Settings" },
];

export function SettingsServicesPage() {
  const [section, setSection] = React.useState("services");

  return (
    <SettingsShell
      groups={NAV}
      activeId={section}
      onSelect={setSection}
      header={
        <WorkspaceHeader
          tabs={TABS}
          activeId="settings"
          user={<UserBadge name="Sejal Kotak" />}
        />
      }
    >
      <ServicesView services={SERVICES} />
    </SettingsShell>
  );
}
