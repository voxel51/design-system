import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";

import { PaginationBar } from "./PaginationBar";

describe("PaginationBar", () => {
  let onChange: jest.Func;
  let user: UserEvent;

  beforeEach(() => {
    onChange = jest.fn();
    user = userEvent.setup();
  });

  it("should render the range label", () => {
    render(<PaginationBar page={0} pageSize={20} total={113} />);
    expect(screen.getByText("Showing 1–20 of 113")).toBeInTheDocument();
  });

  it("should render the last partial page range", () => {
    render(<PaginationBar page={5} pageSize={20} total={113} />);
    expect(screen.getByText("Showing 101–113 of 113")).toBeInTheDocument();
  });

  it("should render an empty label when there are no items", () => {
    render(<PaginationBar page={0} pageSize={20} total={0} />);
    expect(screen.getByText("Showing 0 of 0")).toBeInTheDocument();
  });

  it("should use a custom label formatter", () => {
    render(
      <PaginationBar
        page={1}
        pageSize={10}
        total={30}
        formatLabel={(start, end, total) => `${start}/${end}/${total}`}
      />
    );
    expect(screen.getByText("11/20/30")).toBeInTheDocument();
  });

  it("should clamp an out-of-range page", () => {
    render(<PaginationBar page={99} pageSize={20} total={113} />);
    expect(screen.getByText("Showing 101–113 of 113")).toBeInTheDocument();
  });

  describe("navigation buttons", () => {
    it("should disable backward buttons on the first page", () => {
      render(<PaginationBar page={0} pageSize={20} total={113} />);
      expect(screen.getByLabelText("first page")).toBeDisabled();
      expect(screen.getByLabelText("previous page")).toBeDisabled();
      expect(screen.getByLabelText("next page")).toBeEnabled();
      expect(screen.getByLabelText("last page")).toBeEnabled();
    });

    it("should disable forward buttons on the last page", () => {
      render(<PaginationBar page={5} pageSize={20} total={113} />);
      expect(screen.getByLabelText("first page")).toBeEnabled();
      expect(screen.getByLabelText("previous page")).toBeEnabled();
      expect(screen.getByLabelText("next page")).toBeDisabled();
      expect(screen.getByLabelText("last page")).toBeDisabled();
    });

    it("should disable all buttons when disabled", () => {
      render(<PaginationBar page={2} pageSize={20} total={113} disabled />);
      expect(screen.getByLabelText("first page")).toBeDisabled();
      expect(screen.getByLabelText("previous page")).toBeDisabled();
      expect(screen.getByLabelText("next page")).toBeDisabled();
      expect(screen.getByLabelText("last page")).toBeDisabled();
    });

    it("should call onChange with the previous page", async () => {
      render(
        <PaginationBar page={2} pageSize={20} total={113} onChange={onChange} />
      );

      await user.click(screen.getByLabelText("previous page"));
      expect(onChange).toHaveBeenCalledWith(1);
    });

    it("should call onChange with the next page", async () => {
      render(
        <PaginationBar page={2} pageSize={20} total={113} onChange={onChange} />
      );

      await user.click(screen.getByLabelText("next page"));
      expect(onChange).toHaveBeenCalledWith(3);
    });

    it("should call onChange with the first page", async () => {
      render(
        <PaginationBar page={3} pageSize={20} total={113} onChange={onChange} />
      );

      await user.click(screen.getByLabelText("first page"));
      expect(onChange).toHaveBeenCalledWith(0);
    });

    it("should call onChange with the last page", async () => {
      render(
        <PaginationBar page={2} pageSize={20} total={113} onChange={onChange} />
      );

      await user.click(screen.getByLabelText("last page"));
      expect(onChange).toHaveBeenCalledWith(5);
    });
  });

  describe("page buttons", () => {
    it("should render all pages when the range is small", () => {
      render(<PaginationBar page={0} pageSize={20} total={100} pageButtons />);

      for (const page of [1, 2, 3, 4, 5]) {
        expect(
          screen.getByRole("button", { name: String(page) })
        ).toBeInTheDocument();
      }
      expect(screen.queryByText("…")).not.toBeInTheDocument();
    });

    it("should render pages near the start, current page, and end", () => {
      render(<PaginationBar page={24} pageSize={20} total={1000} pageButtons />);

      for (const page of [1, 2, 24, 25, 26, 49, 50]) {
        expect(
          screen.getByRole("button", { name: String(page) })
        ).toBeInTheDocument();
      }
      expect(screen.getAllByText("…")).toHaveLength(2);
      expect(screen.queryByRole("button", { name: "3" })).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "48" })
      ).not.toBeInTheDocument();
    });

    it("should mark the current page", () => {
      render(<PaginationBar page={24} pageSize={20} total={1000} pageButtons />);
      expect(screen.getByRole("button", { name: "25" })).toHaveAttribute(
        "aria-current",
        "page"
      );
      expect(screen.getByRole("button", { name: "24" })).not.toHaveAttribute(
        "aria-current"
      );
    });

    it("should call onChange with the clicked page", async () => {
      render(
        <PaginationBar
          page={24}
          pageSize={20}
          total={1000}
          pageButtons
          onChange={onChange}
        />
      );

      await user.click(screen.getByRole("button", { name: "2" }));
      expect(onChange).toHaveBeenCalledWith(1);
    });
  });

  describe("page input", () => {
    it("should reflect the current page", () => {
      render(<PaginationBar page={2} pageSize={20} total={113} pageInput />);
      expect(screen.getByLabelText("page number")).toHaveValue("3");
      expect(screen.getByText("of 6")).toBeInTheDocument();
    });

    it("should call onChange with the entered page on enter", async () => {
      render(
        <PaginationBar
          page={0}
          pageSize={20}
          total={113}
          pageInput
          onChange={onChange}
        />
      );

      const input = screen.getByLabelText("page number");
      await user.clear(input);
      await user.type(input, "4{Enter}");
      expect(onChange).toHaveBeenCalledWith(3);
    });

    it("should clamp an entered page beyond the last page", async () => {
      render(
        <PaginationBar
          page={0}
          pageSize={20}
          total={113}
          pageInput
          onChange={onChange}
        />
      );

      const input = screen.getByLabelText("page number");
      await user.clear(input);
      await user.type(input, "99{Enter}");
      expect(onChange).toHaveBeenCalledWith(5);
    });

    it("should ignore non-numeric input", async () => {
      render(
        <PaginationBar
          page={2}
          pageSize={20}
          total={113}
          pageInput
          onChange={onChange}
        />
      );

      const input = screen.getByLabelText("page number");
      await user.type(input, "abc");
      expect(input).toHaveValue("3");
    });

    it("should restore the current page when committing an empty value", async () => {
      render(
        <PaginationBar
          page={2}
          pageSize={20}
          total={113}
          pageInput
          onChange={onChange}
        />
      );

      const input = screen.getByLabelText("page number");
      await user.clear(input);
      await user.type(input, "{Enter}");
      expect(onChange).not.toHaveBeenCalled();
      expect(input).toHaveValue("3");
    });
  });

  describe("page size select", () => {
    let onPageSizeChange: jest.Func;

    beforeEach(() => {
      onPageSizeChange = jest.fn();
    });

    it("should not render without onPageSizeChange", () => {
      render(
        <PaginationBar
          page={0}
          pageSize={20}
          total={113}
          pageSizeOptions={[25, 50, 100]}
        />
      );
      expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    });

    it("should render the current page size", () => {
      render(
        <PaginationBar
          page={0}
          pageSize={25}
          total={113}
          pageSizeOptions={[25, 50, 100]}
          onPageSizeChange={onPageSizeChange}
        />
      );
      expect(screen.getByRole("combobox")).toHaveValue("25");
    });

    it("should call onPageSizeChange with the selected size", async () => {
      render(
        <PaginationBar
          page={0}
          pageSize={25}
          total={113}
          pageSizeOptions={[25, 50, 100]}
          onPageSizeChange={onPageSizeChange}
        />
      );

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByText("50"));
      expect(onPageSizeChange).toHaveBeenCalledWith(50);
    });

    it("should include a page size missing from the options", async () => {
      render(
        <PaginationBar
          page={0}
          pageSize={20}
          total={113}
          pageSizeOptions={[25, 50, 100]}
          onPageSizeChange={onPageSizeChange}
        />
      );

      expect(screen.getByRole("combobox")).toHaveValue("20");
      await user.click(screen.getByRole("combobox"));
      expect(screen.getByText("25")).toBeInTheDocument();
    });
  });
});
