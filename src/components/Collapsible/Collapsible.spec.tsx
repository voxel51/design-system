import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { Collapsible } from "./index";
import type { CollapsibleState } from "./index";

function getState(header: jest.Mock): CollapsibleState {
  const calls = header.mock.calls as CollapsibleState[][];
  return calls[calls.length - 1][0];
}

describe("Collapsible", () => {
  describe("rendering", () => {
    it("renders children", () => {
      render(<Collapsible>content</Collapsible>);
      expect(screen.getByText("content")).toBeInTheDocument();
    });

    it("renders header via render prop", () => {
      render(
        <Collapsible header={() => <div>my header</div>}>content</Collapsible>
      );
      expect(screen.getByText("my header")).toBeInTheDocument();
    });

    it("passes open and toggle to header render prop", () => {
      const header = jest.fn(() => null);
      render(<Collapsible header={header}>content</Collapsible>);
      const state = getState(header);
      expect(state.open).toBe(true);
      expect(typeof state.toggle).toBe("function");
    });

    it("renders without a header", () => {
      render(<Collapsible>content</Collapsible>);
      expect(screen.getByText("content")).toBeInTheDocument();
    });

    it("applies className to root", () => {
      const { container } = render(
        <Collapsible className="custom">content</Collapsible>
      );
      expect(container.firstChild).toHaveClass("custom");
    });

    it("applies style to root", () => {
      const { container } = render(
        <Collapsible style={{ color: "red" }}>content</Collapsible>
      );
      expect(container.firstChild).toHaveStyle({ color: "rgb(255, 0, 0)" });
    });
  });

  describe("uncontrolled open state", () => {
    it("is open by default", () => {
      const header = jest.fn(() => null);
      render(<Collapsible header={header}>content</Collapsible>);
      expect(getState(header).open).toBe(true);
    });

    it("respects defaultOpen=false", () => {
      const header = jest.fn(() => null);
      render(
        <Collapsible defaultOpen={false} header={header}>
          content
        </Collapsible>
      );
      expect(getState(header).open).toBe(false);
    });

    it("toggles to closed when toggle is called while open", () => {
      const header = jest.fn(() => null);
      render(
        <Collapsible defaultOpen={true} header={header}>
          content
        </Collapsible>
      );
      act(() => {
        getState(header).toggle();
      });
      expect(getState(header).open).toBe(false);
    });

    it("toggles to open when toggle is called while closed", () => {
      const header = jest.fn(() => null);
      render(
        <Collapsible defaultOpen={false} header={header}>
          content
        </Collapsible>
      );
      act(() => {
        getState(header).toggle();
      });
      expect(getState(header).open).toBe(true);
    });
  });

  describe("controlled open state", () => {
    it("reflects controlled open=true", () => {
      const header = jest.fn(() => null);
      render(
        <Collapsible open={true} header={header}>
          content
        </Collapsible>
      );
      expect(getState(header).open).toBe(true);
    });

    it("reflects controlled open=false", () => {
      const header = jest.fn(() => null);
      render(
        <Collapsible open={false} header={header}>
          content
        </Collapsible>
      );
      expect(getState(header).open).toBe(false);
    });

    it("does not change internal state when toggle is called in controlled mode", () => {
      const header = jest.fn(() => null);
      render(
        <Collapsible open={false} header={header}>
          content
        </Collapsible>
      );
      act(() => {
        getState(header).toggle();
      });
      expect(getState(header).open).toBe(false);
    });

    it("calls onOpenChange when toggle is called", () => {
      const onOpenChange = jest.fn();
      const header = jest.fn(() => null);
      render(
        <Collapsible open={true} onOpenChange={onOpenChange} header={header}>
          content
        </Collapsible>
      );
      act(() => {
        getState(header).toggle();
      });
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe("animated mode", () => {
    it("wraps content in animated container by default", () => {
      const { container } = render(<Collapsible>content</Collapsible>);
      expect(container.querySelector("[class*='content']")).toBeInTheDocument();
    });

    it("adds open class when open", () => {
      const { container } = render(
        <Collapsible defaultOpen={true}>content</Collapsible>
      );
      expect(
        container.querySelector("[class*='contentOpen']")
      ).toBeInTheDocument();
    });

    it("does not add open class when closed", () => {
      const { container } = render(
        <Collapsible defaultOpen={false}>content</Collapsible>
      );
      expect(
        container.querySelector("[class*='contentOpen']")
      ).not.toBeInTheDocument();
    });
  });

  describe("animated=false", () => {
    it("renders children directly without animated wrapper", () => {
      const { container } = render(
        <Collapsible animated={false}>
          <span>raw child</span>
        </Collapsible>
      );
      expect(container.querySelector("[class*='content']")).not.toBeInTheDocument();
      expect(screen.getByText("raw child")).toBeInTheDocument();
    });

    it("hides children when closed", () => {
      render(
        <Collapsible animated={false} defaultOpen={false}>
          <span>raw child</span>
        </Collapsible>
      );
      expect(screen.queryByText("raw child")).not.toBeInTheDocument();
    });

    it("shows children when open and hides them when closed via toggle", async () => {
      const user = userEvent.setup();
      render(
        <Collapsible
          animated={false}
          defaultOpen
          header={(state) => (
            <button onClick={state.toggle}>toggle</button>
          )}
        >
          <span>raw child</span>
        </Collapsible>
      );
      expect(screen.getByText("raw child")).toBeInTheDocument();
      await user.click(screen.getByRole("button"));
      expect(screen.queryByText("raw child")).not.toBeInTheDocument();
    });
  });
});
