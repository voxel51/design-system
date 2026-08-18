import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { ViewPicker, decodeSplitSource, encodeSplitSource } from "@voxel51/voodo/v2";

/**
 * Grouped select for choosing a view or sample tag as a dataset split source:
 * Current view, Entire dataset, saved views, sample tags.
 *
 * Encoded value: `current-view`, `entire`, `view:<id>`, `tag:<id>`, and
 * `none` when `allowNone` is set. `encodeSplitSource` and
 * `decodeSplitSource` convert between that string and a `SplitSource`;
 * decoding needs a sample-count fallback because the picker knows which view
 * is selected, not how large it is.
 *
 * `views` and `sampleTags` are props — the Lovable master reads them from a
 * mocks module, which a design system cannot do.
 */
const meta: Meta<typeof ViewPicker> = {
  title: "v2/Components/ViewPicker",
  component: ViewPicker,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  decorators: [(Story) => <div className="w-72"><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof ViewPicker>;

const VIEWS = [
  { id: "train-split", label: "train-split" },
  { id: "hard-negatives", label: "hard-negatives" },
];
const TAGS = [
  { id: "reviewed", label: "reviewed" },
  { id: "golden", label: "golden" },
];

export const Default: Story = {
  render: function DefaultStory() {
    const [value, setValue] = React.useState("current-view");
    return (
      <ViewPicker value={value} onValueChange={setValue} views={VIEWS} sampleTags={TAGS} />
    );
  },
};

/** With no views or tags supplied, only the two built-in options show. */
export const NoSavedViews: Story = {
  render: function NoSavedViewsStory() {
    const [value, setValue] = React.useState("entire");
    return <ViewPicker value={value} onValueChange={setValue} />;
  },
};

/** Optional splits (val / test) allow `(none)`. */
export const Optional: Story = {
  render: function OptionalStory() {
    const [value, setValue] = React.useState("none");
    return (
      <ViewPicker value={value} onValueChange={setValue} allowNone views={VIEWS} />
    );
  },
};

/** Round-trip through the encode/decode helpers. */
export const EncodeDecode: Story = {
  render: function EncodeDecodeStory() {
    const [value, setValue] = React.useState("view:train-split");
    const decoded = decodeSplitSource(value, 12480);
    return (
      <div className="flex flex-col gap-3">
        <ViewPicker value={value} onValueChange={setValue} views={VIEWS} sampleTags={TAGS} />
        <pre className="rounded-md bg-card-2 p-3 font-mono text-caption text-secondary-foreground">
          {JSON.stringify(decoded, null, 2)}
        </pre>
        <p className="text-caption text-tertiary-foreground">
          re-encoded: {encodeSplitSource(decoded)}
        </p>
      </div>
    );
  },
};
