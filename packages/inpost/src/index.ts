import { Organizations } from "./api/organizations.js";
import { Shipments } from "./api/shipments.js";
import { Middleware, auth, endpoint } from "./middleware/index.js";
export class Client {
  private auth: Middleware;
  private base: URL;
  constructor(
    private opts: {
      host: string;
      version?: string;
      apiKey: string;
    },
  ) {
    this.auth = auth(this.opts.apiKey);
    this.base = new URL(`https://${this.opts.host}`);
  }
  private doRequest() {
    return (info: string | URL, init?: RequestInit) => {
      return endpoint(this.opts.version || "v1")(this.auth(fetch))(info, init);
    };
  }
  organizations() {
    return new Organizations(
      this.base,
      endpoint("organizations")(this.doRequest()),
    );
  }

  shipments() {
    return new Shipments(this.base, endpoint("shipments")(this.doRequest()));
  }
}
export * from "./models/index.js";
