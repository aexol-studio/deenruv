import {
  CreateCollectionInput,
  UpdateCollectionInput,
} from "@deenruv/common/generated-types";
import type { ID } from "@deenruv/common/shared-types";

import { RequestContext } from "../../api";
import { Collection } from "../../entity";
import { DeenruvEntityEvent } from "../deenruv-entity-event";

type CollectionInputTypes = CreateCollectionInput | UpdateCollectionInput | ID;

/**
 * @description
 * This event is fired whenever a {@link Collection} is added, updated or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
export class CollectionEvent extends DeenruvEntityEvent<
  Collection,
  CollectionInputTypes
> {
  constructor(
    ctx: RequestContext,
    entity: Collection,
    type: "created" | "updated" | "deleted",
    input?: CollectionInputTypes,
  ) {
    super(entity, type, ctx, input);
  }
}
