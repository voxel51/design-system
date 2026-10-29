import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import { useOverflowRowCompact } from "@/util/compact";

import { DataTable, type DataTableColumn, DataTableRowItem } from "./DataTable";

const withWidth = (width: number) => {
  jest
    .spyOn(HTMLElement.prototype, "offsetWidth", "get")
    .mockImplementation(() => width);
};

const CompactProbe = () => (
  <button>{useOverflowRowCompact() ? "compact" : "full"}</button>
);

const columns: DataTableColumn[] = [
  { key: "name", label: "Name", role: "primary" },
  { key: "status", label: "Status", role: "status" },
  { key: "version", label: "Version" },
  { key: "updated", label: "Updated", hideBelow: "md" },
  { key: "menu", label: "", role: "actions", align: "end" },
];

const rows = [
  {
    id: "a",
    cells: {
      name: "Alpha",
      status: "Running",
      version: "1.0",
      updated: "",
      menu: <CompactProbe />,
    },
  },
];

describe("DataTable", () => {
  afterEach(() => jest.restoreAllMocks());

  it("renders a table with a header and cells keyed by column", () => {
    withWidth(1000);
    render(<DataTable columns={columns} rows={rows} />);
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("columnheader")).toHaveLength(5);
    expect(screen.getByRole("cell", { name: "Alpha" })).toBeInTheDocument();
    expect(screen.getByText("full")).toBeInTheDocument();
  });

  it("hides a hideBelow column's header and cells together", () => {
    withWidth(1000);
    render(<DataTable columns={columns} rows={rows} />);
    expect(screen.getByRole("columnheader", { name: "Updated" })).toHaveClass(
      "max-md:hidden"
    );
    expect(screen.getAllByRole("cell")[3]).toHaveClass("max-md:hidden");
  });

  it("shows cards below cardBelow with meta as Label: value and empty values skipped", () => {
    withWidth(390);
    render(<DataTable columns={columns} rows={rows} />);
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Running")).toBeInTheDocument();
    expect(screen.getByText("Version:")).toBeInTheDocument();
    expect(screen.queryByText("Updated:")).not.toBeInTheDocument();
  });

  it("renders card actions compact", () => {
    withWidth(390);
    render(<DataTable columns={columns} rows={rows} />);
    expect(screen.getByText("compact")).toBeInTheDocument();
  });

  it.each([1000, 390])(
    "keeps action clicks from the row's onClick at %ipx",
    async (width) => {
      withWidth(width);
      const onClick = jest.fn();
      const user = userEvent.setup();
      render(
        <DataTable
          columns={columns}
          rows={[
            {
              ...rows[0],
              onClick,
              props: { "data-cy": "row" } as Record<string, string>,
            },
          ]}
        />
      );
      await user.click(screen.getByRole("button"));
      expect(onClick).not.toHaveBeenCalled();
      await user.click(screen.getByText("Alpha"));
      expect(onClick).toHaveBeenCalledTimes(1);
      const row = document.querySelector('[data-cy="row"]') as HTMLElement;
      row.focus();
      await user.keyboard("{Enter}");
      expect(onClick).toHaveBeenCalledTimes(2);
    }
  );

  it.each([1000, 390])(
    "shows a row's detail without the row's onClick at %ipx",
    async (width) => {
      withWidth(width);
      const onClick = jest.fn();
      const user = userEvent.setup();
      render(
        <DataTable
          columns={columns}
          rows={[{ ...rows[0], onClick, detail: "More about Alpha" }]}
        />
      );
      await user.click(screen.getByText("More about Alpha"));
      expect(onClick).not.toHaveBeenCalled();
    }
  );

  it.each([1000, 390])("renders empty at %ipx", (width) => {
    withWidth(width);
    render(<DataTable columns={columns} rows={[]} empty="Nothing yet" />);
    expect(screen.getByText("Nothing yet")).toBeInTheDocument();
  });

  it("skips the header when no column has a label", () => {
    withWidth(1000);
    render(<DataTable columns={[{ key: "name", label: "" }]} rows={rows} />);
    expect(screen.queryByRole("columnheader")).not.toBeInTheDocument();
  });

  it("hugs a fit column and lets a fill column take the free space", () => {
    withWidth(1000);
    render(
      <DataTable
        columns={[
          { key: "name", label: "Name", role: "primary", width: "fill" },
          { key: "version", label: "Version", width: "fit" },
        ]}
        rows={[{ id: "a", cells: { name: "Alpha", version: "1.0" } }]}
      />
    );
    expect(screen.getByText("Name").className).toContain("w-full");
    expect(screen.getByText("Version").className).toContain(
      "whitespace-nowrap"
    );
    expect(screen.getByText("1.0").className).toContain("whitespace-nowrap");
  });

  it("sizes a column by its width when there is no header to carry it", () => {
    withWidth(1000);
    render(
      <DataTable
        columns={[
          { key: "name", label: "", role: "primary", width: "fill" },
          { key: "count", label: "", width: "12rem" },
        ]}
        rows={[{ id: "a", cells: { name: "Alpha", count: "0/30" } }]}
      />
    );
    expect(screen.getByText("0/30").closest("td")).toHaveStyle({
      width: "12rem",
      minWidth: "12rem",
    });
  });

  it("renders child rows with their own state, as a row and as a card", () => {
    const Own = () => {
      const [n] = useState(7);
      return <DataTableRowItem cells={{ name: `own ${n}` }} />;
    };
    withWidth(1000);
    const { unmount } = render(
      <DataTable
        columns={[{ key: "name", label: "Name", role: "primary" }]}
        rows={[]}
      >
        <Own />
      </DataTable>
    );
    expect(screen.getByText("own 7").closest("tr")).not.toBeNull();
    unmount();
    withWidth(400);
    render(
      <DataTable
        columns={[{ key: "name", label: "Name", role: "primary" }]}
        rows={[]}
      >
        <Own />
      </DataTable>
    );
    expect(screen.getByText("own 7").closest("tr")).toBeNull();
  });

  it("names the table", () => {
    withWidth(1000);
    render(<DataTable aria-label="Runs" columns={columns} rows={rows} />);
    expect(screen.getByRole("table", { name: "Runs" })).toBeInTheDocument();
  });
});
