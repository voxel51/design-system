/**
 * Wrapper type which enforces a canonical ID for a data element.
 */
export type Descriptor<T> = {
  id: string;
  data: T;
};
