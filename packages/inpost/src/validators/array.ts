export const isArray =
  <T>(fn: (v: unknown) => v is T) =>
  (v: unknown): v is T[] =>
    Array.isArray(v) && v.filter(fn).length === v.length;
