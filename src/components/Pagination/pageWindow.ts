export type PageItem = number | "ellipsis-start" | "ellipsis-end";

export function getPageWindow(
  page: number,
  pageCount: number,
  siblingCount = 1,
  boundaryCount = 1
): PageItem[] {
  const total = boundaryCount * 2 + siblingCount * 2 + 3;
  if (pageCount <= total) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  const range = (from: number, to: number): number[] =>
    Array.from({ length: to - from + 1 }, (_, i) => from + i);

  const start = range(1, boundaryCount);
  const end = range(pageCount - boundaryCount + 1, pageCount);
  const left = Math.max(
    Math.min(
      page - siblingCount,
      pageCount - boundaryCount - siblingCount * 2 - 1
    ),
    boundaryCount + 2
  );
  const right = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    pageCount - boundaryCount - 1
  );

  return [
    ...start,
    left > boundaryCount + 2 ? "ellipsis-start" : boundaryCount + 1,
    ...range(left, right),
    right < pageCount - boundaryCount - 1
      ? "ellipsis-end"
      : pageCount - boundaryCount,
    ...end,
  ];
}
