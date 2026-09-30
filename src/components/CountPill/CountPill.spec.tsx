import { render, screen } from "@testing-library/react";

import { Size } from "@/types";

import { CountPill, CountPillTone } from "./CountPill";

describe("CountPill", () => {
  it("formats the count", () => {
    render(<CountPill value={1280} />);
    expect(screen.getByText("1,280")).toBeInTheDocument();
  });

  it("sizes by token", () => {
    render(<CountPill value={4} size={Size.Lg} />);
    expect(screen.getByText("4")).toHaveClass("h-5", "text-code-primary");
  });

  it("fills with the status surface for a tone", () => {
    render(<CountPill value={4} tone={CountPillTone.Error} />);
    expect(screen.getByText("4")).toHaveClass("bg-content-status-failed-bg");
  });
});
