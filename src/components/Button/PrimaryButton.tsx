import { BaseButton, BaseButtonProps } from "./BaseButton";

export type PrimaryButtonProps = Omit<BaseButtonProps, "color" | "variant">;

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  ...props
}: PrimaryButtonProps) => {
  return (
    <BaseButton color="primary" variant="contained" {...props}>
      {children}
    </BaseButton>
  );
};
