import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import radiusStyles from "@/styles/radius";
import { textStyles } from "@/styles/text";
import {
  BackgroundColor,
  bgColorClass,
  Radius,
  TextColor,
  textColorClass,
  TextVariant,
} from "@/types";

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
    const headerLabel = "column label";
    const cellValue = "cell value";

    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{headerLabel}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{cellValue}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByText(headerLabel)).toBeInTheDocument();
    expect(screen.getByRole("columnheader")).toBeInTheDocument();
    expect(screen.getByText(cellValue)).toBeInTheDocument();
    const rowGroups = screen.getAllByRole("rowgroup");
    expect(rowGroups).toHaveLength(2);
    expect(screen.getAllByRole("row")).toHaveLength(2);
    expect(screen.getByRole("cell")).toBeInTheDocument();
  });

  it("should render table with appropriate className", () => {
    const headerLabel = "column label";
    const cellValue = "cell value";
    const className = "test-class";

    render(
      <Table className={className}>
        <TableHeader>
          <TableRow>
            <TableHead>{headerLabel}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{cellValue}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByRole("table")).toHaveClass(className);
    expect(screen.getByRole("table")).toHaveClass("w-full");
    expect(screen.getByRole("table")).toHaveClass("border-collapse");
    expect(screen.getByRole("table")).toHaveClass(
      bgColorClass(BackgroundColor.Card1)
    );
    expect(screen.getByRole("table")).toHaveClass(radiusStyles(Radius.Md));
    expect(screen.getByRole("columnheader")).toHaveClass("px-6");
    expect(screen.getByRole("columnheader")).toHaveClass("py-3");
    expect(screen.getByRole("columnheader")).toHaveClass("text-left");
    expect(screen.getByRole("columnheader")).toHaveClass("font-normal");
    expect(screen.getByRole("columnheader")).toHaveClass(
      textColorClass(TextColor.Secondary)
    );
    expect(screen.getByRole("columnheader")).toHaveClass(
      textStyles(TextVariant.Md)!
    );
    expect(screen.getByRole("cell")).toHaveClass("px-6");
    expect(screen.getByRole("cell")).toHaveClass("py-3");
    expect(screen.getByRole("cell")).toHaveClass("text-left");
    expect(screen.getByRole("cell")).toHaveClass("font-normal");
    expect(screen.getByRole("cell")).toHaveClass(
      textColorClass(TextColor.Primary)
    );
    expect(screen.getByRole("cell")).toHaveClass(textStyles(TextVariant.Md)!);
  });

  it("should add hover cursor styles when TableRow has an onClick handler", () => {
    render(
      <Table>
        <TableBody>
          <TableRow onClick={jest.fn()}>
            <TableCell>clickable</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getByRole("row")).toHaveClass("hover:cursor-pointer");
  });

  it("should call onClick when a clickable TableRow is clicked", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    render(
      <Table>
        <TableBody>
          <TableRow onClick={handleClick}>
            <TableCell>clickable</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    await user.click(screen.getByRole("row"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should not add hover cursor styles when TableRow has no onClick handler", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>static</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getByRole("row")).not.toHaveClass("hover:cursor-pointer");
  });
});

describe("Table cell attributes", () => {
  it("passes colSpan through to the cell", () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell colSpan={6}>spanning</TableCell>
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByText("spanning")).toHaveAttribute("colspan", "6");
  });

  it("passes scope through to the header cell", () => {
    render(
      <table>
        <thead>
          <tr>
            <TableHead scope="col">Queue</TableHead>
          </tr>
        </thead>
      </table>
    );

    expect(screen.getByText("Queue")).toHaveAttribute("scope", "col");
  });
});
