import { loremIpsum } from "lorem-ipsum";

export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const generateWords = (count: number): string =>
  loremIpsum({
    count,
    units: "words",
  });

export const generateSentences = (count: number): string =>
  loremIpsum({
    count,
    units: "sentences",
  });

export const generateParagraphs = (count: number): string =>
  loremIpsum({
    count,
    units: "paragraphs",
  });
