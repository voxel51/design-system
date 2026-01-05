import { render, screen } from "@testing-library/react";

import HeadingLevel from "@/types/heading";

import { Heading } from "./Heading";

describe("Heading", () => {
  const headingText = "some heading";

  it("should render with text", () => {
    render(<Heading>{headingText}</Heading>);
    const element = screen.getByRole("heading");
    expect(element).toBeInTheDocument();
    expect(element.innerHTML).toBe(headingText);
  });

  Object.values(HeadingLevel).forEach((level) =>
    describe(level, () => {
      it("should render with the correct DOM node", () => {
        render(<Heading level={level}>{headingText}</Heading>);
        const element = screen.getByRole("heading");
        expect(element).toBeInTheDocument();
        expect(element.innerHTML).toBe(headingText);
        expect(element.nodeName.toLowerCase()).toBe(level);
      });
    })
  );
});
