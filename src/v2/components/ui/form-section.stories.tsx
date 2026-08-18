import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { AlertTriangle, Workflow } from "lucide-react";

import {
  Button,
  FormBackBar,
  FormSectionField,
  FormFooter,
  FormInfoBanner,
  FormTitleBlock,
  Input,
  SegmentedToggle,
  Textarea,
} from "@voxel51/voodo/v2";

/**
 * Building blocks for a settings or create form, so every form page has the
 * same header, field spacing, banner and footer.
 *
 * - `FormBackBar` — cancel/back row above the form
 * - `FormTitleBlock` — icon, title, subtitle, optional trailing slot
 * - `FormField` — label, required/optional marker, hint and helper text
 *   (exported from the flat barrel as `FormSectionField`, because
 *   react-hook-form's controller in `form.tsx` already claims `FormField`)
 * - `FormInfoBanner` — inline note above the footer
 * - `FormFooter` — action row
 * - `SegmentedToggle` — inline two-or-three-way choice inside a field
 *
 * Distinct from `Form`, which binds react-hook-form. These are layout only,
 * and compose with either.
 */
const meta: Meta<typeof FormSectionField> = {
  title: "v2/Components/FormSection",
  component: FormSectionField,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof FormSectionField>;

export const FullForm: Story = {
  render: function FullFormStory() {
    const [scope, setScope] = React.useState("global");
    return (
      <div className="w-[34rem]">
        <FormBackBar onCancel={() => {}} />
        <FormTitleBlock
          icon={<Workflow className="h-5 w-5" />}
          title="New service"
          subtitle="Register an orchestrator or runtime for this workspace."
        />
        <div className="flex flex-col gap-5 py-6">
          <FormSectionField label="Name" required hint="Doubles as the service id.">
            <Input placeholder="argo-prod" />
          </FormSectionField>
          <FormSectionField label="Description" optional>
            <Textarea rows={3} placeholder="Runs delegated operations." />
          </FormSectionField>
          <FormSectionField label="Scope" helper="Per-user gives each member their own instance.">
            <SegmentedToggle
              value={scope}
              onChange={setScope}
              options={[
                { value: "global", label: "Global" },
                { value: "per-user", label: "Per-user" },
              ]}
            />
          </FormSectionField>
        </div>
        <FormInfoBanner icon={<AlertTriangle className="h-4 w-4" />} tone="muted">
          Changing runtime fields restarts the service.
        </FormInfoBanner>
        <FormFooter>
          <Button variant="secondary">Cancel</Button>
          <Button>Create service</Button>
        </FormFooter>
      </div>
    );
  },
};

export const FieldStates: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-5">
      <FormSectionField label="Required field" required>
        <Input placeholder="Must be filled" />
      </FormSectionField>
      <FormSectionField label="Optional field" optional>
        <Input placeholder="Can be left blank" />
      </FormSectionField>
      <FormSectionField label="With hint" hint="Shown beside the label.">
        <Input />
      </FormSectionField>
      <FormSectionField label="With helper" helper="Explanatory text below the control.">
        <Input />
      </FormSectionField>
    </div>
  ),
};
