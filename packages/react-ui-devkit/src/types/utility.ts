export type ExcludeUndefined<T> = {
  [V in keyof T]: Exclude<V, undefined>;
};
