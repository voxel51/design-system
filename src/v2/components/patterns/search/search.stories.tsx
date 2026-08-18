import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import {
  NlResultBar,
  NlSuggestions,
  type NlResolution,
  type NlSuggestion,
} from "@voxel51/voodo/v2";

/**
 * Search — natural-language query interpretation.
 *
 * `NlResultBar` reads back what the agent understood and lets a clause be
 * removed; `NlSuggestions` lists prompts before a query is entered. The agent
 * itself stays in the application: these components render a resolution, they
 * do not produce one.
 */
const meta: Meta<typeof NlResultBar> = {
  title: "v2/Patterns/Search",
  component: NlResultBar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  decorators: [(Story) => <div className="w-[42rem]"><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof NlResultBar>;

const resolution: NlResolution = {
  query: "low confidence pedestrians at night",
  summary: "Filtering to pedestrian detections under 0.5 confidence on night samples.",
  kind: "filter",
  clauses: [
    { id: "c1", field: "label", operator: "is", value: "pedestrian", connector: "AND" },
    { id: "c2", field: "confidence", operator: "<", value: "0.5", connector: "AND" },
    { id: "c3", field: "tag", operator: "is", value: "night", connector: "AND" },
  ],
  confidence: 0.86,
};

export const Resolved: Story = {
  render: function ResolvedStory() {
    const [clauses, setClauses] = React.useState(resolution.clauses);
    return (
      <NlResultBar
        resolution={{ ...resolution, clauses }}
        resultCount={412}
        onRemoveClause={(id) => setClauses((c) => c.filter((x) => x.id !== id))}
      />
    );
  },
};

/** Under 0.7 the bar invites the user to refine rather than trusting it. */
export const LowConfidence: Story = {
  render: () => (
    <NlResultBar
      resolution={{ ...resolution, confidence: 0.42 }}
      resultCount={9}
      onRemoveClause={() => {}}
    />
  ),
};

/** A query that opens a panel alongside the results. */
export const OpensPanel: Story = {
  render: () => (
    <NlResultBar
      resolution={{
        ...resolution,
        kind: "panel",
        summary: "Showing embeddings for the current view.",
        panel: {
          id: "run-embeddings",
          label: "Embeddings",
          reason: "the ask is about visual similarity",
        },
      }}
      resultCount={12_480}
      onRemoveClause={() => {}}
    />
  ),
};

export const Thinking: Story = {
  render: () => (
    <NlResultBar thinking resolution={null} onRemoveClause={() => {}} />
  ),
};

const SUGGESTIONS: NlSuggestion[] = [
  { text: "low confidence detections", kind: "filter" },
  { text: "show me visually similar samples", kind: "panel", hint: "opens Embeddings" },
  { text: "sort by most recently modified", kind: "sort" },
  { text: "which classes are underrepresented?", kind: "insight" },
];

export const Suggestions: Story = {
  render: function SuggestionsStory() {
    const [active, setActive] = React.useState(0);
    return (
      <NlSuggestions
        suggestions={SUGGESTIONS}
        activeIndex={active}
        onHover={setActive}
        onSelect={() => {}}
      />
    );
  },
};
