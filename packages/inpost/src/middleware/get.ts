import { Middleware } from './middleware.js';
export const get: Middleware = (next) => (info, init) =>
  next(info, {
    ...init,
    method: 'GET',
  });
