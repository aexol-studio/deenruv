import { Middleware } from './middleware.js';
const buildEndpoint = (url: string | URL, endpoint: string) => {
  url = new URL(url);
  url.pathname = `${endpoint.replace(/\/+$/, '')}/${url.pathname.replace(/^\/+/, '')}`;
  return url;
};

export const endpoint =
  (endpoint: string): Middleware =>
  (next) =>
  (info, init) =>
    next(buildEndpoint(info, endpoint), init);
