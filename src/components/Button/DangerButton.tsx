import { BaseButton, BaseButtonProps } from "@/components/Button/BaseButton";

export type DangerButtonProps = Omit<BaseButtonProps, "color" | "variant">;

export const DangerButton: React.FC<DangerButtonProps> = ({
  children,
  ...props
}: DangerButtonProps) => {
  return (
    <BaseButton color="error" variant="contained" {...props}>
      {children}
    </BaseButton>
  );
};
