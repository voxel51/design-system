import { render, screen } from "@testing-library/react";
import { Heading, HeadingVariant } from "./Heading";

const headingVariants: HeadingVariant[] = ["h1", "h2", "h3", "h4"];

describe("Heading", () => {
  const headingText = "some heading";

  it("should render with text", () => {
    render(<Heading>{headingText}</Heading>);
    const element = screen.getByRole("heading");
    expect(element).toBeInTheDocument();
    expect(element.innerHTML).toBe(headingText);
  });

  headingVariants.forEach((variant) =>
    describe(variant, () => {
      it("should render with the correct DOM node", () => {
        render(<Heading variant={variant}>{headingText}</Heading>);
        const element = screen.getByRole("heading");
        expect(element).toBeInTheDocument();
        expect(element.innerHTML).toBe(headingText);
        expect(element.nodeName.toLowerCase()).toBe(variant);
      });
    })
  );
});
