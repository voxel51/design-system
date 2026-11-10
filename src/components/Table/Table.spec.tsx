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
      bgColorClass(BackgroundColor.Card)
    );
    expect(screen.getByRole("table")).toHaveClass(radiusStyles(Radius.Md));
    expect(screen.getByRole("columnheader")).toHaveClass("px-4", "uppercase");
    expect(screen.getByRole("table").parentElement).toHaveClass(
      "overflow-x-auto"
    );
    expect(screen.getByRole("columnheader")).toHaveClass("py-2.5");
    expect(screen.getByRole("columnheader")).toHaveClass("text-left");
    expect(screen.getByRole("columnheader")).toHaveClass(
      textColorClass(TextColor.Tertiary)
    );
    expect(screen.getByRole("columnheader")).toHaveClass(
      textStyles(TextVariant.Label)!
    );
    expect(screen.getByRole("cell")).toHaveClass("px-4");
    expect(screen.getByRole("cell")).toHaveClass("py-3");
    expect(screen.getByRole("cell")).toHaveClass("text-left");
    expect(screen.getByRole("cell")).toHaveClass("font-normal");
    expect(screen.getByRole("cell")).toHaveClass(
      textColorClass(TextColor.Primary)
    );
    expect(screen.getByRole("cell")).toHaveClass(
      textStyles(TextVariant.BodySecondary)!
    );
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

describe("Table boxed variant", () => {
  const renderBoxed = (onSort?: () => void) =>
    render(
      <Table variant="boxed">
        <TableHeader>
          <TableRow>
            <TableHead align="end" sort="desc" onSort={onSort}>
              Support
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell align="end">42</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

  it("tints the header and tightens cells", () => {
    renderBoxed();
    expect(screen.getByRole("columnheader").closest("thead")).toHaveClass(
      bgColorClass(BackgroundColor.CardElevated)
    );
    expect(screen.getByRole("cell")).toHaveClass("px-3", "py-2");
    expect(screen.getByRole("columnheader")).not.toHaveClass("uppercase");
  });

  it("highlights only clickable rows of a boxed table", () => {
    render(
      <Table variant="boxed">
        <TableBody>
          <TableRow>
            <TableCell>static</TableCell>
          </TableRow>
          <TableRow onClick={() => {}}>
            <TableCell>clickable</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const [plain, clickable] = screen.getAllByRole("row");
    expect(plain.className).not.toContain("hover:");
    expect(clickable.className).toContain("hover:");
  });

  it("right-aligns end cells with tabular figures", () => {
    renderBoxed();
    expect(screen.getByRole("cell")).toHaveClass("text-right", "tabular-nums");
  });

  it("marks the sorted header and sorts on click", async () => {
    const onSort = jest.fn();
    renderBoxed(onSort);
    const header = screen.getByRole("columnheader");
    expect(header).toHaveAttribute("aria-sort", "descending");
    expect(header).toHaveClass(textColorClass(TextColor.Primary));
    await userEvent.click(screen.getByRole("button", { name: "Support" }));
    expect(onSort).toHaveBeenCalledTimes(1);
  });

  it("sorts from the keyboard, whatever onClick the caller passes", async () => {
    const onSort = jest.fn();
    const onClick = jest.fn();
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onSort={onSort} onClick={onClick}>
              Name
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    expect(screen.getByRole("columnheader")).toHaveAttribute(
      "aria-sort",
      "none"
    );
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Name" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onSort).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders no sort button without onSort", () => {
    renderBoxed();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
