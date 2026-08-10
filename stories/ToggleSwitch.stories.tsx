import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Descriptor,
  DragHandleIcon,
  Heading,
  Icon,
  IconName,
  RichList,
  Size,
  Text,
  ToggleSwitch,
  ToggleSwitchTab,
  ToggleSwitchVariant,
} from "@voxel51/voodo";
import React from "react";
import { withContainer } from "./decorators/container";

const meta: Meta<typeof ToggleSwitch> = {
  title: "Components/ToggleSwitch",
  component: ToggleSwitch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md"],
      description: "The size of the tabs",
    },
    variant: {
      control: "select",
      options: Object.values(ToggleSwitchVariant),
      description: "The variant of the toggle switch",
    },
    fullWidth: {
      control: "boolean",
      description: "Whether the group should fill its container",
    },
    defaultIndex: {
      control: "number",
      description: "The index of the initially selected tab",
    },
    onChange: {
      action: "changed",
      description: "Callback fired when the selected tab changes",
    },
  },
  decorators: [withContainer()],
};

type Story = StoryObj<typeof ToggleSwitch>;

const basicTabs: Descriptor<ToggleSwitchTab>[] = [
  {
    id: "tab-1",
    data: {
      label: "Tab 1",
      content: (
        <div>
          <Text>
            Content for the FIRST tab - any react content can be placed here
          </Text>
        </div>
      ),
    },
  },
  {
    id: "tab-2",
    data: {
      label: "Tab 2",
      content: (
        <div>
          <Text>
            This is the content the SECOND tab. You can put any React content
            here.
          </Text>
        </div>
      ),
    },
  },
  {
    id: "tab-3",
    data: {
      label: "Tab 3",
      content: (
        <div>
          <Text>
            This is the content the THIRD tab. You can put any React content
            here.
          </Text>
        </div>
      ),
    },
  },
];

const iconTabs: Descriptor<ToggleSwitchTab>[] = [
  {
    id: "tab-1",
    data: {
      label: <Icon name={IconName.Add} />,
      content: (
        <div>
          <Text>Add content here</Text>
        </div>
      ),
    },
  },
  {
    id: "tab-2",
    data: {
      label: <Icon name={IconName.Edit} />,
      content: (
        <div>
          <Text>Edit content here</Text>
        </div>
      ),
    },
  },
  {
    id: "tab-3",
    data: {
      label: <Icon name={IconName.Delete} />,
      content: (
        <div>
          <Text>Delete content here</Text>
        </div>
      ),
    },
  },
  {
    id: "tab-4",
    data: {
      label: <DragHandleIcon />,
      content: (
        <div>
          <Text>Move content here</Text>
        </div>
      ),
    },
  },
];

export const Default: Story = {
  args: {
    tabs: basicTabs,
    defaultIndex: 0,
    size: Size.Sm,
  },
};

export const Full: Story = {
  args: {
    tabs: basicTabs,
    defaultIndex: 0,
    variant: ToggleSwitchVariant.Default,
    size: Size.Md,
    fullWidth: true,
  },
};

export const SoftToggle: Story = {
  args: {
    tabs: iconTabs,
    defaultIndex: 0,
    variant: ToggleSwitchVariant.Soft,
    size: Size.Md,
  },
};

export const Borderless: Story = {
  args: {
    tabs: basicTabs,
    defaultIndex: 0,
    variant: ToggleSwitchVariant.Borderless,
    size: Size.Md,
  },
};

export const ExtraSmall: Story = {
  args: {
    tabs: basicTabs,
    defaultIndex: 0,
    size: Size.Xs,
  },
};

export const Small: Story = {
  args: {
    tabs: basicTabs,
    defaultIndex: 0,
    size: Size.Sm,
  },
};

export const Medium: Story = {
  args: {
    tabs: basicTabs,
    defaultIndex: 0,
    size: Size.Md,
  },
};

export const DefaultSecondTab: Story = {
  args: {
    tabs: basicTabs,
    defaultIndex: 1,
    size: Size.Md,
  },
};

