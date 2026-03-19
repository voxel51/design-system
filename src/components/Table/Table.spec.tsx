import { render, screen } from "@testing-library/react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table";

describe("Table", () => {
  it("should render table", () => {
    render(<Table />);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("should render table with appropriate elements", () => {
    render(
      <Table>
        <TableHeader>
          <TableHead>Column label</TableHead>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Cell value</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getByText("Column label")).toBeInTheDocument();
    expect(screen.getByRole("columnheader")).toBeInTheDocument();
    expect(screen.getByText("Cell value")).toBeInTheDocument();
    const rowGroups = screen.getAllByRole("rowgroup");
    expect(rowGroups).toHaveLength(2);
    expect(screen.getByRole("row")).toBeInTheDocument();
    expect(screen.getByRole("cell")).toBeInTheDocument();
  });

  it("should render table with appropriate className", () => {
    render(
      <Table className="test-class">
        <TableHeader>
          <TableHead>Column label</TableHead>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Cell value</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getByRole("table")).toHaveClass("test-class");
    expect(screen.getByRole("table")).toHaveClass("w-full");
    expect(screen.getByRole("table")).toHaveClass("border-collapse");
    expect(screen.getByRole("table")).toHaveClass("bg-content-bg-card-1");
    expect(screen.getByRole("table")).toHaveClass("rounded-md");
    expect(screen.getByRole("columnheader")).toHaveClass("px-6");
    expect(screen.getByRole("columnheader")).toHaveClass("py-3");
    expect(screen.getByRole("columnheader")).toHaveClass("text-left");
    expect(screen.getByRole("columnheader")).toHaveClass("font-normal");
    expect(screen.getByRole("columnheader")).toHaveClass(
      "text-content-text-secondary"
    );
    expect(screen.getByRole("columnheader")).toHaveClass("text-md/7");
    expect(screen.getByRole("cell")).toHaveClass("px-6");
    expect(screen.getByRole("cell")).toHaveClass("py-3");
    expect(screen.getByRole("cell")).toHaveClass("text-left");
    expect(screen.getByRole("cell")).toHaveClass("font-normal");
    expect(screen.getByRole("cell")).toHaveClass("text-content-text-primary");
    expect(screen.getByRole("cell")).toHaveClass("text-md/7");
  });
});
