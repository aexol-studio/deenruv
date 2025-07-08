import {
  Asset,
  LanguageCode,
  PluginCommonModule,
  DeenruvPlugin,
} from "@deenruv/core";
import { AdminUiExtension } from "@deenruv/ui-devkit/compiler";
import path from "path";
import { InpostService } from "./services/inpost.service.js";
import { InpostPluginOptions } from "./types.js";
import { INPOST_PLUGIN_OPTIONS } from "./constants.js";
import { AdminExtension } from "./extensions/inpost.extension.js";
import { InpostAdminResolver } from "./api/inpost-admin.resolver.js";
import { InpostController } from "./controllers/inpost.controller.js";
import { inpostFulfillmentHandler } from "./handlers/inpost.fulfillment.js";
import { InpostConfigEntity } from "./entities/inpost-config-entity.js";
import { InpostRefEntity } from "./entities/inpost-ref-entity.js";

@DeenruvPlugin({
  imports: [PluginCommonModule],
  compatibility: "^0.1.0",
  entities: [InpostConfigEntity, InpostRefEntity],
  providers: [
    { provide: INPOST_PLUGIN_OPTIONS, useValue: InpostPlugin.options },
    InpostService,
  ],
  controllers: [InpostController],
  configuration: (config) => {
    config.shippingOptions.fulfillmentHandlers.push(inpostFulfillmentHandler());
    config.customFields.Fulfillment.push({
      name: "inpostLabel",
      type: "relation",
      entity: Asset,
      label: [
        {
          languageCode: LanguageCode.en,
          value: "Inpost label",
        },
        {
          languageCode: LanguageCode.pl,
          value: "Etykieta inpost",
        },
      ],
    });
    config.customFields.Order.push({
      name: "inpostPoint",
      type: "string",
      nullable: true,
      label: [
        {
          languageCode: LanguageCode.en,
          value: "Inpost Pickup Point",
        },
        {
          languageCode: LanguageCode.pl,
          value: "Paczkomat Inpost",
        },
      ],
    });
    return config;
  },
  adminApiExtensions: {
    schema: AdminExtension,
    resolvers: [InpostAdminResolver],
  },
})
export class InpostPlugin {
  static options: InpostPluginOptions;
  static init(options: InpostPluginOptions = {}) {
    this.options = options;
    return this;
  }

  static ui: AdminUiExtension = {
    id: "InPost-extension",
    extensionPath: path.join(__dirname, "ui"),
    providers: ["providers.ts"],
    globalStyles: [path.join(__dirname, "ui/styles/overwrite.css")],
    translations: {},
  };
}
