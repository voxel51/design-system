import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ListItemProps } from "@/components/ListItem";
import { RichList } from "@/components/RichList";
import { Descriptor } from "@/types";

describe("RichList", () => {
  let testId: string;

  beforeEach(() => {
    testId = Math.random().toString(36).substring(2, 9);
  });

  it("should render", () => {
    render(<RichList listItems={[]} data-testid={testId} />);
    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });

  it("should render each list item", () => {
    const listItems: Descriptor<ListItemProps>[] = new Array(5)
      .fill(0)
      .map((_) => ({
        id: Math.random().toString(36).substring(2, 9),
        data: {
          primaryContent: Math.random().toString(36).substring(2, 9),
        },
      }));

    render(<RichList listItems={listItems} data-testid={testId} />);

    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();
    listItems.forEach((item) => {
      expect(within(element).getByTestId(item.id)).toBeInTheDocument();
      expect(
        within(element).getByText(item.data.primaryContent as string)
      ).toBeInTheDocument();
    });
  });

  it("should invoke callback when an item is selected", async () => {
    const listItem: Descriptor<ListItemProps> = {
      id: Math.random().toString(36).substring(2, 9),
      data: {
        canSelect: true,
      },
    };
    const onSelected = jest.fn();
    const user = userEvent.setup();

    render(
      <RichList
        listItems={[listItem]}
        onSelected={onSelected}
        data-testid={testId}
      />
    );

    const listItemElement = screen.getByTestId(listItem.id);
    expect(listItemElement).toBeInTheDocument();
    const checkbox = within(listItemElement).getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();

    // select
    await user.click(checkbox);

    expect(onSelected).toHaveBeenCalledWith([listItem.id]);

    // deselect
    await user.click(checkbox);

    expect(onSelected).toHaveBeenCalledWith([]);
  });

  it("should render drag handles when draggable is true", () => {
    const listItems: Descriptor<ListItemProps>[] = [
      { id: "item-1", data: { primaryContent: "Item 1" } },
      { id: "item-2", data: { primaryContent: "Item 2" } },
    ];

    render(
      <RichList listItems={listItems} draggable data-testid={testId} />
    );

    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();

    // Each item should have a drag handle (svg icon)
    const dragHandles = element.querySelectorAll("svg");
    expect(dragHandles.length).toBe(2);
  });

  it("should not render drag handles when draggable is false", () => {
    const listItems: Descriptor<ListItemProps>[] = [
      { id: "item-1", data: { primaryContent: "Item 1" } },
      { id: "item-2", data: { primaryContent: "Item 2" } },
    ];

    render(<RichList listItems={listItems} data-testid={testId} />);

    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();

    // No drag handles should be present
    const dragHandles = element.querySelectorAll("svg");
    expect(dragHandles.length).toBe(0);
  });

  it("should respect canDrag=false on individual items when draggable", () => {
    const listItems: Descriptor<ListItemProps>[] = [
      { id: "item-1", data: { primaryContent: "Item 1", canDrag: true } },
      { id: "item-2", data: { primaryContent: "Item 2", canDrag: false } },
    ];

    render(
      <RichList listItems={listItems} draggable data-testid={testId} />
    );

    const element = screen.getByTestId(testId);
    // Only one drag handle should be present (item-1)
    const dragHandles = element.querySelectorAll("svg");
    expect(dragHandles.length).toBe(1);
  });
});
