import { Stack } from "@mui/material";
import { Button } from "@/components/Button/Button";

export const ButtonStyles = () => {
  return (
    <Stack direction="row" spacing={8}>
      <Button buttonType="base">Base button</Button>
      <Button buttonType="primary">Primary button</Button>
      <Button buttonType="secondary">Secondary button</Button>
      <Button buttonType="danger">Danger button</Button>
      <Button buttonType="success">Success button</Button>
    </Stack>
  );
};
