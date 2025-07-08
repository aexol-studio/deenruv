import { Middleware } from './middleware.js';

export const jsonRequest =
  (rawBody: unknown): Middleware =>
  (next) =>
  async (info, init) => {
    const headers = new Headers(init?.headers);
    headers.set('content-type', `application/json`);
    const body = JSON.stringify(rawBody);
    return next(info, {
      ...init,
      headers,
      body,
    });
  };
