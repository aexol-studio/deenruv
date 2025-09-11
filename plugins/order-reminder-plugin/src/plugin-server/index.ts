import { PluginCommonModule, DeenruvPlugin } from "@deenruv/core";
import { OrderReminderController } from "./controllers/order-reminder.controller.js";
import { OrderReminderService } from "./services/order-reminder.service.js";
import { ORDER_REMINDMER_PLUGIN_OPTIONS } from "./constants.js";
import { OrderRemindmerPluginOptions } from "./types.js";
import { OrderReminderEntity } from "./entities/order-reminder.entity.js";

@DeenruvPlugin({
  compatibility: "^0.0.40",
  imports: [PluginCommonModule],
  entities: [OrderReminderEntity],
  controllers: [OrderReminderController],
  providers: [
    {
      provide: ORDER_REMINDMER_PLUGIN_OPTIONS,
      useFactory: () => OrderReminderPlugin.options,
    },
    OrderReminderService,
  ],
})
class OrderReminderPlugin {
  private static options: OrderRemindmerPluginOptions;

  static init(options: OrderRemindmerPluginOptions) {
    this.options = options;
    return this;
  }
}

export { OrderReminderPlugin };
