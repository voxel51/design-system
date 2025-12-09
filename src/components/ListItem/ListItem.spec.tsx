import { render, screen } from "@testing-library/react";
import { ListItem } from "./ListItem";

describe("ListItem", () => {
  let elementId: string;

  beforeEach(() => {
    elementId = Math.random().toString(36).substring(2, 9);
  });

  it("should render", () => {
    render(<ListItem data-testid={elementId} />);

    const element = screen.getByTestId(elementId);
    expect(element).toBeInTheDocument();
  });
});
