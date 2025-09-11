import type { Order, RequestContext, DeenruvEvent } from "@deenruv/core";

// Constructor for DeenruvEvent subclasses that requires (ctx, order) first
export type DeenruvEventCtor<E extends DeenruvEvent = DeenruvEvent> = new (
  ctx: RequestContext,
  order: Order,
) => E;

export interface OrderReminderRule {
  // Milliseconds threshold: orders older than this are considered for reminders
  orderAgeMs: number;
  // Event class to publish for each qualifying order
  eventCtor: DeenruvEventCtor;
  // Only process orders in this state
  orderState: string;
  // Unique id to mark per-rule send in JSON map
  uniqueId: string;
  // Optional: batch size for processing orders
  batchSize?: number;
  // Optional: consider only orders created on/after this date
  // Prevents spamming old historical orders when enabling the plugin later
  orderFrom?: Date;
}

// Plugin now takes an array of rules
export type OrderRemindmerPluginOptions = OrderReminderRule[];
