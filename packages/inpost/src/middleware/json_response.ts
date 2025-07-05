import { FetchFn, Middleware } from './middleware.js';
import { InvalidBody } from '../error.js';
export type JSONResponse<T> = {
  jsonResponse: T;
};
export const jsonResponse =
  <T>(validate: (v: unknown) => v is T): Middleware<JSONResponse<T>> =>
  <U>(next: FetchFn<U>) =>
  async (info, init) => {
    const res = await next(info, init);
    type ResponseType = Response & JSONResponse<T> & U;
    const data = await res.json();
    if (!validate(data)) {
      throw new InvalidBody('invalid response body');
    }
    (res as ResponseType).jsonResponse = data;
    return res as ResponseType;
  };
