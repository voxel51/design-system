import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RichButton } from "@/components/RichButton/RichButton.tsx";
import { IconName } from "@/types";
import { randomString } from "@/util/random";

const DummyIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
      />
    </svg>
  );
};

describe("RichButton", () => {
  let testId: string;
  let defaultProps: { "data-testid": string };

  beforeEach(() => {
    testId = randomString();
    defaultProps = { "data-testid": testId };
  });

  it("should render", () => {
    render(<RichButton {...defaultProps} />);

    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });

  it("should render a provided FC icon", () => {
    render(<RichButton {...defaultProps} icon={DummyIcon} />);

    expect(screen.getByTestId(testId).innerHTML).toContain("<svg");
  });

  it("should render a provided string icon", () => {
    render(<RichButton {...defaultProps} icon={IconName.Add} />);

    expect(screen.getByTestId(testId).innerHTML).toContain("<svg");
  });

  it("should render a provided label", () => {
    const label = randomString();
    render(<RichButton {...defaultProps} label={label} />);

    expect(
      within(screen.getByTestId(testId)).getByText(label)
    ).toBeInTheDocument();
  });

  it("should render a provided description", () => {
    const description = randomString();
    render(<RichButton {...defaultProps} description={description} />);

    expect(
      within(screen.getByTestId(testId)).getByText(description)
    ).toBeInTheDocument();
  });

  it("should emit click events", async () => {
    const callback = jest.fn();
    render(<RichButton {...defaultProps} onClick={callback} />);

    const user = userEvent.setup();

    await user.click(screen.getByTestId(testId));

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should apply a background color when active", () => {
    render(<RichButton {...defaultProps} active />);

    expect(screen.getByTestId(testId).style.backgroundColor).toContain(
      "color-mix"
    );
  });

  it("should not apply a background color when inactive", () => {
    render(<RichButton {...defaultProps} />);

    expect(screen.getByTestId(testId).style.backgroundColor).toBe("");
  });

  it("should merge a caller-provided style with the active background", () => {
    render(<RichButton {...defaultProps} active style={{ margin: "4px" }} />);

    const el = screen.getByTestId(testId);
    expect(el.style.backgroundColor).toContain("color-mix");
    expect(el.style.margin).toBe("4px");
  });
});
