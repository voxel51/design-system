import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Modal, ModalSize } from "./Modal";

describe("Modal", () => {
  it("renders nothing when closed", () => {
    render(
      <Modal open={false} onClose={jest.fn()} title="Title">
        body
      </Modal>
    );

    expect(screen.queryByText("body")).not.toBeInTheDocument();
  });

  it("renders the title and children when open", () => {
    render(
      <Modal open onClose={jest.fn()} title="Title">
        body
      </Modal>
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("body")).toBeInTheDocument();
  });

  it("closes on the close button", async () => {
    const onClose = jest.fn();
    render(
      <Modal open onClose={onClose} title="Title">
        body
      </Modal>
    );

    await userEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape", async () => {
    const onClose = jest.fn();
    render(
      <Modal open onClose={onClose} title="Title">
        body
      </Modal>
    );

    await userEvent.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalled();
  });

  it("omits the close button when there is no title", () => {
    render(
      <Modal open onClose={jest.fn()} aria-label="Untitled">
        body
      </Modal>
    );

    expect(
      screen.queryByRole("button", { name: "Close" })
    ).not.toBeInTheDocument();
  });

  it("renders a close button without a title when asked", () => {
    render(
      <Modal open onClose={jest.fn()} showCloseButton aria-label="Untitled">
        body
      </Modal>
    );

    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("renders footer content", () => {
    render(
      <Modal
        open
        onClose={jest.fn()}
        title="Title"
        footer={<button>Save</button>}
      >
        body
      </Modal>
    );

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("applies the size cap to the panel", () => {
    render(
      <Modal open onClose={jest.fn()} title="Title" size={ModalSize.Lg}>
        body
      </Modal>
    );

    expect(screen.getByTestId("modal-panel")).toHaveClass("max-w-[800px]");
  });
});
