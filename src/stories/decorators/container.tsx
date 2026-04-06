import { FC, ReactNode } from "react";

export type ContainerSize = "sm" | "md" | "lg";

export const Container = ({
  size,
  children,
}: {
  size: ContainerSize;
  children: ReactNode;
}) => <div className={`w-${size}`}>{children}</div>;

export const withContainer =
  (size: ContainerSize = "lg") =>
  (Story: FC) => {
    return (
      <Container size={size}>
        <Story />
      </Container>
    );
  };
