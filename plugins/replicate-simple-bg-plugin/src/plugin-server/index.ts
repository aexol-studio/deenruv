import { PluginCommonModule, DeenruvPlugin } from "@deenruv/core";
import { ReplicateSimpleBGAdminResolver } from "./resolvers/replicate-simple-bg-admin.resolver.js";
import { ReplicateSimpleBGService } from "./services/replicate-simple-bg.service.js";
import { REPLICATE_SIMPLE_BG_PLUGIN_OPTIONS } from "./constants.js";
import { ReplicateSimpleBGOptions } from "./types.js";
import { AdminExtension } from "./extensions/replicate-simple-bg.extension.js";
import { ReplicateSimpleBgEntity } from "./entities/replicate-simple-bg.js";
@DeenruvPlugin({
  compatibility: "^0.0.20",
  imports: [PluginCommonModule],
  entities: [ReplicateSimpleBgEntity],
  providers: [
    {
      provide: REPLICATE_SIMPLE_BG_PLUGIN_OPTIONS,
      useFactory: () => ReplicateSimpleBGPlugin.options,
    },
    ReplicateSimpleBGService,
  ],
  adminApiExtensions: {
    schema: AdminExtension,
    resolvers: [ReplicateSimpleBGAdminResolver],
  },
})
export class ReplicateSimpleBGPlugin {
  private static options: ReplicateSimpleBGOptions;
  static init(options: ReplicateSimpleBGOptions) {
    this.options = options;
    return this;
  }
}
