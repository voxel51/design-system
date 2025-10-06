import { ILoremIpsumParams, loremIpsum } from "lorem-ipsum";

export const generateText = () =>
  "The quick brown fox jumps over the lazy dog 1,234,567,890";

export const lorem = (params?: ILoremIpsumParams) => loremIpsum(params);
