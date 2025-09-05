import type { ID } from "@deenruv/common/src/shared-types";

import { RequestContext } from "../../api/common/request-context";
import { Asset } from "../../entity";
import { DeenruvEvent } from "../deenruv-event";

/**
 * @description
 * This event is fired whenever an {@link Asset} is assigned or removed
 * From a channel.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export class AssetChannelEvent extends DeenruvEvent {
  constructor(
    public ctx: RequestContext,
    public asset: Asset,
    public channelId: ID,
    public type: "assigned" | "removed",
  ) {
    super();
  }
}
