import {
  CreatePromotionInput,
  UpdatePromotionInput,
} from "@deenruv/common/lib/generated-types";
import { ID } from "@deenruv/common/lib/shared-types";

import { RequestContext } from "../../api/common/request-context";
import { Promotion } from "../../entity";
import { DeenruvEntityEvent } from "../deenruv-entity-event";

type PromotionInputTypes = CreatePromotionInput | UpdatePromotionInput | ID;

/**
 * @description
 * This event is fired whenever a {@link Promotion} is added, updated
 * or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export class PromotionEvent extends DeenruvEntityEvent<
  Promotion,
  PromotionInputTypes
> {
  constructor(
    ctx: RequestContext,
    entity: Promotion,
    type: "created" | "updated" | "deleted",
    input?: PromotionInputTypes,
  ) {
    super(entity, type, ctx, input);
  }
}
