import { BaseButton, BaseButtonProps } from "@/components/Button/BaseButton";
import { DangerButton } from "@/components/Button/DangerButton";
import { PrimaryButton } from "@/components/Button/PrimaryButton";
import { SecondaryButton } from "@/components/Button/SecondaryButton";
import { SuccessButton } from "@/components/Button/SuccessButton";

export type ButtonType =
  | "base"
  | "primary"
  | "secondary"
  | "danger"
  | "success";

export type ButtonProps = Omit<BaseButtonProps, "color" | "variant"> & {
  buttonType: ButtonType;
};

const buttonMap: Record<ButtonType, React.FC> = {
  base: BaseButton,
  primary: PrimaryButton,
  secondary: SecondaryButton,
  danger: DangerButton,
  success: SuccessButton,
};

export const Button: React.FC<ButtonProps> = ({
  buttonType,
  children,
  ...props
}: ButtonProps) => {
  const ButtonComponent = buttonMap[buttonType];
  return <ButtonComponent {...props}>{children}</ButtonComponent>;
};
