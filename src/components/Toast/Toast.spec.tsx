import { render, screen, within } from "@testing-library/react";

import { DummyIcon, makeChild, randomString } from "#/testing-utils";

import { Toast } from "./Toast";

describe("Toast", () => {
  let testId: string;
  let defaultProps: { "data-testid": string; open: boolean };

  beforeEach(() => {
    testId = randomString();
    defaultProps = { "data-testid": testId, open: true };
  });

  it("should render when open", () => {
    render(<Toast {...defaultProps} />);

    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });

  it("should not render when not open", () => {
    render(<Toast {...defaultProps} open={false} />);

    expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
  });

  it("should render an icon if provided", () => {
    render(<Toast {...defaultProps} icon={DummyIcon} />);

    const toast = screen.getByTestId(testId);
    const innerHtml = toast.innerHTML;
    expect(innerHtml).toContain("<svg");
  });

  it("should render a title", () => {
    const title = makeChild();
    const Title = title.data;
    render(<Toast {...defaultProps} title={<Title />} />);

    expect(
      within(screen.getByTestId(testId)).getByTestId(title.id)
    ).toBeInTheDocument();
  });

  it("should render a description", () => {
    const description = makeChild();
    const Description = description.data;
    render(<Toast {...defaultProps} description={<Description />} />);

    expect(
      within(screen.getByTestId(testId)).getByTestId(description.id)
    ).toBeInTheDocument();
  });

  it("should render actions", () => {
    const actions = makeChild();
    const Actions = actions.data;
    render(<Toast {...defaultProps} action={<Actions />} />);

    expect(
      within(screen.getByTestId(testId)).getByTestId(actions.id)
    ).toBeInTheDocument();
  });
});
