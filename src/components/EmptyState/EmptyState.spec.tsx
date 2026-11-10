import { render, screen } from "@testing-library/react";

import { PanelEmptyArt } from "@/components/EmptyArt";
import { DrawIcon } from "@/components/Icons";

import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("should render with icon and title", () => {
    render(<EmptyState icon={DrawIcon} title="Example Title" />);
    expect(screen.getByText("Example Title")).toBeInTheDocument();
  });

  it("should render with icon, title, and description", () => {
    render(
      <EmptyState
        icon={DrawIcon}
        title="Example Title"
        description="This is an example description."
      />
    );
    expect(screen.getByText("Example Title")).toBeInTheDocument();
    expect(
      screen.getByText("This is an example description.")
    ).toBeInTheDocument();
  });

  it("centres its children", () => {
    render(
      <EmptyState icon={DrawIcon} title="Empty">
        <div data-testid="card">Card</div>
      </EmptyState>
    );
    expect(screen.getByTestId("card").parentElement).toHaveClass(
      "items-center"
    );
  });

  it("should render art instead of the icon, and an action area", () => {
    render(
      <EmptyState icon={DrawIcon} art={<PanelEmptyArt />} title="No runs yet">
        <button>Run</button>
      </EmptyState>
    );
    expect(
      screen.getByRole("img", { name: "Nothing here yet" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Run" })).toBeInTheDocument();
  });

  it("should size the art down when small", () => {
    const { container } = render(
      <EmptyState size="sm" art={<PanelEmptyArt />} title="Nothing yet" />
    );
    expect(container.querySelector(".w-\\[104px\\]")).not.toBeNull();
    expect(container.querySelector(".w-\\[150px\\]")).toBeNull();
  });

  it("lays out actions with a docs link, a note, steps and a footer", () => {
    render(
      <EmptyState
        title="Connect a source"
        actions={<button type="button">Add source</button>}
        docsHref="https://docs.example.com"
        note={<span>Admins only</span>}
        stepsTitle="How it works"
        steps={[
          { title: "1. Define", description: "Write a pipeline" },
          {
            title: "2. Connect",
            description: "Register it",
            action: <button type="button">Register</button>,
          },
        ]}
        footer={<span>Need help? Contact support.</span>}
      />
    );
    expect(
      screen.getByRole("button", { name: "Add source" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View Docs" })).toHaveAttribute(
      "href",
      "https://docs.example.com"
    );
    expect(screen.getByText("Admins only")).toBeInTheDocument();
    expect(screen.getByText("How it works")).toBeInTheDocument();
    expect(screen.getByText("2. Connect")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Register" })
    ).toBeInTheDocument();
    expect(screen.getByText("Need help? Contact support.")).toBeInTheDocument();
  });

  it("names the docs button by its label", () => {
    render(
      <EmptyState title="t" docsHref="/docs" docsLabel="Read the guide" />
    );
    expect(
      screen.getByRole("link", { name: "Read the guide" })
    ).toHaveAttribute("target", "_blank");
  });
});
