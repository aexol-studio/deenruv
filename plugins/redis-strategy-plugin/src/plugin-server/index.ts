import {
  CachedSession,
  Logger,
  SessionCacheStrategy,
  DeenruvPlugin,
} from "@deenruv/core";
import { Redis, RedisOptions } from "ioredis";

export interface RedisSessionCachePluginOptions {
  redisOptions: RedisOptions;
  namespace?: string;
  defaultTTL?: number;
}

const loggerCtx = "RedisSessionCacheStrategy";
const DEFAULT_NAMESPACE = "deenruv-session-cache";
const DEFAULT_TTL = 86400;

export class RedisSessionCacheStrategy implements SessionCacheStrategy {
  private client: Redis;
  constructor(private options: RedisSessionCachePluginOptions) {}

  init() {
    this.client = new Redis(this.options.redisOptions);
    this.client.on("error", (err) =>
      Logger.error(err.message, loggerCtx, err.stack),
    );
  }

  async destroy() {
    await this.client.quit();
  }

  async get(sessionToken: string): Promise<CachedSession | undefined> {
    try {
      const retrieved = await this.client.get(this.namespace(sessionToken));
      if (retrieved) {
        try {
          return JSON.parse(retrieved);
        } catch {
          Logger.error(`Could not parse cached session data`, loggerCtx);
        }
      }
    } catch {
      Logger.error(`Could not get cached session`, loggerCtx);
    }
  }

  async set(session: CachedSession) {
    try {
      await this.client.set(
        this.namespace(session.token),
        JSON.stringify(session),
        "EX",
        this.options.defaultTTL ?? DEFAULT_TTL,
      );
    } catch {
      Logger.error(`Could not set cached session`, loggerCtx);
    }
  }

  async delete(sessionToken: string) {
    try {
      await this.client.del(this.namespace(sessionToken));
    } catch {
      Logger.error(`Could not delete cached session`, loggerCtx);
    }
  }

  clear() {
    // this.client.flushdb();
  }

  private namespace(key: string) {
    return `${this.options.namespace ?? DEFAULT_NAMESPACE}:${key}`;
  }
}

@DeenruvPlugin({
  configuration: (config) => {
    config.authOptions.sessionCacheStrategy = new RedisSessionCacheStrategy(
      RedisSessionCachePlugin.options,
    );
    return config;
  },
})
export class RedisSessionCachePlugin {
  static options: RedisSessionCachePluginOptions;
  static init(options: RedisSessionCachePluginOptions) {
    this.options = options;
    return this;
  }
}
