import { Middleware } from './middleware.js';

export const post: Middleware = (next) => (info, init) =>
  next(info, {
    ...init,
    method: 'POST',
  });
