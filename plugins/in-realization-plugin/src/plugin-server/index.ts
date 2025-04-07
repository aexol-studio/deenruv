import {
  PluginCommonModule,
  DeenruvPlugin,
  LanguageCode,
  Asset,
  OrderProcess,
} from "@deenruv/core";
import { StorageService } from "./services/storage.service.js";
import { PDFService } from "./services/pdf.service.js";
import { OrderRegisterService } from "./services/order-register.service.js";
import { InRealizationPluginOptions, PLUGIN_INIT_OPTIONS } from "./consts.js";
import { OrderRealizationEntity } from "./entities/order-realization.entity.js";
import {
  AdminExtension,
  ShopExtension,
} from "./extensions/realization.extension.js";
import { OrderResolver } from "./api/order.resolver.js";
import { AdminResolver } from "./api/admin.resolver.js";
import { AdminOrderResolver } from "./api/admin-order.resolver.js";

const inRealizationProcess: OrderProcess<"InRealization"> = {
  transitions: {
    PaymentSettled: {
      to: [
        "InRealization",
        "Cancelled",
        "Modifying",
        "ArrangingAdditionalPayment",
      ],
      mergeStrategy: "replace",
    },
    InRealization: {
      to: [
        "PartiallyDelivered",
        "Delivered",
        "PartiallyShipped",
        "Shipped",
        "Cancelled",
        "Modifying",
        "ArrangingAdditionalPayment",
      ],
    },
  },
  onTransitionStart: async (from, to, { ctx, order }) => {},
};

@DeenruvPlugin({
  compatibility: "^0.0.20",
  imports: [PluginCommonModule],
  providers: [
    OrderRegisterService,
    PDFService,
    StorageService,
    {
      provide: PLUGIN_INIT_OPTIONS,
      useFactory: () => InRealizationPlugin.config,
    },
  ],
  entities: [OrderRealizationEntity],
  adminApiExtensions: {
    schema: AdminExtension,
    resolvers: [AdminResolver, AdminOrderResolver],
  },
  shopApiExtensions: {
    schema: ShopExtension,
    resolvers: [OrderResolver],
  },
  configuration: (config) => {
    config.orderOptions.process.push(inRealizationProcess);
    return config;
  },
})
export class InRealizationPlugin {
  static config: InRealizationPluginOptions;

  static init(config: InRealizationPluginOptions) {
    this.config = config;
    return this;
  }
}
