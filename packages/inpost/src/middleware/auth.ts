import { Middleware } from './middleware.js';
export const auth =
  (token: string): Middleware =>
  (next) =>
  (info, init) => {
    const headers = new Headers(init?.headers);
    headers.set('authorization', `Bearer ${token}`);
    return next(info, {
      ...init,
      headers,
    });
  };
