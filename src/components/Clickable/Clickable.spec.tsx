import { render, screen } from "@testing-library/react";

import { randomString } from "@/util/random";

import { Clickable } from "./Clickable";

describe("Clickable", () => {
  let elementId: string;

  beforeEach(() => {
    elementId = randomString();
  });

  it("should render with children", () => {
    const children = "test data";

    render(<Clickable data-testid={elementId}>{children}</Clickable>);

    const element = screen.getByTestId(elementId);
    expect(element).toBeInTheDocument();
    expect(element.innerHTML).toEqual(children);
  });
});
