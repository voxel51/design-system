import { Size } from "@/types";
import { render } from "@testing-library/react";
import { CheckmarkIcon } from "../Icons/Checkmark";
import { InputIcon } from "./InputIcon";

describe("InputIcon", () => {
  it("should render the icon", () => {
    const { container } = render(
      <InputIcon Icon={CheckmarkIcon} size={Size.Md} />
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should apply text-content-text-primary when hasText is true", () => {
    const { container } = render(
      <InputIcon Icon={CheckmarkIcon} size={Size.Md} hasText={true} />
    );
    const span = container.querySelector("span");
    expect(span).toHaveClass("text-content-text-primary");
    expect(span).not.toHaveClass("text-content-text-secondary");
  });

  it("should apply text-content-text-secondary when hasText is false", () => {
    const { container } = render(
      <InputIcon Icon={CheckmarkIcon} size={Size.Md} hasText={false} />
    );
    const span = container.querySelector("span");
    expect(span).toHaveClass("text-content-text-secondary");
    expect(span).not.toHaveClass("text-content-text-primary");
  });
});
