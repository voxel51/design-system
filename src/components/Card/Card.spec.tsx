import { render, screen } from "@testing-library/react";

import { Card } from "./Card";

const CONTENT = "Enter text to set a value";

describe("Card", () => {
  it("should render card with children provided", () => {
    render(<Card>{CONTENT}</Card>);
    expect(screen.getByText(CONTENT)).toBeInTheDocument();
  });

  it("should render without a header when no title, subtitle, or header is provided", () => {
    const { container } = render(<Card>{CONTENT}</Card>);
    expect(container.querySelector(".border-b")).not.toBeInTheDocument();
  });

  describe("title", () => {
    it("renders a string title wrapped in Text", () => {
      render(<Card title="Usage" />);
      expect(screen.getByText("Usage")).toBeInTheDocument();
    });

    it("renders a node title as-is", () => {
      render(<Card title={<span data-testid="custom-title">Usage</span>} />);
      expect(screen.getByTestId("custom-title")).toBeInTheDocument();
    });
  });

  describe("subtitle", () => {
    it("renders a string subtitle", () => {
      render(<Card title="Usage" subtitle="Last 30 days" />);
      expect(screen.getByText("Last 30 days")).toBeInTheDocument();
    });

    it("renders a node subtitle as-is", () => {
      render(
        <Card
          title="Usage"
          subtitle={<span data-testid="custom-subtitle">Last 30 days</span>}
        />
      );
      expect(screen.getByTestId("custom-subtitle")).toBeInTheDocument();
    });

    it("does not render a header when only a subtitle is provided without a title", () => {
      render(<Card subtitle="Last 30 days" />);
      expect(screen.getByText("Last 30 days")).toBeInTheDocument();
    });
  });

  describe("header", () => {
    it("renders custom header content alongside the title", () => {
      render(
        <Card
          title="Usage"
          header={<button data-testid="header-action">Export</button>}
        />
      );
      expect(screen.getByTestId("header-action")).toBeInTheDocument();
    });

    it("renders a header region even without a title or subtitle", () => {
      render(<Card header={<span data-testid="header-only">Actions</span>} />);
      expect(screen.getByTestId("header-only")).toBeInTheDocument();
    });
  });

  describe("footer", () => {
    it("renders footer content", () => {
      render(
        <Card title="Usage" footer={<span data-testid="footer">Footer</span>} />
      );
      expect(screen.getByTestId("footer")).toBeInTheDocument();
    });

    it("does not render a footer region when footer is omitted", () => {
      const { container } = render(<Card title="Usage">{CONTENT}</Card>);
      expect(container.querySelector(".border-t")).not.toBeInTheDocument();
    });
  });

  describe("divider", () => {
    it("renders a divider border below the header and above the footer when divider is true", () => {
      const { container } = render(
        <Card title="Usage" footer="Footer" divider>
          {CONTENT}
        </Card>
      );
      expect(container.querySelector(".border-b")).toBeInTheDocument();
      expect(container.querySelector(".border-t")).toBeInTheDocument();
    });

    it("does not render divider borders when divider is false", () => {
      const { container } = render(
        <Card title="Usage" footer="Footer">
          {CONTENT}
        </Card>
      );
      expect(container.querySelector(".border-b")).not.toBeInTheDocument();
      expect(container.querySelector(".border-t")).not.toBeInTheDocument();
    });
  });

  it("renders title, subtitle, header, children, and footer together", () => {
    render(
      <Card
        title="Usage"
        subtitle="Last 30 days"
        header={<span data-testid="header-only">Actions</span>}
        footer={<span data-testid="footer">Footer</span>}
      >
        {CONTENT}
      </Card>
    );

    expect(screen.getByText("Usage")).toBeInTheDocument();
    expect(screen.getByText("Last 30 days")).toBeInTheDocument();
    expect(screen.getByTestId("header-only")).toBeInTheDocument();
    expect(screen.getByText(CONTENT)).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });
});
