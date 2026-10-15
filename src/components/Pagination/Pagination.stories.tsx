import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import {
  Pagination,
  type PaginationAlign,
  type PaginationJump,
  type PaginationPart,
} from "@voxel51/voodo";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  parameters: { layout: "padded" },
};

type Story = StoryObj<typeof Pagination>;

interface ControlledProps {
  rows?: number;
  page?: number;
  showTotal?: boolean;
  showSize?: boolean;
  disabled?: boolean;
  align?: PaginationAlign;
  jump?: PaginationJump;
  hide?: PaginationPart[];
}

const Controlled = ({
  rows = 312,
  page: initialPage = 1,
  showTotal = true,
  showSize = true,
  disabled,
  align,
  jump,
  hide,
}: ControlledProps) => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(25);
  return (
    <Pagination
      page={page}
      pageSize={pageSize}
      pageCount={Math.max(1, Math.ceil(rows / pageSize))}
      total={showTotal ? rows : undefined}
      onPageChange={setPage}
      onPageSizeChange={showSize ? setPageSize : undefined}
      disabled={disabled}
      align={align}
      jump={jump}
      hide={hide}
    />
  );
};

export const Default: Story = { render: () => <Controlled /> };

export const ManyPages: Story = {
  render: () => <Controlled rows={5000} page={20} />,
};

export const FewPages: Story = { render: () => <Controlled rows={60} /> };

export const WithoutTotal: Story = {
  render: () => <Controlled showTotal={false} />,
};

export const WithoutPageSizeSelect: Story = {
  render: () => <Controlled showSize={false} />,
};

export const Disabled: Story = { render: () => <Controlled disabled /> };

export const SinglePage: Story = { render: () => <Controlled rows={10} /> };

export const Narrow: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <Controlled />
    </div>
  ),
};

export const JumpEllipsis: Story = {
  render: () => <Controlled rows={5000} page={20} jump="ellipsis" />,
};

export const JumpBoth: Story = {
  render: () => <Controlled rows={5000} page={20} jump="both" />,
};

export const Centered: Story = {
  render: () => <Controlled align="center" />,
};

export const CenteredMinimal: Story = {
  render: () => (
    <Controlled
      align="center"
      showSize={false}
      hide={["summary", "jump", "edges"]}
    />
  ),
};

export const PrevNextOnly: Story = {
  render: () => <Controlled hide={["pages", "edges", "jump"]} />,
};

export default meta;
