import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Database, Settings, Workflow } from "lucide-react";

import {
  Button,
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@voxel51/voodo/v2";

/**
 * Filterable command list on cmdk. Typing narrows the list; arrows move;
 * Enter runs.
 *
 * `CommandDialog` is the same list inside a modal, for a ⌘K palette.
 */
const meta: Meta<typeof Command> = {
  title: "v2/Components/Command",
  component: Command,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Command>;

export const Default: Story = {
  render: () => (
    <Command className="w-96 rounded-lg border border-border">
      <CommandInput placeholder="Search services and settings" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Services">
          <CommandItem>
            <Workflow className="mr-2 h-4 w-4" /> argo-prod
          </CommandItem>
          <CommandItem>
            <Database className="mr-2 h-4 w-4" /> qdrant
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <Settings className="mr-2 h-4 w-4" /> Preferences
            <CommandShortcut>⌘,</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

/** ⌘K palette. The dialog carries the focus trap. */
export const Palette: Story = {
  render: function PaletteStory() {
    const [open, setOpen] = React.useState(false);
    React.useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          setOpen((o) => !o);
        }
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, []);
    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Open palette (⌘K)
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command" />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup heading="Actions">
              <CommandItem>Start service</CommandItem>
              <CommandItem>Stop service</CommandItem>
              <CommandItem>View logs</CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </>
    );
  },
};
