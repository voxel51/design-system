import { act, render, screen } from "@testing-library/react";

import { Descriptor, Orientation } from "@/types";
import { randomString } from "@/util/random";

import { ImageList, ImageListProps } from "./ImageList";

jest.mock("@/components/Spinner", () => ({
  Spinner: () => <div data-testid="spinner" />,
}));

type TestData = { label: string };

describe("ImageList", () => {
  let testId: string;
  let defaultProps: ImageListProps<TestData>;

  let capturedCallback: (entries: IntersectionObserverEntry[]) => void;
  const mockObserve = jest.fn();
  const mockDisconnect = jest.fn();

  const triggerIntersection = (isIntersecting: boolean) => {
    act(() => {
      capturedCallback([{ isIntersecting } as IntersectionObserverEntry]);
    });
  };

  beforeEach(() => {
    testId = randomString();
    mockObserve.mockClear();
    mockDisconnect.mockClear();

    window.IntersectionObserver = jest.fn(
      (callback: IntersectionObserverCallback) => {
        capturedCallback = callback;
        return {
          observe: mockObserve,
          unobserve: jest.fn(),
          disconnect: mockDisconnect,
          root: null,
          rootMargin: "",
          thresholds: [],
          takeRecords: jest.fn().mockReturnValue([]),
        };
      }
    ) as unknown as typeof IntersectionObserver;

    defaultProps = {
      "data-testid": testId,
      items: [],
      renderItem: (data, id) => (
        <div key={id} data-testid={id}>
          {data.label}
        </div>
      ),
    };
  });

  it("should render", () => {
    render(<ImageList {...defaultProps} />);

    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });

  describe("items", () => {
    let items: Descriptor<TestData>[];

    beforeEach(() => {
      items = Array.from({ length: 3 }, () => ({
        id: randomString(),
        data: { label: randomString() },
      }));
    });

    it("should render each item via renderItem", () => {
      render(<ImageList {...defaultProps} items={items} />);

      items.forEach(({ id, data }) => {
        expect(screen.getByTestId(id)).toBeInTheDocument();
        expect(screen.getByText(data.label)).toBeInTheDocument();
      });
    });

    it("should only render the provided items", () => {
      render(<ImageList {...defaultProps} items={items.slice(0, 1)} />);

      expect(screen.getByTestId(items[0].id)).toBeInTheDocument();
      expect(screen.queryByTestId(items[1].id)).not.toBeInTheDocument();
      expect(screen.queryByTestId(items[2].id)).not.toBeInTheDocument();
    });
  });

  describe("orientation", () => {
    it("should apply vertical scroll classes by default", () => {
      render(<ImageList {...defaultProps} />);

      const el = screen.getByTestId(testId);
      expect(el).toHaveClass("overflow-y-auto");
      expect(el).toHaveClass("overflow-x-hidden");
    });

    it("should apply vertical grid styles by default", () => {
      render(<ImageList {...defaultProps} cols={4} gap={12} rowHeight={200} />);

      const el = screen.getByTestId(testId);
      expect(el.style.gridTemplateColumns).toBe("repeat(4, 1fr)");
      expect(el.style.gridAutoRows).toBe("200px");
      expect(el.style.gap).toBe("12px");
    });

    it("should apply horizontal scroll classes for Row orientation", () => {
      render(<ImageList {...defaultProps} orientation={Orientation.Row} />);

      const el = screen.getByTestId(testId);
      expect(el).toHaveClass("overflow-x-auto");
      expect(el).toHaveClass("overflow-y-hidden");
    });

    it("should apply horizontal grid styles for Row orientation", () => {
      render(
        <ImageList
          {...defaultProps}
          orientation={Orientation.Row}
          cols={2}
          gap={16}
          colWidth={200}
        />
      );

      const el = screen.getByTestId(testId);
      expect(el.style.gridTemplateRows).toBe("repeat(2, 1fr)");
      expect(el.style.gridAutoFlow).toBe("column");
      expect(el.style.gridAutoColumns).toBe("200px");
      expect(el.style.gap).toBe("16px");
    });
  });

  describe("infinite scroll", () => {
    it("should not set up an observer when onLoadMore is not provided", () => {
      render(<ImageList {...defaultProps} />);

      expect(mockObserve).not.toHaveBeenCalled();
    });

    it("should observe the sentinel when onLoadMore is provided", () => {
      render(<ImageList {...defaultProps} onLoadMore={jest.fn()} />);

      expect(mockObserve).toHaveBeenCalledTimes(1);
    });

    it("should show a spinner while loading", () => {
      render(<ImageList {...defaultProps} onLoadMore={jest.fn()} loading />);

      expect(screen.getByTestId("spinner")).toBeInTheDocument();
    });

    it("should not show a spinner when not loading", () => {
      render(
        <ImageList {...defaultProps} onLoadMore={jest.fn()} loading={false} />
      );

      expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
    });

    it("should call onLoadMore when the sentinel intersects and hasMore is true", () => {
      const onLoadMore = jest.fn();
      render(<ImageList {...defaultProps} onLoadMore={onLoadMore} hasMore />);

      triggerIntersection(true);

      expect(onLoadMore).toHaveBeenCalledTimes(1);
    });

    it("should not call onLoadMore when hasMore is false", () => {
      const onLoadMore = jest.fn();
      render(
        <ImageList {...defaultProps} onLoadMore={onLoadMore} hasMore={false} />
      );

      triggerIntersection(true);

      expect(onLoadMore).not.toHaveBeenCalled();
    });

    it("should not call onLoadMore while loading", () => {
      const onLoadMore = jest.fn();
      render(
        <ImageList {...defaultProps} onLoadMore={onLoadMore} hasMore loading />
      );

      triggerIntersection(true);

      expect(onLoadMore).not.toHaveBeenCalled();
    });

    it("should not call onLoadMore when the sentinel is not intersecting", () => {
      const onLoadMore = jest.fn();
      render(<ImageList {...defaultProps} onLoadMore={onLoadMore} hasMore />);

      triggerIntersection(false);

      expect(onLoadMore).not.toHaveBeenCalled();
    });

    it("should disconnect the observer on unmount", () => {
      const { unmount } = render(
        <ImageList {...defaultProps} onLoadMore={jest.fn()} />
      );

      unmount();

      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });
  });
});
