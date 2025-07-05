export type FetchFn<T = unknown> = (
  info: string | URL,
  init?: RequestInit,
) => Promise<T & Response>;
export interface Middleware<T = unknown> {
  <U = unknown>(next: FetchFn<U>): FetchFn<T & U>;
}
