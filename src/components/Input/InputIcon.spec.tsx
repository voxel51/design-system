import { render } from "@testing-library/react";
import { type FC } from "react";

import { Size, TextColor, textColorClass } from "@/types";
import { IconName } from "@/types/icons";

import { Icon } from "../Icons/Icon";
import { IconProps } from "../Icons/types";

import { InputIcon } from "./InputIcon";

const CheckmarkIcon: FC<IconProps> = (props) => (
  <Icon name={IconName.Check} {...(props as any)} />
);

describe("InputIcon", () => {
  it("should render the icon", () => {
    const { container } = render(
      <InputIcon Icon={CheckmarkIcon} size={Size.Md} />
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should apply correct styling when hasText is true", () => {
    const { container } = render(
      <InputIcon Icon={CheckmarkIcon} size={Size.Md} hasText={true} />
    );
    const span = container.querySelector("span");
    expect(span).toHaveClass(textColorClass(TextColor.Primary));
    expect(span).not.toHaveClass(textColorClass(TextColor.Secondary));
  });

  it("should apply correct styling when hasText is false", () => {
    const { container } = render(
      <InputIcon Icon={CheckmarkIcon} size={Size.Md} hasText={false} />
    );
    const span = container.querySelector("span");
    expect(span).toHaveClass(textColorClass(TextColor.Secondary));
    expect(span).not.toHaveClass(textColorClass(TextColor.Primary));
  });
});
