import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Button,
  StatusIndicator,
  getRetryAction,
  getRevertAction,
  useStatusIndicator,
} from "@voxel51/voodo/v2";

/**
 * Fixed-position status toast for long-running actions. Processing and
 * success render compact; error and offline expand with a title, description
 * and actions.
 *
 * `getRetryAction` and `getRevertAction` build the two standard buttons.
 * `reportToSaveDot` routes processing/success into the global save dot
 * instead, leaving only errors as toasts — use it on annotation editors,
 * where saves are constant.
 */
const meta: Meta<typeof StatusIndicator> = {
  title: "v2/Components/StatusIndicator",
  component: StatusIndicator,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    state: {
      control: "select",
      options: ["idle", "processing", "success", "error", "offline"],
    },
    position: {
      control: "select",
      options: ["bottom-left", "bottom-right", "bottom-center"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof StatusIndicator>;

export const Processing: Story = { args: { state: "processing" } };
export const Success: Story = { args: { state: "success" } };
export const Offline: Story = { args: { state: "offline" } };

export const ErrorWithActions: Story = {
  args: {
    state: "error",
    actions: [getRetryAction(() => {}), getRevertAction(() => {})],
  },
};

/** `useStatusIndicator` holds the state for you. */
export const Driven: Story = {
  render: function DrivenStory() {
    const s = useStatusIndicator();
    return (
      <>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={s.startProcessing}>Processing</Button>
          <Button variant="secondary" onClick={s.setSuccess}>Success</Button>
          <Button variant="secondary" onClick={s.setError}>Error</Button>
          <Button variant="secondary" onClick={s.setOffline}>Offline</Button>
          <Button variant="secondary" onClick={s.reset}>Reset</Button>
        </div>
        <StatusIndicator
          state={s.state}
          onDismiss={s.reset}
          actions={[getRetryAction(s.startProcessing)]}
        />
      </>
    );
  },
};
