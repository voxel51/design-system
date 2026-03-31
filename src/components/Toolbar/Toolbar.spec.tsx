/**
 * Copyright 2017-2026, Voxel51, Inc.
 */

import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { Orientation } from "@/types";

import { Toolbar } from "./Toolbar";
import { ToolbarAction } from "./ToolbarAction";
import { ToolbarGroup } from "./ToolbarGroup";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TestIcon = () => <svg data-testid="icon" />;

function renderToolbar(
  props: Partial<React.ComponentProps<typeof Toolbar>> = {}
) {
  return render(
    <Toolbar aria-label="Test toolbar" {...props}>
      <ToolbarGroup>
        <ToolbarAction aria-label="Action 1">
          <TestIcon />
        </ToolbarAction>
      </ToolbarGroup>
    </Toolbar>
  );
}

// ---------------------------------------------------------------------------
// Toolbar
// ---------------------------------------------------------------------------

describe("Toolbar", () => {
  it("renders with role='toolbar'", () => {
    renderToolbar();
    expect(screen.getByRole("toolbar")).toBeInTheDocument();
  });

  it("forwards aria-label to the toolbar element", () => {
    renderToolbar({ "aria-label": "My Toolbar" });
    expect(
      screen.getByRole("toolbar", { name: "My Toolbar" })
    ).toBeInTheDocument();
  });

  it("renders children", () => {
    renderToolbar();
    expect(
      screen.getByRole("button", { name: "Action 1" })
    ).toBeInTheDocument();
  });

  it("returns null when visible=false", () => {
    renderToolbar({ visible: false });
    expect(screen.queryByRole("toolbar")).not.toBeInTheDocument();
  });

  it("renders with vertical aria-orientation by default (column orientation)", () => {
    renderToolbar();
    expect(screen.getByRole("toolbar")).toHaveAttribute(
      "aria-orientation",
      "vertical"
    );
  });

  it("renders with horizontal aria-orientation when orientation=Row", () => {
    renderToolbar({ orientation: Orientation.Row });
    expect(screen.getByRole("toolbar")).toHaveAttribute(
      "aria-orientation",
      "horizontal"
    );
  });

  it("renders a drag handle when dragging is not locked", () => {
    renderToolbar();
    // The toolbar should have 2 children: drag handle div + Stack wrapper
    expect(screen.getByRole("toolbar").children).toHaveLength(2);
  });

  it("hides the drag handle when both lockX and lockY are true", () => {
    renderToolbar({ lockX: true, lockY: true });
    // With canDrag=false no drag handle div is rendered; only the Stack child subtree remains
    const toolbar = screen.getByRole("toolbar");
    // Confirm no mousedown handler on a sibling div (drag handle absent)
    // The toolbar should only contain the Stack wrapper (first child)
    expect(toolbar.children).toHaveLength(1);
  });

  it("collapses content on double-click of the drag handle", () => {
    renderToolbar();
    const toolbar = screen.getByRole("toolbar");
    // The drag handle is the first child div
    const dragHandle = toolbar.firstChild as HTMLElement;
    expect(
      screen.getByRole("button", { name: "Action 1" })
    ).toBeInTheDocument();
    fireEvent.doubleClick(dragHandle);
    expect(
      screen.queryByRole("button", { name: "Action 1" })
    ).not.toBeInTheDocument();
  });

  it("expands again after a second double-click on the drag handle", () => {
    renderToolbar();
    const toolbar = screen.getByRole("toolbar");
    const dragHandle = toolbar.firstChild as HTMLElement;
    fireEvent.doubleClick(dragHandle);
    fireEvent.doubleClick(dragHandle);
    expect(
      screen.getByRole("button", { name: "Action 1" })
    ).toBeInTheDocument();
  });

  it("applies custom className to the container", () => {
    renderToolbar({ className: "my-custom-class" });
    expect(screen.getByRole("toolbar")).toHaveClass("my-custom-class");
  });

  it("applies custom inline style to the container", () => {
    renderToolbar({ style: { opacity: 0.5 } });
    expect(screen.getByRole("toolbar")).toHaveStyle({ opacity: "0.5" });
  });

  it("sets initial position from xOffset and yOffset props", () => {
    renderToolbar({ xOffset: 50, yOffset: 100 });
    const toolbar = screen.getByRole("toolbar");
    expect(toolbar).toHaveStyle({ left: "50px", top: "100px" });
  });

  it("renders into document.body via portal when portal=true", () => {
    const { unmount } = renderToolbar({ portal: true });
    // The toolbar should be present somewhere in the document
    expect(document.body.querySelector('[role="toolbar"]')).toBeInTheDocument();
    unmount();
  });

  it("stops propagation of click events", () => {
    const parentClick = jest.fn();
    render(
      <div onClick={parentClick}>
        <Toolbar aria-label="Test toolbar">
          <ToolbarGroup>
            <ToolbarAction aria-label="Action">
              <TestIcon />
            </ToolbarAction>
          </ToolbarGroup>
        </Toolbar>
      </div>
    );
    fireEvent.click(screen.getByRole("toolbar"));
    expect(parentClick).not.toHaveBeenCalled();
  });

  it("stops propagation of pointer down events", () => {
    const parentPointerDown = jest.fn();
    render(
      <div onPointerDown={parentPointerDown}>
        <Toolbar aria-label="Test toolbar">
          <ToolbarGroup>
            <ToolbarAction aria-label="Action">
              <TestIcon />
            </ToolbarAction>
          </ToolbarGroup>
        </Toolbar>
      </div>
    );
    fireEvent.pointerDown(screen.getByRole("toolbar"));
    expect(parentPointerDown).not.toHaveBeenCalled();
  });

  describe("dragging", () => {
    it("starts dragging on mousedown of the drag handle", () => {
      renderToolbar();
      const toolbar = screen.getByRole("toolbar");
      const dragHandle = toolbar.firstChild as HTMLElement;
      fireEvent.mouseDown(dragHandle, { clientX: 0, clientY: 0 });
      expect(toolbar).toHaveAttribute("data-dragging");
    });

    it("stops dragging on mouseup", () => {
      renderToolbar();
      const toolbar = screen.getByRole("toolbar");
      const dragHandle = toolbar.firstChild as HTMLElement;
      fireEvent.mouseDown(dragHandle, { clientX: 0, clientY: 0 });
      fireEvent.mouseUp(document);
      expect(toolbar).not.toHaveAttribute("data-dragging");
    });

    it("updates position on mousemove while dragging", () => {
      // Use portal=true so the clamping boundary falls back to window.innerWidth/innerHeight
      // (jsdom provides these), rather than the parent element which has no layout in jsdom.
      renderToolbar({ xOffset: 20, yOffset: 20, portal: true });
      const toolbar = screen.getByRole("toolbar");
      const dragHandle = toolbar.firstChild as HTMLElement;
      fireEvent.mouseDown(dragHandle, { clientX: 0, clientY: 0 });
      fireEvent.mouseMove(document, { clientX: 30, clientY: 40 });
      expect(toolbar).toHaveStyle({ left: "50px", top: "60px" });
    });

    it("does not move on X axis when lockX=true", () => {
      renderToolbar({ xOffset: 20, yOffset: 20, lockX: true });
      const toolbar = screen.getByRole("toolbar");
      const dragHandle = toolbar.firstChild as HTMLElement;
      fireEvent.mouseDown(dragHandle, { clientX: 0, clientY: 0 });
      fireEvent.mouseMove(document, { clientX: 50, clientY: 50 });
      expect(toolbar).toHaveStyle({ left: "20px" });
    });

    it("does not move on Y axis when lockY=true", () => {
      renderToolbar({ xOffset: 20, yOffset: 20, lockY: true });
      const toolbar = screen.getByRole("toolbar");
      const dragHandle = toolbar.firstChild as HTMLElement;
      fireEvent.mouseDown(dragHandle, { clientX: 0, clientY: 0 });
      fireEvent.mouseMove(document, { clientX: 50, clientY: 50 });
      expect(toolbar).toHaveStyle({ top: "20px" });
    });
  });
});

