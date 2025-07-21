import { FetchFn, Middleware } from "./middleware.js";
import { InvalidResponseStatus } from "../error.js";

export const is2xx: Middleware =
  <U>(next: FetchFn<U>) =>
  async (info, init) => {
    const res = await next(info, init);
    if (res.status < 200 || res.status > 299) {
      if ((process.env.LOG_LEVEL || "").toLowerCase() === "debug") {
        console.log(await res.text());
      }
      // Let user know message from the response if available
      let error: { message: string; details: string };
      try {
        error = await res.json();
      } catch {
        error = {
          message: "Unknown error",
          details: "No additional details available",
        };
      }
      throw new InvalidResponseStatus(
        `${error.message}: ${error.details}, (status: ${res.status})`,
        res,
      );
    }
    return res;
  };
