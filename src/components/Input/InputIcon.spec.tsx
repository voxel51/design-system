import { render } from "@testing-library/react";
import { type FC } from "react";

import { Size, TextColor, textColorClass } from "@/types";

import { CheckIcon, type IconProps } from "../Icons";

import { InputIcon } from "./InputIcon";

const CheckmarkIcon: FC<IconProps> = (props) => <CheckIcon {...props} />;

describe("InputIcon", () => {
  it("should render an FC icon", () => {
    const { container } = render(
      <InputIcon icon={CheckmarkIcon} size={Size.Md} />
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should render a generated icon component", () => {
    const { container } = render(<InputIcon icon={CheckIcon} size={Size.Md} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should apply correct styling when hasText is true", () => {
    const { container } = render(
      <InputIcon icon={CheckmarkIcon} size={Size.Md} hasText={true} />
    );
    const span = container.querySelector("span");
    expect(span).toHaveClass(textColorClass(TextColor.Primary));
    expect(span).not.toHaveClass(textColorClass(TextColor.Secondary));
  });

  it("should apply correct styling when hasText is false", () => {
    const { container } = render(
      <InputIcon icon={CheckmarkIcon} size={Size.Md} hasText={false} />
    );
    const span = container.querySelector("span");
    expect(span).toHaveClass(textColorClass(TextColor.Secondary));
    expect(span).not.toHaveClass(textColorClass(TextColor.Primary));
  });
});
