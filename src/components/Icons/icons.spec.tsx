import { render } from "@testing-library/react";

import { IconColor } from "@/types";
import { Size } from "@/types/size";

import { CheckIcon } from "./icons";

describe("generated icons", () => {
  it("should render an svg", () => {
    const { container } = render(<CheckIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  describe("size prop", () => {
    it("should set width and height when size is Sm", () => {
      const { container } = render(<CheckIcon size={Size.Sm} />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("width", "12");
      expect(svg).toHaveAttribute("height", "12");
    });

    it("should not set width and height when size is not provided", () => {
      const { container } = render(<CheckIcon />);
      const svg = container.querySelector("svg");
      expect(svg).not.toHaveAttribute("width");
      expect(svg).not.toHaveAttribute("height");
    });
  });

  describe("className prop", () => {
    it("should apply className to the svg element", () => {
      const customClass = "custom-icon-class";
      const { container } = render(<CheckIcon className={customClass} />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass(customClass);
    });
  });

  describe("color prop", () => {
    it("should apply the color class to the svg element", () => {
      const { container } = render(<CheckIcon color={IconColor.Failure} />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("text-content-icon-failure");
    });
  });

  describe("style prop", () => {
    it("should apply custom styles to the svg element", () => {
      const customStyle = { marginTop: "10px", opacity: "0.5" };
      const { container } = render(<CheckIcon style={customStyle} />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveStyle(customStyle);
    });
  });
});
