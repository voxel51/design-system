import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  ClarifyChoiceCard,
  ClarifySlotsCard,
  ConfirmActionCard,
  ErrorCard,
  PlanPreviewCard,
  SuggestionsRow,
} from "@voxel51/voodo/v2";

/**
 * Agent — the cards an assistant renders into a conversation when it needs
 * something from the user: a clarification, approval before acting, an error
 * it can fix, a plan to preview, or follow-up prompts.
 *
 * Each card is driven by a `*Data` object and reports back through a single
 * callback carrying the card id, so a transcript can be replayed from a log.
 *
 * The only group that ported with no application coupling at all.
 */
const meta: Meta<typeof ConfirmActionCard> = {
  title: "v2/Patterns/Agent",
  component: ConfirmActionCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  decorators: [(Story) => <div className="w-[32rem]"><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof ConfirmActionCard>;

/** Approval before a destructive or expensive action. */
export const ConfirmAction: Story = {
  render: () => (
    <ConfirmActionCard
      card={{
        id: "c1",
        title: "Delete 412 samples from berkeley-drive?",
        description: "They match the current filter. This cannot be undone.",
        approveLabel: "Delete samples",
        showModify: true,
        tone: "warning",
      }}
      onDecide={() => {}}
    />
  ),
};

/** Single or multi-select clarification. */
export const ClarifyChoice: Story = {
  render: () => (
    <ClarifyChoiceCard
      card={{
        id: "c2",
        question: "Which split should I train on?",
        helper: "You have three saved views that look like training splits.",
        options: [
          { value: "train", label: "train-split", description: "9,840 samples" },
          { value: "hard", label: "hard-negatives", description: "1,204 samples" },
          { value: "all", label: "Entire dataset", description: "12,480 samples" },
        ],
      }}
      onAnswer={() => {}}
      onSkip={() => {}}
    />
  ),
};

/** Several fields at once, rather than a back-and-forth. */
export const ClarifySlots: Story = {
  render: () => (
    <ClarifySlotsCard
      card={{
        id: "c3",
        title: "A few details before I start the run",
        fields: [
          {
            key: "model",
            label: "Base model",
            type: "select",
            options: [
              { value: "yolov8n", label: "YOLOv8n" },
              { value: "yolov8s", label: "YOLOv8s" },
            ],
            defaultValue: "yolov8n",
          },
          {
            key: "epochs",
            label: "Epochs",
            type: "select",
            options: [
              { value: "50", label: "50" },
              { value: "100", label: "100" },
            ],
            defaultValue: "50",
            hint: "More epochs, longer run.",
          },
        ],
        primaryLabel: "Start training",
      }}
      onSubmit={() => {}}
      onCancel={() => {}}
    />
  ),
};

/** Steps reveal in sequence; `preRevealed` shows them all at once. */
export const PlanPreview: Story = {
  render: () => (
    <PlanPreviewCard
      card={{
        id: "c4",
        title: "Here is what I will do",
        preRevealed: true,
        steps: [
          { label: "Filter to pedestrian detections", detail: "confidence < 0.5" },
          { label: "Sample 500 for review" },
          { label: "Send to the annotation queue", detail: "assigned to you" },
        ],
      }}
    />
  ),
};

/** An error the agent can act on, rather than a dead end. */
export const Error: Story = {
  render: () => (
    <ErrorCard
      card={{
        id: "c5",
        title: "Training run failed",
        summary: "The GPU pool had no capacity when the run started.",
        fixLabel: "Retry on the shared pool",
        fixHint: "Adds it to the queue behind two other runs.",
        details: { code: "RESOURCE_EXHAUSTED" },
      }}
      onFix={() => {}}
    />
  ),
};

export const Suggestions: Story = {
  render: () => (
    <SuggestionsRow
      data={{
        id: "c6",
        label: "Try next",
        suggestions: [
          "Find near-duplicates",
          "Compare against ground truth",
          "Tag these for review",
        ],
      }}
      onSelect={() => {}}
    />
  ),
};
