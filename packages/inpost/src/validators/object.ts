export const isObject = (v: unknown): v is object =>
  !!v && typeof v === 'object';
