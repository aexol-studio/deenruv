import { Inject, Injectable } from "@nestjs/common";

import {
  TransactionalConnection,
  RequestContext,
  EventBus,
  Order,
} from "@deenruv/core";
import { ORDER_REMINDMER_PLUGIN_OPTIONS } from "../constants.js";
import { OrderRemindmerPluginOptions, OrderReminderRule } from "../types.js";
import { OrderReminderEntity } from "../entities/order-reminder.entity.js";
import { In } from "typeorm";

@Injectable()
export class OrderReminderService {
  constructor(
    private connection: TransactionalConnection,
    private eventBus: EventBus,
    @Inject(ORDER_REMINDMER_PLUGIN_OPTIONS)
    private options: OrderRemindmerPluginOptions
  ) {}

  async run(ctx: RequestContext): Promise<{ processed: number }> {
    const orderRepo = this.connection.getRepository(ctx, Order);
    const reminderRepo = this.connection.getRepository(
      ctx,
      OrderReminderEntity
    );

    let processed = 0;

    const rules: OrderReminderRule[] = Array.isArray(this.options)
      ? this.options
      : [];

    for (const rule of rules) {
      const threshold = new Date(Date.now() - rule.orderAgeMs);
      const batchSize = rule.batchSize ?? 100;

      let fetched = 0;
      let lastUpdatedAt: Date | undefined;
      let lastId: string | number | undefined;

      while (true) {
        // Use NOT EXISTS to exclude orders already reminded for this rule
        let qb = orderRepo
          .createQueryBuilder("o")
          .leftJoinAndSelect("o.customer", "c")
          .leftJoinAndSelect("o.lines", "lines")
          .where("o.updatedAt < :threshold", { threshold })
          .andWhere("o.state = :state", { state: rule.orderState })
          .andWhere('o."customerId" IS NOT NULL')
          .andWhere("lines.id IS NOT NULL")
          .andWhere(
            `NOT EXISTS (
               SELECT 1 FROM ${
                 orderRepo.metadata.schema
                   ? '"' + orderRepo.metadata.schema + '".'
                   : ""
               }"${reminderRepo.metadata.tableName}" rem
               WHERE rem."orderId" = o.id
                 AND coalesce(rem."remindmerSend" ->> :key, 'false') = 'true'
             )`,
            { key: rule.uniqueId }
          );

        if (rule.orderFrom) {
          qb = qb.andWhere("o.createdAt >= :orderFrom", {
            orderFrom: rule.orderFrom,
          });
        }

        if (lastUpdatedAt) {
          qb = qb.andWhere(
            "(o.updatedAt > :lastUpdatedAt OR (o.updatedAt = :lastUpdatedAt AND o.id > :lastId))",
            { lastUpdatedAt, lastId }
          );
        }

        const oldOrders = await qb
          .orderBy("o.updatedAt", "ASC")
          .addOrderBy("o.id", "ASC")
          .take(batchSize)
          .getMany();

        fetched = oldOrders.length;
        if (fetched === 0) break;

        const ids = oldOrders.map((o) => o.id);
        const reminders = await reminderRepo.find({
          where: { order: { id: In(ids) } },
          relations: { order: true },
        });
        const remByOrderId = new Map<string, OrderReminderEntity>();
        for (const r of reminders) remByOrderId.set(r.order.id as string, r);

        for (const order of oldOrders) {
          let reminder = remByOrderId.get(order.id as string) ?? null;
          if (!reminder) {
            try {
              reminder = reminderRepo.create({
                order,
                remindmerSend: { [rule.uniqueId]: false },
              });
              reminder = await reminderRepo.save(reminder);
              remByOrderId.set(order.id as string, reminder);
            } catch {
              // Unique race: fetch existing
              reminder = await reminderRepo.findOne({
                where: { order: { id: order.id } },
                relations: { order: true },
              });
              if (!reminder) continue;
            }
          }

          if (reminder.remindmerSend?.[rule.uniqueId]) {
            lastUpdatedAt = order.updatedAt as unknown as Date;
            lastId = order.id;
            continue;
          }

          try {
            const EventCtor = rule.eventCtor;
            const eventInstance = new EventCtor(ctx, order);
            await this.eventBus.publish(eventInstance);
            reminder.remindmerSend = {
              ...(reminder.remindmerSend ?? {}),
              [rule.uniqueId]: true,
            };
            await reminderRepo.save(reminder);
            processed++;
          } catch {
            // Swallow individual order errors
          }

          lastUpdatedAt = order.updatedAt as unknown as Date;
          lastId = order.id;
        }
      }
    }

    return { processed };
  }
}
