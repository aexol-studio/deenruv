import { Inject, Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import { Redis } from "ioredis";
import { loggerCtx, PRZELEWY24_PLUGIN_OPTIONS } from "../constants.js";
import { Przelewy24PluginConfiguration } from "../types.js";

export type BlikStatus = "pending" | "success" | "failed" | "timeout";

export interface BlikStatusPayload {
  status: BlikStatus;
  orderCode: string;
  orderState?: string;
  message?: string;
  timestamp: number;
}

type BlikStatusHandler = (payload: BlikStatusPayload) => void;

/**
 * Redis PubSub service for BLIK SSE multi-instance fanout.
 * Uses separate Redis connections for publisher and subscriber (required by Redis).
 */
@Injectable()
export class BlikPubSubService implements OnModuleDestroy {
  private publisher: Redis | null = null;
  private subscriber: Redis | null = null;
  private readonly subscriptions = new Map<
    string,
    Set<{ handler: BlikStatusHandler; unsubscribe: () => void }>
  >();
  private isEnabled = false;

  constructor(
    @Inject(PRZELEWY24_PLUGIN_OPTIONS)
    private options: Przelewy24PluginConfiguration,
  ) {
    if (this.options.redisOptions) {
      this.isEnabled = true;
      this.initializeRedis();
    } else {
      Logger.warn(
        "Redis options not provided - BLIK SSE will only work on single instance",
        loggerCtx,
      );
    }
  }

  private initializeRedis(): void {
    if (!this.options.redisOptions) return;

    try {
      this.publisher = new Redis(this.options.redisOptions);
      this.subscriber = new Redis(this.options.redisOptions);

      this.publisher.on("error", (err: Error) => {
        Logger.error(`Redis publisher error: ${err.message}`, loggerCtx);
      });

      this.subscriber.on("error", (err: Error) => {
        Logger.error(`Redis subscriber error: ${err.message}`, loggerCtx);
      });

      this.subscriber.on("message", (channel: string, message: string) => {
        this.handleMessage(channel, message);
      });

      Logger.log("BLIK PubSub Redis connections initialized", loggerCtx);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      Logger.error(
        `Failed to initialize Redis for BLIK PubSub: ${msg}`,
        loggerCtx,
      );
      this.isEnabled = false;
    }
  }

  private getChannelName(orderCode: string): string {
    return `p24:blik:${orderCode}`;
  }

  private handleMessage(channel: string, message: string): void {
    try {
      const payload = JSON.parse(message) as BlikStatusPayload;
      const handlers = this.subscriptions.get(channel);
      if (handlers) {
        handlers.forEach(({ handler }) => {
          try {
            handler(payload);
          } catch (err) {
            const msg = err instanceof Error ? err.message : "Unknown error";
            Logger.error(`Error in BLIK status handler: ${msg}`, loggerCtx);
          }
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      Logger.error(`Failed to parse BLIK PubSub message: ${msg}`, loggerCtx);
    }
  }

  /**
   * Publish a BLIK status update to all instances
   */
  async publishBlikStatus(
    orderCode: string,
    payload: Omit<BlikStatusPayload, "timestamp">,
  ): Promise<void> {
    const fullPayload: BlikStatusPayload = {
      ...payload,
      timestamp: Date.now(),
    };

    if (this.isEnabled && this.publisher) {
      const channel = this.getChannelName(orderCode);
      try {
        await this.publisher.publish(channel, JSON.stringify(fullPayload));
        Logger.debug(
          `Published BLIK status to ${channel}: ${payload.status}`,
          loggerCtx,
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        Logger.error(`Failed to publish BLIK status: ${msg}`, loggerCtx);
      }
    }

    // Also notify local subscribers directly (for single-instance or fallback)
    const channel = this.getChannelName(orderCode);
    const handlers = this.subscriptions.get(channel);
    if (handlers && !this.isEnabled) {
      handlers.forEach(({ handler }) => {
        try {
          handler(fullPayload);
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Unknown error";
          Logger.error(`Error in local BLIK status handler: ${msg}`, loggerCtx);
        }
      });
    }
  }

  /**
   * Subscribe to BLIK status updates for an order
   * Returns an unsubscribe function
   */
  async subscribeBlikStatus(
    orderCode: string,
    handler: BlikStatusHandler,
  ): Promise<() => void> {
    const channel = this.getChannelName(orderCode);

    const unsubscribe = () => {
      const handlers = this.subscriptions.get(channel);
      if (handlers) {
        const entry = [...handlers].find((h) => h.handler === handler);
        if (entry) {
          handlers.delete(entry);
        }
        if (handlers.size === 0) {
          this.subscriptions.delete(channel);
          if (this.isEnabled && this.subscriber) {
            this.subscriber.unsubscribe(channel).catch((err: Error) => {
              const msg = err instanceof Error ? err.message : "Unknown error";
              Logger.error(
                `Failed to unsubscribe from ${channel}: ${msg}`,
                loggerCtx,
              );
            });
          }
        }
      }
    };

    const entry = { handler, unsubscribe };

    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, new Set());
      if (this.isEnabled && this.subscriber) {
        try {
          await this.subscriber.subscribe(channel);
          Logger.debug(`Subscribed to BLIK channel: ${channel}`, loggerCtx);
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Unknown error";
          Logger.error(`Failed to subscribe to ${channel}: ${msg}`, loggerCtx);
        }
      }
    }

    this.subscriptions.get(channel)?.add(entry);

    return unsubscribe;
  }

  async onModuleDestroy(): Promise<void> {
    // Cleanup all subscriptions
    for (const [channel, handlers] of this.subscriptions) {
      handlers.forEach(({ unsubscribe }) => unsubscribe());
    }
    this.subscriptions.clear();

    // Close Redis connections
    if (this.publisher) {
      await this.publisher.quit();
      this.publisher = null;
    }
    if (this.subscriber) {
      await this.subscriber.quit();
      this.subscriber = null;
    }

    Logger.log("BLIK PubSub Redis connections closed", loggerCtx);
  }
}
