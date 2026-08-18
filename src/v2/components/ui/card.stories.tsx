import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  StatusPill,
} from "@voxel51/voodo/v2";

/**
 * Surface container. The card rule: default `bg-card-2`, hover
 * `bg-card-elevated`. No exceptions for list-item style cards.
 *
 * Sections are optional — `CardHeader`, `CardContent` and `CardFooter` exist
 * to keep padding consistent, not because all three are required.
 */
const meta: Meta<typeof Card> = {
  title: "v2/Components/Card",
  component: Card,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>argo-prod</CardTitle>
        <CardDescription>Argo on Kubernetes · v3.5.1</CardDescription>
      </CardHeader>
      <CardContent className="text-body-sm text-secondary-foreground">
        Runs delegated operations for this workspace.
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm">Restart</Button>
        <Button size="sm" variant="secondary">Logs</Button>
      </CardFooter>
    </Card>
  ),
};

/** Interactive card — hover lifts to `bg-card-elevated`. */
export const Interactive: Story = {
  render: () => (
    <Card className="w-96 cursor-pointer bg-card-2 transition-colors hover:bg-card-elevated">
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle>qdrant</CardTitle>
          <CardDescription>Vector index</CardDescription>
        </div>
        <StatusPill tone="reviewed" label="Running" />
      </CardHeader>
    </Card>
  ),
};
