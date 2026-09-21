import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AddIcon } from "@/components/Icons";
import { randomString } from "@/util/random";

import { DummyIcon, makeChild } from "#/testing-utils";

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

  it("should render an FC icon if provided", () => {
    render(<Toast {...defaultProps} icon={DummyIcon} />);

    const toast = screen.getByTestId(testId);
    expect(toast.innerHTML).toContain("<svg");
  });

  it("should render a string icon if provided", () => {
    render(<Toast {...defaultProps} icon={AddIcon} />);

    const toast = screen.getByTestId(testId);
    expect(toast.innerHTML).toContain("<svg");
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

  describe("close control", () => {
    it("does not render a close control when onClose is omitted", () => {
      render(<Toast {...defaultProps} />);

      expect(
        within(screen.getByTestId(testId)).queryByRole("button", {
          name: "Close",
        })
      ).not.toBeInTheDocument();
    });

    it("renders a close control when onClose is provided", () => {
      render(<Toast {...defaultProps} onClose={jest.fn()} />);

      expect(
        within(screen.getByTestId(testId)).getByRole("button", {
          name: "Close",
        })
      ).toBeInTheDocument();
    });

    it("fires onClose when the close control is clicked", async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();
      render(<Toast {...defaultProps} onClose={onClose} />);

      await user.click(
        within(screen.getByTestId(testId)).getByRole("button", {
          name: "Close",
        })
      );

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("renders both the action and the close control together", () => {
      const actions = makeChild();
      const Actions = actions.data;
      render(
        <Toast {...defaultProps} action={<Actions />} onClose={jest.fn()} />
      );

      const toast = screen.getByTestId(testId);
      expect(within(toast).getByTestId(actions.id)).toBeInTheDocument();
      expect(
        within(toast).getByRole("button", { name: "Close" })
      ).toBeInTheDocument();
    });
  });

  describe("duration", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it("should close itself once the duration is up", () => {
      const onClose = jest.fn();
      render(<Toast {...defaultProps} duration={5000} onClose={onClose} />);

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should stay until closed when given no duration", () => {
      const onClose = jest.fn();
      render(<Toast {...defaultProps} onClose={onClose} />);

      act(() => {
        jest.advanceTimersByTime(60000);
      });

      expect(onClose).not.toHaveBeenCalled();
    });

    it("should not close while closed", () => {
      const onClose = jest.fn();
      render(
        <Toast
          {...defaultProps}
          duration={5000}
          onClose={onClose}
          open={false}
        />
      );

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(onClose).not.toHaveBeenCalled();
    });

    it("should hold while the pointer is over it", () => {
      const onClose = jest.fn();
      render(<Toast {...defaultProps} duration={5000} onClose={onClose} />);

      fireEvent.mouseEnter(screen.getByTestId(testId));
      act(() => {
        jest.advanceTimersByTime(60000);
      });

      expect(onClose).not.toHaveBeenCalled();
    });

    it("should start the wait over when the pointer leaves", () => {
      const onClose = jest.fn();
      render(<Toast {...defaultProps} duration={5000} onClose={onClose} />);

      fireEvent.mouseEnter(screen.getByTestId(testId));
      act(() => {
        jest.advanceTimersByTime(4000);
      });
      fireEvent.mouseLeave(screen.getByTestId(testId));
      act(() => {
        jest.advanceTimersByTime(4000);
      });

      expect(onClose).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should hold while focus is inside it", () => {
      const onClose = jest.fn();
      render(
        <Toast
          {...defaultProps}
          duration={5000}
          onClose={onClose}
          action={<button type="button">Undo</button>}
        />
      );

      fireEvent.focus(screen.getByRole("button", { name: "Undo" }));
      act(() => {
        jest.advanceTimersByTime(60000);
      });

      expect(onClose).not.toHaveBeenCalled();
    });

    it("should still call a caller's own pointer handlers", () => {
      const onMouseEnter = jest.fn();
      render(
        <Toast {...defaultProps} duration={5000} onMouseEnter={onMouseEnter} />
      );

      fireEvent.mouseEnter(screen.getByTestId(testId));

      expect(onMouseEnter).toHaveBeenCalledTimes(1);
    });
  });
});
