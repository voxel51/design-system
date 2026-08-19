import type { Meta, StoryObj } from "@storybook/react";
import { LogOut, Settings, Sun } from "lucide-react";

import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { UserMenu, UserMenuIdentity } from "./UserMenu";

const meta = {
  title: "v2/Chrome/UserMenu",
  component: UserMenu,
  parameters: { layout: "centered" },
} satisfies Meta<typeof UserMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <UserMenuIdentity name="Sam Rivera" detail="sam@voxel51.com" />
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Settings />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Sun />
          Switch to light theme
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </>
    ),
  },
};

/** Initials stand in when there is no avatar image. */
export const WithInitials: Story = {
  args: {
    ...Default.args,
    avatar: (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-card-elevated text-meta text-foreground">
        SR
      </span>
    ),
  },
};

/** A photo fills the pill; the chevron still marks it as interactive. */
export const WithPhoto: Story = {
  args: {
    ...Default.args,
    avatar: (
      <img
        src="https://i.pravatar.cc/48?img=12"
        alt=""
        className="h-6 w-6 rounded-full object-cover"
      />
    ),
  },
};
