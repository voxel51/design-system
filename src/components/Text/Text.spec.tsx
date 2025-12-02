import { render, screen } from "@testing-library/react";
import { Text } from "./Text";

describe("Text", () => {
  it("should render with text", () => {
    const text = "some text here";
    render(<Text>{text}</Text>);
    expect(screen.getByText(text)).toBeInTheDocument();
  });
});
