import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  AnnotationEmptyArt,
  CommentsEmptyArt,
  EmptyArtColor,
  EmptyArtFrame,
  EmptyArtMotion,
  EmptyState,
  EvaluationEmptyArt,
  HistoryEmptyArt,
  ModelsEmptyArt,
  PanelEmptyArt,
  SearchEmptyArt,
  SimilarityEmptyArt,
} from "@voxel51/voodo";

const meta: Meta<typeof PanelEmptyArt> = {
  title: "Components/EmptyArt",
  component: PanelEmptyArt,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

type Story = StoryObj<typeof PanelEmptyArt>;

const ARTS = {
  Panel: PanelEmptyArt,
  Search: SearchEmptyArt,
  Comments: CommentsEmptyArt,
  History: HistoryEmptyArt,
  Similarity: SimilarityEmptyArt,
  Evaluation: EvaluationEmptyArt,
  Annotation: AnnotationEmptyArt,
  Models: ModelsEmptyArt,
};

export const Gallery: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-6">
      {Object.entries(ARTS).map(([name, Art]) => (
        <div key={name} className="w-[150px] text-center">
          <Art />
          <span className="text-caption">{name}</span>
        </div>
      ))}
    </div>
  ),
};

export const InEmptyState: Story = {
  render: () => (
    <div className="w-[480px]">
      <EmptyState
        art={<SearchEmptyArt />}
        title="Nothing matches yet"
        description="Widen the filters to see more runs."
      />
    </div>
  ),
};

/** An app's own art in the shared frame: a pin dropping onto a ground line. */
export const CustomArt: Story = {
  render: () => (
    <div className="w-[150px]">
      <EmptyArtFrame
        label="No locations yet"
        glow={{ cx: 80, cy: 58, rx: 58, ry: 40 }}
      >
        {() => (
          <>
            <path
              d="M40 80h80"
              stroke={EmptyArtColor.BorderStrong}
              strokeLinecap="round"
            />
            <g className={EmptyArtMotion.Drop}>
              <circle
                cx="80"
                cy="56"
                r="9"
                fill={EmptyArtColor.Card}
                stroke={EmptyArtColor.Accent}
              />
            </g>
          </>
        )}
      </EmptyArtFrame>
    </div>
  ),
};

export default meta;
