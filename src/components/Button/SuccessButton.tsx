import { BaseButton, BaseButtonProps } from "@/components/Button/BaseButton";

export type SuccessButtonProps = Omit<BaseButtonProps, "color" | "variant">;

export const SuccessButton: React.FC<SuccessButtonProps> = ({
  children,
  ...props
}: SuccessButtonProps) => {
  return (
    <BaseButton color="success" variant="contained" {...props}>
      {children}
    </BaseButton>
  );
};