// ---------------------------------------------------------------------------
// ToolbarAction
// ---------------------------------------------------------------------------

describe("ToolbarAction", () => {
  it("renders a button", () => {
    render(
      <ToolbarAction aria-label="Test action">
        <TestIcon />
      </ToolbarAction>
    );
    expect(
      screen.getByRole("button", { name: "Test action" })
    ).toBeInTheDocument();
  });

  it("sets aria-pressed=false when not active", () => {
    render(
      <ToolbarAction aria-label="Test action">
        <TestIcon />
      </ToolbarAction>
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  });

  it("sets aria-pressed=true when active", () => {
    render(
      <ToolbarAction active aria-label="Test action">
        <TestIcon />
      </ToolbarAction>
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("calls onClick when clicked", async () => {
    const onClick = jest.fn();
    render(
      <ToolbarAction aria-label="Test action" onClick={onClick}>
        <TestIcon />
      </ToolbarAction>
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", async () => {
    const onClick = jest.fn();
    render(
      <ToolbarAction disabled aria-label="Test action" onClick={onClick}>
        <TestIcon />
      </ToolbarAction>
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders children", () => {
    render(
      <ToolbarAction aria-label="Test action">
        <TestIcon />
      </ToolbarAction>
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <ToolbarAction aria-label="Test action" className="extra-class">
        <TestIcon />
      </ToolbarAction>
    );
    expect(screen.getByRole("button")).toHaveClass("extra-class");
  });

  it("is disabled when disabled=true", () => {
    render(
      <ToolbarAction disabled aria-label="Test action">
        <TestIcon />
      </ToolbarAction>
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("forwards ref to the underlying button element", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <ToolbarAction aria-label="Test action" ref={ref}>
        <TestIcon />
      </ToolbarAction>
    );
    expect(ref.current).toBe(screen.getByRole("button"));
  });

  it("forwards native button props via ...rest", () => {
    render(
      <ToolbarAction aria-label="Test action" tabIndex={5}>
        <TestIcon />
      </ToolbarAction>
    );
    expect(screen.getByRole("button")).toHaveAttribute("tabindex", "5");
  });
});

// ---------------------------------------------------------------------------
// ToolbarGroup
// ---------------------------------------------------------------------------

describe("ToolbarGroup", () => {
  it("renders with role='group'", () => {
    render(
      <Toolbar>
        <ToolbarGroup aria-label="Draw tools">
          <ToolbarAction aria-label="Action">
            <TestIcon />
          </ToolbarAction>
        </ToolbarGroup>
      </Toolbar>
    );
    expect(
      screen.getByRole("group", { name: "Draw tools" })
    ).toBeInTheDocument();
  });

  it("renders children inside the group", () => {
    render(
      <Toolbar>
        <ToolbarGroup>
          <ToolbarAction aria-label="Brush">
            <TestIcon />
          </ToolbarAction>
        </ToolbarGroup>
      </Toolbar>
    );
    expect(screen.getByRole("button", { name: "Brush" })).toBeInTheDocument();
  });

  it("applies self-stretch in Row orientation from context", () => {
    render(
      <Toolbar orientation={Orientation.Row}>
        <ToolbarGroup aria-label="Tools">
          <ToolbarAction aria-label="Action">
            <TestIcon />
          </ToolbarAction>
        </ToolbarGroup>
      </Toolbar>
    );
    expect(screen.getByRole("group")).toHaveClass("self-stretch");
  });

  it("renders a divider element", () => {
    render(
      <Toolbar>
        <ToolbarGroup aria-label="Draw tools">
          <ToolbarAction aria-label="Action">
            <TestIcon />
          </ToolbarAction>
        </ToolbarGroup>
      </Toolbar>
    );
    // The divider is a plain <div> inside the group that is not a button or text
    const group = screen.getByRole("group");
    const dividers = Array.from(group.querySelectorAll("div")).filter(
      (el) =>
        !el.querySelector("button") &&
        el.tagName === "DIV" &&
        el.children.length === 0
    );
    expect(dividers.length).toBeGreaterThan(0);
  });
});
