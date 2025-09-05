import {
  CreateAdministratorInput,
  UpdateAdministratorInput,
} from "@deenruv/common/src/generated-types";
import type { ID } from "@deenruv/common/src/shared-types";

import { RequestContext } from "../../api";
import { Administrator } from "../../entity";
import { DeenruvEntityEvent } from "../deenruv-entity-event";

type AdministratorInputTypes =
  | CreateAdministratorInput
  | UpdateAdministratorInput
  | ID;

/**
 * @description
 * This event is fired whenever a {@link Administrator} is added, updated or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
export class AdministratorEvent extends DeenruvEntityEvent<
  Administrator,
  AdministratorInputTypes
> {
  constructor(
    ctx: RequestContext,
    entity: Administrator,
    type: "created" | "updated" | "deleted",
    input?: AdministratorInputTypes,
  ) {
    super(entity, type, ctx, input);
  }
}
