import { Typography, TypographyProps } from "@mui/material";

export const Text = (props: TypographyProps) => {
  const { children, ...rest } = props;
  return <Typography {...rest}>{children}</Typography>;
};
