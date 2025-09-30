import { Text } from "@/components/Text";
import { generateText } from "../../utils";

export const TextStyles = () => (
  <>
    <Text>[default]: {generateText()}</Text>
    <Text variant="body1">[body1]: {generateText()}</Text>
    <Text variant="body2">[body2]: {generateText()}</Text>
  </>
);

export const TextColors = () => (
  <>
    <Text>[default]: {generateText()}</Text>
    <Text color="primary">[primary]: {generateText()}</Text>
    <Text color="secondary">[secondary]: {generateText()}</Text>
    <Text color="success">[success]: {generateText()}</Text>
    <Text color="error">[error]: {generateText()}</Text>
    <Text color="warning">[warning]: {generateText()}</Text>
    <Text color="info">[info]: {generateText()}</Text>
  </>
);
