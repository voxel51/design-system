import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import type { ListImperativeAPI } from "react-window";

import { ListItemProps } from "@/components/ListItem";
import { VirtualizedRichList } from "@/components/RichList/VirtualizedRichList";
import { Descriptor } from "@/types";
import { randomString } from "@/util/random";

// jsdom has no real layout nor ResizeObserver; polyfill both so react-window
// v2 can measure its viewport and mount rows.
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    configurable: true,
    get() {
      return 600;
    },
  });
  Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
    configurable: true,
    get() {
      return 800;
    },
  });
  (globalThis as unknown as { ResizeObserver: typeof MockResizeObserver }).ResizeObserver =
    MockResizeObserver;
});

describe("VirtualizedRichList", () => {
  let testId: string;

  beforeEach(() => {
    testId = randomString();
  });

  it("renders an empty list", () => {
    render(
      <VirtualizedRichList
        listItems={[]}
        height={400}
        itemSize={50}
        data-testid={testId}
      />
    );
    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });

  it("renders visible rows", () => {
    const listItems: Descriptor<ListItemProps>[] = new Array(5)
      .fill(0)
      .map(() => ({
        id: randomString(),
        data: { primaryContent: randomString() },
      }));

    render(
      <VirtualizedRichList
        listItems={listItems}
        height={500}
        itemSize={60}
        data-testid={testId}
      />
    );

    const container = screen.getByTestId(testId);
    expect(container).toBeInTheDocument();
    listItems.forEach((item) => {
      expect(within(container).getByTestId(item.id)).toBeInTheDocument();
      expect(
        within(container).getByText(item.data.primaryContent as string)
      ).toBeInTheDocument();
    });
  });

  it("only mounts a window of rows for large lists", () => {
    const listItems: Descriptor<ListItemProps>[] = new Array(1000)
      .fill(0)
      .map((_, i) => ({
        id: `item-${i}`,
        data: { primaryContent: `Row ${i}` },
      }));

    render(
      <VirtualizedRichList
        listItems={listItems}
        height={400}
        itemSize={50}
        overscanCount={2}
        data-testid={testId}
      />
    );

    const container = screen.getByTestId(testId);
    // Count rendered rows by their test ids (item-0..item-N).
    const renderedIds = listItems.filter((item) =>
      within(container).queryByTestId(item.id)
    );

    // viewport (~8) + overscan should be well under the total 1000.
    expect(renderedIds.length).toBeLessThan(50);
    expect(renderedIds.length).toBeGreaterThan(0);
  });

  it("invokes onSelected when a row is toggled", async () => {
    const listItem: Descriptor<ListItemProps> = {
      id: randomString(),
      data: { canSelect: true },
    };
    const onSelected = jest.fn();
    const user = userEvent.setup();

    render(
      <VirtualizedRichList
        listItems={[listItem]}
        height={400}
        itemSize={60}
        onSelected={onSelected}
        data-testid={testId}
      />
    );

    const row = screen.getByTestId(listItem.id);
    const checkbox = within(row).getByRole("checkbox");

    await user.click(checkbox);
    expect(onSelected).toHaveBeenLastCalledWith([listItem.id]);

    await user.click(checkbox);
    expect(onSelected).toHaveBeenLastCalledWith([]);
  });

  it("respects controlled `selected` prop", () => {
    const items: Descriptor<ListItemProps>[] = [
      { id: "a", data: { canSelect: true, primaryContent: "A" } },
      { id: "b", data: { canSelect: true, primaryContent: "B" } },
    ];

    render(
      <VirtualizedRichList
        listItems={items}
        height={400}
        itemSize={60}
        selected={["b"]}
        data-testid={testId}
      />
    );

    const rowA = screen.getByTestId("a");
    const rowB = screen.getByTestId("b");
    expect(within(rowA).getByRole("checkbox")).not.toBeChecked();
    expect(within(rowB).getByRole("checkbox")).toBeChecked();
  });

  it("supports a per-index itemSize function", () => {
    const items: Descriptor<ListItemProps>[] = new Array(3)
      .fill(0)
      .map((_, i) => ({
        id: `v-${i}`,
        data: { primaryContent: `Variable ${i}` },
      }));

    render(
      <VirtualizedRichList
        listItems={items}
        height={400}
        itemSize={(index) => (index % 2 === 0 ? 80 : 50)}
        data-testid={testId}
      />
    );

    const container = screen.getByTestId(testId);
    items.forEach((item) => {
      expect(within(container).getByTestId(item.id)).toBeInTheDocument();
    });
  });

  it("exposes imperative ref (scrollToRow)", () => {
    const ref = createRef<ListImperativeAPI>();
    const items: Descriptor<ListItemProps>[] = new Array(20)
      .fill(0)
      .map((_, i) => ({
        id: `r-${i}`,
        data: { primaryContent: `Row ${i}` },
      }));

    render(
      <VirtualizedRichList
        ref={ref}
        listItems={items}
        height={200}
        itemSize={40}
      />
    );

    expect(ref.current).not.toBeNull();
    expect(typeof ref.current?.scrollToRow).toBe("function");
  });
});
