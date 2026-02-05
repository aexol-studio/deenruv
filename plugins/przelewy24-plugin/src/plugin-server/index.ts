import { PluginCommonModule, DeenruvPlugin } from "@deenruv/core";
import { Przelewy24Controller } from "./controllers/przelewy24.controller.js";
import { PRZELEWY24_PLUGIN_OPTIONS } from "./constants.js";
import { Przelewy24PluginConfiguration } from "./types.js";
import { Przelewy24Service } from "./services/przelewy24.service.js";
import { przelewy24BlikPaymentMethodHandler } from "./handlers/przelewy24-blik.handler.js";
import { przelewy24PaymentMethodHandler } from "./handlers/przelewy24.handler.js";
import { Przelewy24RegularPaymentEvent } from "./email-events.js";
import { Przelewy24ShopExtension } from "./extensions/index.js";
import { Przelewy24ShopResolver } from "./resolvers/index.js";

@DeenruvPlugin({
  compatibility: "0.0.1",
  imports: [PluginCommonModule],
  controllers: [Przelewy24Controller],
  shopApiExtensions: {
    schema: Przelewy24ShopExtension,
    resolvers: [Przelewy24ShopResolver],
  },
  providers: [
    Przelewy24Service,
    {
      provide: PRZELEWY24_PLUGIN_OPTIONS,
      useFactory: () => Przelewy24Plugin.options,
    },
  ],
  configuration: (config) => {
    [
      przelewy24BlikPaymentMethodHandler,
      przelewy24PaymentMethodHandler,
    ].forEach((handler) => {
      config.paymentOptions.paymentMethodHandlers.push(handler);
    });

    return config;
  },
})
class Przelewy24Plugin {
  static options: Przelewy24PluginConfiguration;

  static init(options: Przelewy24PluginConfiguration) {
    this.options = options;
    return this;
  }
}

export { Przelewy24Plugin, Przelewy24RegularPaymentEvent };
