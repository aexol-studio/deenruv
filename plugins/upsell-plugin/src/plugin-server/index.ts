import { PluginCommonModule, DeenruvPlugin } from "@deenruv/core";
import type { UpsellPluginOptions } from "./types.js";
import { ModuleRef } from "@nestjs/core";
import { UpsellEntity } from "./entities/upsell.entity.js";
import { UpsellService } from "./services/upsell.service.js";
import {
  AdminAPIExtension,
  ShopAPIExtension,
} from "./extensions/upsell.extension.js";
import { UpsellAdminResolver } from "./api/upsell-admin.resolver.js";
import { UpsellProductResolver } from "./api/upsell-product.resolver.js";

@DeenruvPlugin({
  compatibility: "0.0.1",
  imports: [PluginCommonModule],
  entities: [UpsellEntity],
  providers: [UpsellService],
  shopApiExtensions: {
    schema: ShopAPIExtension,
    resolvers: [UpsellProductResolver],
  },
  adminApiExtensions: {
    schema: AdminAPIExtension,
    resolvers: [UpsellProductResolver, UpsellAdminResolver],
  },
})
export class UpsellPlugin {
  static options: UpsellPluginOptions;
  constructor(private moduleRef: ModuleRef) {}

  static init(options: UpsellPluginOptions) {
    this.options = options;
    return this;
  }
}
