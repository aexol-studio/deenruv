import { type ID, Type } from "@deenruv/common/shared-types";

import { RequestContext } from "../../api";
import { ChannelAware } from "../../common";
import { DeenruvEntity } from "../../entity";
import { DeenruvEvent } from "../deenruv-event";

/**
 * @description
 * This event is fired whenever an {@link ChannelAware} entity is assigned or removed
 * from a channel. The entity property contains the value before updating the channels.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
export class ChangeChannelEvent<
  T extends ChannelAware & DeenruvEntity,
> extends DeenruvEvent {
  constructor(
    public ctx: RequestContext,
    public entity: T,
    public channelIds: ID[],
    public type: "assigned" | "removed",
    public entityType?: Type<T>,
  ) {
    super();
  }
}
