import { Button, ButtonProps } from "@mui/material";

export type BaseButtonProps = ButtonProps;

export const BaseButton: React.FC<BaseButtonProps> = ({
  children,
  sx,
  ...props
}: BaseButtonProps) => {
  return (
    <Button
      sx={{
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 1,
        py: 2,
        px: 3.5,
        gap: 1.5,
        textTransform: "none",
        boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};
