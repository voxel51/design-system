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
});
