import { render, screen } from "@testing-library/react";

import { Highlighted } from "./Highlighted";

const SOURCE = 'print("hello")';

describe("Highlighted", () => {
  afterEach(() => {
    document.documentElement.classList.remove("dark");
  });

  it("should render the code it is given", () => {
    render(<Highlighted code={SOURCE} />);

    expect(screen.getByText(/print/)).toBeInTheDocument();
  });

  it("should mark the code up rather than leave it bare", () => {
    const { container } = render(<Highlighted code={SOURCE} />);

    expect(container.querySelectorAll("span").length).toBeGreaterThan(1);
  });

  it("should nest inside a block rather than open its own", () => {
    const { container } = render(<Highlighted code={SOURCE} />);

    expect(container.querySelector("pre")).toBeNull();
  });

  it("should follow the color mode", () => {
    const { container: light } = render(<Highlighted code={SOURCE} />);
    const lightMarkup = light.innerHTML;

    document.documentElement.classList.add("dark");
    const { container: dark } = render(<Highlighted code={SOURCE} />);

    expect(dark.innerHTML).not.toBe(lightMarkup);
  });
});
