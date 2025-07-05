import { Middleware } from "./middleware.js";

type Values =
  | string
  | [string, string][]
  | Record<string, string>
  | URLSearchParams;

const buildValues = (url: string | URL, values: Values) => {
  url = new URL(url);
  const params = new URLSearchParams(url.searchParams);
  for (const [key, value] of new URLSearchParams(values)) {
    params.set(key, value);
  }
  url.search = params.toString();
  return url;
};

export const values =
  (values: Values): Middleware =>
  (next) =>
  (info, init) =>
    next(buildValues(info, values), init);
