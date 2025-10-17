import { BaseButton, BaseButtonProps } from "@/components/Button/BaseButton";

export type SecondaryButtonProps = Omit<BaseButtonProps, "color" | "variant">;

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  ...props
}: SecondaryButtonProps) => {
  return (
    <BaseButton color="secondary" variant="outlined" {...props}>
      {children}
    </BaseButton>
  );
};
