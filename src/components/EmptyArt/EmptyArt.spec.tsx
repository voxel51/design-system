import { render, screen } from "@testing-library/react";

import {
  AnnotationEmptyArt,
  CommentsEmptyArt,
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
});
