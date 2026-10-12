import { fireEvent, render, screen } from "@testing-library/react";

import { UploadList } from "./UploadList";

const items = [
  { id: "a", name: "a.jpg", kind: "JPG", size: 2048 },
  { id: "b", name: "labels.json", kind: "JSON labels", size: 512 },
];

describe("UploadList", () => {
  it("summarizes the files and removes one or all", () => {
    const onRemove = jest.fn();
    const onRemoveAll = jest.fn();
    render(
      <UploadList items={items} onRemove={onRemove} onRemoveAll={onRemoveAll} />
    );

    expect(screen.getByText("2 files · 3 KB")).toBeInTheDocument();
    expect(screen.getByText("JSON labels")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Remove labels.json" }));
    fireEvent.click(screen.getByRole("button", { name: "Remove all" }));

    expect(onRemove).toHaveBeenCalledWith("b");
    expect(onRemoveAll).toHaveBeenCalledTimes(1);
  });

  it("is read-only without handlers and takes a custom summary", () => {
    render(<UploadList items={items} summary="1,200 files" />);

    expect(screen.getByText("1,200 files")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