export const WithRichContent: Story = {
  args: {
    tabs: [
      {
        id: "tab-1",
        data: {
          label: "Overview",
          content: (
            <>
              <Heading>Overview</Heading>
              <Text>
                This tab contains rich content with multiple elements. You can
                include any React components, images, forms, or other
                interactive elements.
              </Text>
            </>
          ),
        },
      },
      {
        id: "tab-2",
        data: {
          label: "Details",
          content: (
            <>
              <Heading>Details</Heading>
              <Text>
                Here you can see more detailed information. The content area
                adapts to whatever you place inside it.
              </Text>
              <RichList
                listItems={[
                  {
                    id: "1",
                    data: {
                      primaryContent: <Text>First list item</Text>,
                      canSelect: true,
                    },
                  },
                  {
                    id: "2",
                    data: {
                      primaryContent: <Text>Second list item</Text>,
                      canSelect: true,
                    },
                  },
                  {
                    id: "3",
                    data: {
                      primaryContent: <Text>Third list item</Text>,
                      canSelect: true,
                    },
                  },
                ]}
              />
            </>
          ),
        },
      },
      {
        id: "tab-3",
        data: {
          label: "Settings",
          content: (
            <>
              <Heading>Settings</Heading>
              <Text>
                This tab could contain form elements, configuration options, or
                any other settings-related content.
              </Text>
            </>
          ),
        },
      },
    ],
    defaultIndex: 0,
    size: Size.Md,
  },
};

export const WithTwoTabs: Story = {
  args: {
    tabs: [
      {
        id: "tab-1",
        data: {
          label: "First",
          content: (
            <div>
              <Text>Content for the first tab in a two-tab toggle.</Text>
            </div>
          ),
        },
      },
      {
        id: "tab-2",
        data: {
          label: "Second",
          content: (
            <div>
              <Text>Content for the second tab in a two-tab toggle.</Text>
            </div>
          ),
        },
      },
    ],
    defaultIndex: 0,
    size: Size.Md,
  },
};

export const WithDisabledTab: Story = {
  args: {
    tabs: [
      {
        id: "tab-1",
        data: { label: "Active", content: <Text>This tab is active.</Text> },
      },
      {
        id: "tab-2",
        data: {
          label: "Disabled",
          content: <Text>You should not be able to see this.</Text>,
          disabled: true,
        },
      },
      {
        id: "tab-3",
        data: {
          label: "Also Active",
          content: <Text>This tab is also active.</Text>,
        },
      },
    ],
    defaultIndex: 0,
    size: Size.Md,
  },
};

export const WithTooltips: Story = {
  args: {
    tabs: [
      {
        id: "tab-1",
        data: {
          label: "Overview",
          content: <Text>Overview content</Text>,
          tooltip: <Text>View a summary of your data</Text>,
        },
      },
      {
        id: "tab-2",
        data: {
          label: "Details",
          content: <Text>Details content</Text>,
          tooltip: <Text>See detailed information</Text>,
        },
      },
      {
        id: "tab-3",
        data: {
          label: "Settings",
          content: <Text>Settings content</Text>,
          tooltip: <Text>Configure your preferences</Text>,
        },
      },
    ],
    defaultIndex: 0,
    size: Size.Md,
  },
};

export const WithDisabledAndTooltip: Story = {
  args: {
    tabs: [
      {
        id: "tab-1",
        data: {
          label: "Available",
          content: <Text>This feature is available.</Text>,
          tooltip: <Text>Click to view</Text>,
        },
      },
      {
        id: "tab-2",
        data: {
          label: "Coming Soon",
          content: <Text>You should not be able to see this.</Text>,
          disabled: true,
          tooltip: <Text>This feature is not yet available</Text>,
        },
      },
      {
        id: "tab-3",
        data: {
          label: "Also Available",
          content: <Text>This feature is also available.</Text>,
        },
      },
    ],
    defaultIndex: 0,
    size: Size.Md,
  },
};

export const WithManyTabs: Story = {
  args: {
    tabs: [
      {
        id: "tab-1",
        data: { label: "Tab 1", content: <Text>Content 1</Text> },
      },
      {
        id: "tab-2",
        data: { label: "Tab 2", content: <Text>Content 2</Text> },
      },
      {
        id: "tab-3",
        data: { label: "Tab 3", content: <Text>Content 3</Text> },
      },
      {
        id: "tab-4",
        data: { label: "Tab 4", content: <Text>Content 4</Text> },
      },
      {
        id: "tab-5",
        data: { label: "Tab 5", content: <Text>Content 5</Text> },
      },
      {
        id: "tab-6",
        data: { label: "Tab 6", content: <Text>Content 6</Text> },
      },
    ],
    defaultIndex: 0,
    size: Size.Md,
  },
};

export default meta;
