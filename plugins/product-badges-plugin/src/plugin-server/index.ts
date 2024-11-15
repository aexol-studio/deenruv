import { PluginCommonModule, DeenruvPlugin } from "@deenruv/core";
import { Badge } from "./entities/Badge";
import { BadgeTranslation } from "./entities/BadgeTranslation";
import { AdminExtension, ShopExtension } from "./extensions/badge.extension";
import { BadgeAdminResolver } from "./resolvers/badge-admin.resolver";
import { BadgesResolver } from "./resolvers/badge-entity.resolver";
import { BadgeService } from "./services/badge.service";
@DeenruvPlugin({
  compatibility: "^0.0.20",
  imports: [PluginCommonModule],
  providers: [BadgeService],
  entities: [Badge, BadgeTranslation],
  adminApiExtensions: {
    schema: AdminExtension,
    resolvers: [BadgeAdminResolver],
  },
  shopApiExtensions: {
    schema: ShopExtension,
    resolvers: [BadgesResolver],
  },
})
export class BadgesServerPlugin {}
