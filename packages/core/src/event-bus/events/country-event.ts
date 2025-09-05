import {
  CreateCountryInput,
  UpdateCountryInput,
} from "@deenruv/common/src/generated-types";
import type { ID } from "@deenruv/common/src/shared-types";

import { RequestContext } from "../../api";
import { Country } from "../../entity";
import { DeenruvEntityEvent } from "../deenruv-entity-event";

type CountryInputTypes = CreateCountryInput | UpdateCountryInput | ID;

/**
 * @description
 * This event is fired whenever a {@link Country} is added, updated or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
export class CountryEvent extends DeenruvEntityEvent<
  Country,
  CountryInputTypes
> {
  constructor(
    ctx: RequestContext,
    entity: Country,
    type: "created" | "updated" | "deleted",
    input?: CountryInputTypes,
  ) {
    super(entity, type, ctx, input);
  }
}
