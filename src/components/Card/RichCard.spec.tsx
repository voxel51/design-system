import { render, screen } from "@testing-library/react";

import { RichCard } from "./RichCard";

const CONTENT = "Enter text to set a value";
const TITLE = "Card Title";

describe("RichCard", () => {
  it("should render RichCard with title and children provided", () => {
    render(<RichCard title={TITLE}>{CONTENT}</RichCard>);
    expect(screen.getByText(CONTENT)).toBeInTheDocument();
    expect(screen.getByText(TITLE)).toBeInTheDocument();
  });

  it("should render RichCard with only title provided", () => {
    render(<RichCard title={TITLE} />);
    expect(screen.getByText(TITLE)).toBeInTheDocument();
  });

  it("should render RichCard with only children provided", () => {
    render(<RichCard>{CONTENT}</RichCard>);
    expect(screen.getByText(CONTENT)).toBeInTheDocument();
  });

  it("should render RichCard with no title and no children", () => {
    render(<RichCard />);
    expect(screen.queryByText(TITLE)).not.toBeInTheDocument();
    expect(screen.queryByText(CONTENT)).not.toBeInTheDocument();
  });

  describe("badge-aware icon alignment", () => {
    it("top-aligns the icon block to the title when a badge is present", () => {
      const { container } = render(
        <RichCard title={TITLE} badge="New" icon={() => <svg />} />
      );

      const icon = container.querySelector("svg");
      expect(icon?.parentElement).toHaveClass("items-start");
      expect(icon?.parentElement).not.toHaveClass("items-center");
    });

    it("center-aligns the icon block to the title when no badge is present", () => {
      const { container } = render(
        <RichCard title={TITLE} icon={() => <svg />} />
      );

      const icon = container.querySelector("svg");
      expect(icon?.parentElement).toHaveClass("items-center");
      expect(icon?.parentElement).not.toHaveClass("items-start");
    });

    it("renders the badge text", () => {
      render(<RichCard title={TITLE} badge="New" />);
      expect(screen.getByText("New")).toBeInTheDocument();
    });
  });
});
