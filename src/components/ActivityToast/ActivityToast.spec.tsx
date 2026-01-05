import { DummyIcon } from "#/testing-utils";
import { randomString } from "@/util/random";
import { render, screen, within } from "@testing-library/react";
import { ActivityToast } from "./ActivityToast";

describe("ActivityToast", () => {
  let testId: string;
  let defaultProps: { "data-testid": string; open: boolean };

  beforeEach(() => {
    testId = randomString();
    defaultProps = { "data-testid": testId, open: true };
  });

  it("should render when open", () => {
    render(<ActivityToast {...defaultProps} />);

    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });

  it("should not render when not open", () => {
    render(<ActivityToast {...defaultProps} open={false} />);

    expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
  });

  it("should render an icon if provided", () => {
    render(<ActivityToast {...defaultProps} icon={DummyIcon} />);

    const toast = screen.getByTestId(testId);
    const innerHtml = toast.innerHTML;
    expect(innerHtml).toContain("<svg");
  });

  it("should render a message", () => {
    const message = randomString();
    render(<ActivityToast {...defaultProps} message={message} />);

    expect(
      within(screen.getByTestId(testId)).getByText(message)
    ).toBeInTheDocument();
  });
});
