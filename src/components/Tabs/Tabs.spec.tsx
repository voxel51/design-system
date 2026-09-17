import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Tab } from "./Tab";
import { Tabs } from "./Tabs";

describe("Tabs", () => {
  it("should render its tabs", () => {
    render(
      <Tabs>
        <Tab active>Datasets</Tab>
        <Tab>Settings</Tab>
      </Tabs>
    );

    expect(screen.getAllByRole("tab")).toHaveLength(2);
    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  it("should mark only the active tab as selected", () => {
    render(
      <Tabs>
        <Tab active>Datasets</Tab>
        <Tab>Settings</Tab>
      </Tabs>
    );

    expect(screen.getByRole("tab", { name: "Datasets" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("tab", { name: "Settings" })).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });

  it("should pass through additional props to the component", () => {
    render(
      <Tabs data-testid="custom-tabs" aria-label="Workspace">
        <Tab>Datasets</Tab>
      </Tabs>
    );

    const tabs = screen.getByTestId("custom-tabs");
    expect(tabs).toHaveAttribute("aria-label", "Workspace");
  });
});

describe("Tab", () => {
  it("should render a formatted count", () => {
    render(
      <Tabs>
        <Tab count={1234}>Datasets</Tab>
      </Tabs>
    );

    expect(screen.getByText((1234).toLocaleString())).toBeInTheDocument();
  });

  it("should not render a count when none is given", () => {
    render(
      <Tabs>
        <Tab>Datasets</Tab>
      </Tabs>
    );

    expect(screen.getByRole("tab")).toHaveTextContent(/^Datasets$/);
  });

  it("should render an anchor when href is given", () => {
    render(
      <Tabs>
        <Tab href="/datasets">Datasets</Tab>
      </Tabs>
    );

    expect(screen.getByRole("tab")).toHaveAttribute("href", "/datasets");
  });

  it("should call onClick when clicked", async () => {
    const onClick = jest.fn();
    render(
      <Tabs>
        <Tab onClick={onClick}>Datasets</Tab>
      </Tabs>
    );

    await userEvent.click(screen.getByRole("tab"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should not call onClick when disabled", async () => {
    const onClick = jest.fn();
    render(
      <Tabs>
        <Tab disabled onClick={onClick}>
          Datasets
        </Tab>
      </Tabs>
    );

    await userEvent.click(screen.getByRole("tab"));

    expect(onClick).not.toHaveBeenCalled();
  });
});
