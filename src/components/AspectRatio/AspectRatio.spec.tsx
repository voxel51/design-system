import { render, screen } from "@testing-library/react";

import { AspectRatio } from "./AspectRatio";

describe("AspectRatio", () => {
  it("should render children", () => {
    render(
      <AspectRatio>
        <img src="test.jpg" alt="test" />
      </AspectRatio>
    );
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("should apply the correct padding-bottom for a 16:9 ratio", () => {
    const { container } = render(
      <AspectRatio ratio={16 / 9} data-testid="ar" />
    );
    const outer = container.firstChild as HTMLElement;
    // 1 / (16/9) * 100 = 56.25%
    expect(outer.style.paddingBottom).toBe("56.25%");
  });

  it("should apply the correct padding-bottom for a 1:1 ratio", () => {
    const { container } = render(<AspectRatio ratio={1} />);
    const outer = container.firstChild as HTMLElement;
    expect(outer.style.paddingBottom).toBe("100%");
  });

  it("should apply the correct padding-bottom for a 4:3 ratio", () => {
    const { container } = render(<AspectRatio ratio={4 / 3} />);
    const outer = container.firstChild as HTMLElement;
    // 1 / (4/3) * 100 = 75%
    expect(outer.style.paddingBottom).toBe("75%");
  });

  it("should default to a 1:1 ratio when no ratio is provided", () => {
    const { container } = render(<AspectRatio />);
    const outer = container.firstChild as HTMLElement;
    expect(outer.style.paddingBottom).toBe("100%");
  });

  it("should pass through additional props", () => {
    render(<AspectRatio data-testid="aspect-ratio-test" ratio={1} />);
    expect(screen.getByTestId("aspect-ratio-test")).toBeInTheDocument();
  });

  it("should merge additional style props with the ratio style", () => {
    const { container } = render(
      <AspectRatio ratio={16 / 9} style={{ backgroundColor: "red" }} />
    );
    const outer = container.firstChild as HTMLElement;
    expect(outer.style.paddingBottom).toBe("56.25%");
    expect(outer.style.backgroundColor).toBe("red");
  });

  it("should apply className to the outer container", () => {
    render(<AspectRatio ratio={1} className="custom-class" />);
    expect(document.querySelector(".custom-class")).toBeInTheDocument();
  });

  it("should absolutely position children inside the container", () => {
    render(
      <AspectRatio ratio={1}>
        <div data-testid="child" />
      </AspectRatio>
    );
    const innerWrapper = screen.getByTestId("child").parentElement;
    expect(innerWrapper).toHaveClass("absolute", "inset-0");
  });
});
