import { loremIpsum } from "lorem-ipsum";

export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Stories are fixtures: a story must render the same text on every load so
// the page-object aria snapshots (src/components/*/__aria__) stay stable.
// mulberry32 with a fixed seed; the sequence restarts with each module load.
let state = 0x5171f0;
const random = (): number => {
  state = (state + 0x6d2b79f5) | 0;
  let t = Math.imul(state ^ (state >>> 15), 1 | state);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const generateWords = (count: number): string =>
  loremIpsum({
    count,
    units: "words",
    random,
  });

export const generateSentences = (count: number): string =>
  loremIpsum({
    count,
    units: "sentences",
    random,
  });

export const generateParagraphs = (count: number): string =>
  loremIpsum({
    count,
    units: "paragraphs",
    random,
  });
