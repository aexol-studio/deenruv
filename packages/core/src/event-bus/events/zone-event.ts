import {
  CreateZoneInput,
  UpdateZoneInput,
} from "@deenruv/common/generated-types";
import type { ID } from "@deenruv/common/shared-types";

import { RequestContext } from "../../api/common/request-context";
import { Zone } from "../../entity";
import { DeenruvEntityEvent } from "../deenruv-entity-event";

type ZoneInputTypes = CreateZoneInput | UpdateZoneInput | ID;

/**
 * @description
 * This event is fired whenever a {@link Zone} is added, updated
 * or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export class ZoneEvent extends DeenruvEntityEvent<Zone, ZoneInputTypes> {
  constructor(
    ctx: RequestContext,
    entity: Zone,
    type: "created" | "updated" | "deleted",
    input?: ZoneInputTypes,
  ) {
    super(entity, type, ctx, input);
  }
}
