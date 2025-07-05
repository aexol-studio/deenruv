import { FetchFn, Middleware } from './middleware.js';
import { InvalidResponseStatus } from '../error.js';

export const is2xx: Middleware =
  <U>(next: FetchFn<U>) =>
  async (info, init) => {
    const res = await next(info, init);
    if (res.status < 200 || res.status > 299) {
      console.log(await res.text());
      throw new InvalidResponseStatus(
        `expected 2xx response, got ${res.status}`,
        res,
      );
    }
    return res;
  };
