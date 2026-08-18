import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@voxel51/voodo/v2";

/**
 * Vertically stacked, expandable sections. `type="single"` keeps one open at
 * a time; `type="multiple"` allows several. Add `collapsible` so the open
 * section can be closed again.
 */
const meta: Meta<typeof Accordion> = {
  title: "v2/Components/Accordion",
  component: Accordion,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  decorators: [(Story) => <div className="w-96"><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible defaultValue="runtime">
      <AccordionItem value="runtime">
        <AccordionTrigger>Runtime</AccordionTrigger>
        <AccordionContent>
          Image, command and port. Changing any of these restarts the service.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="access">
        <AccordionTrigger>Access</AccordionTrigger>
        <AccordionContent>Scope and per-user instance limits.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="advanced">
        <AccordionTrigger>Advanced</AccordionTrigger>
        <AccordionContent>Environment variables and secrets.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" defaultValue={["a", "b"]}>
      <AccordionItem value="a">
        <AccordionTrigger>First</AccordionTrigger>
        <AccordionContent>Both can be open at once.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Second</AccordionTrigger>
        <AccordionContent>So can this one.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
