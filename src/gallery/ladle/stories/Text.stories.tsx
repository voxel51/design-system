import { Text } from "@/components/Text";

export const PlainText = () => <Text>plain text</Text>;
export const BoldText = () => (
  <Text sx={{ fontWeight: "bold" }}>bold text</Text>
);
export const ItalicText = () => (
  <Text sx={{ fontStyle: "italic" }}>italic text</Text>
);
