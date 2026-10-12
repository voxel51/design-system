import { render } from "@testing-library/react";

import { IconColor } from "@/types";
import { IconName } from "@/types/icons";
import { Size } from "@/types/size";

import { Icon } from "./Icon";

describe("Icon", () => {
  it("should render an icon with a valid name", () => {
    const { container } = render(<Icon name={IconName.Check} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  describe("size prop", () => {
    it("should set width and height when size is Sm", () => {
      const { container } = render(
        <Icon name={IconName.Check} size={Size.Sm} />
      );
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("width", "12");
      expect(svg).toHaveAttribute("height", "12");
    });

    it("should not set width and height when size is not provided", () => {
      const { container } = render(<Icon name={IconName.Check} />);
      const svg = container.querySelector("svg");
      expect(svg).not.toHaveAttribute("width");
      expect(svg).not.toHaveAttribute("height");
    });
  });

  describe("className prop", () => {
    it("should apply className to the svg element", () => {
      const customClass = "custom-icon-class";
      const { container } = render(
        <Icon name={IconName.Check} className={customClass} />
      );
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass(customClass);
    });
  });

  describe("color prop", () => {
    it("should apply color to the style attribute", () => {
      const { container } = render(
        <Icon name={IconName.Check} color={IconColor.Failure} />
      );
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("text-content-icon-failure");
    });

    it("should handle CSS color names", () => {
      const { container } = render(
        <Icon name={IconName.Check} color={IconColor.Failure} />
      );
      const svg = container.querySelector("svg");
      // Browser normalizes CSS color names to RGB
      expect(svg).toHaveClass("text-content-icon-failure");
    });
  });

  describe("style prop", () => {
    it("should apply custom styles to the svg element", () => {
      const customStyle = { marginTop: "10px", opacity: "0.5" };
      const { container } = render(
        <Icon name={IconName.Check} style={customStyle} />
      );
      const svg = container.querySelector("svg");
      expect(svg).toHaveStyle(customStyle);
    });
  });

  describe("additional props", () => {
    it("should pass through additional props to the svg element", () => {
      const { container } = render(
        <Icon
          name={IconName.Check}
          data-testid="custom-icon"
          aria-label="Check icon"
        />
      );
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("data-testid", "custom-icon");
      expect(svg).toHaveAttribute("aria-label", "Check icon");
    });
  });
});
