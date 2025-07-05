export const isOptional =
  <T>(fn: (v: unknown) => v is T) =>
  (v: unknown): v is T | undefined | null =>
    v === undefined || v === null || fn(v);
