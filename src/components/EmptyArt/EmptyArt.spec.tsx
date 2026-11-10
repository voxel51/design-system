import { render, screen } from "@testing-library/react";

import {
  AnnotationEmptyArt,
  CommentsEmptyArt,
  EmptyArtColor,
  EmptyArtFrame,
  EmptyArtMotion,
  EvaluationEmptyArt,
  HistoryEmptyArt,
  ModelsEmptyArt,
  PanelEmptyArt,
  SearchEmptyArt,
  SimilarityEmptyArt,
} from "./EmptyArt";

describe("EmptyArt", () => {
  it.each([
    [CommentsEmptyArt, "No comments yet"],
    [HistoryEmptyArt, "No history yet"],
    [SearchEmptyArt, "No results"],
    [SimilarityEmptyArt, "No similarity index yet"],
    [EvaluationEmptyArt, "No evaluations yet"],
    [PanelEmptyArt, "Nothing here yet"],
    [AnnotationEmptyArt, "No annotations yet"],
    [ModelsEmptyArt, "No models yet"],
  ])("should render %p labelled %s", (Art, label) => {
    render(<Art />);
    expect(screen.getByRole("img", { name: label })).toBeInTheDocument();
  });

  it("should give each instance its own gradient id", () => {
    const { container } = render(
      <>
        <PanelEmptyArt />
        <PanelEmptyArt />
      </>
    );
    const ids = [...container.querySelectorAll("radialGradient")].map(
      (g) => g.id
    );
    expect(new Set(ids).size).toBe(2);
  });

  it("frames an app's own art with the glow and motion classes", () => {
    render(
      <EmptyArtFrame
        label="No locations yet"
        glow={{ cx: 80, cy: 58, rx: 58, ry: 40 }}
      >
        {(id) => (
          <circle
            data-testid={id}
            cx="80"
            cy="56"
            r="8"
            stroke={EmptyArtColor.Accent}
            className={EmptyArtMotion.Drop}
          />
        )}
      </EmptyArtFrame>
    );
    const art = screen.getByRole("img", { name: "No locations yet" });
    expect(art.querySelector("radialGradient")).not.toBeNull();
    expect(art.querySelector("circle")).toHaveClass(EmptyArtMotion.Drop);
  });
});
