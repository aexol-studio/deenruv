import {
  CreateTaxRateInput,
  UpdateTaxRateInput,
} from "@deenruv/common/lib/generated-types";
import { ID } from "@deenruv/common/lib/shared-types";

import { RequestContext } from "../../api/common/request-context";
import { TaxRate } from "../../entity";
import { DeenruvEntityEvent } from "../deenruv-entity-event";

type TaxRateInputTypes = CreateTaxRateInput | UpdateTaxRateInput | ID;

/**
 * @description
 * This event is fired whenever a {@link TaxRate} is added, updated
 * or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export class TaxRateEvent extends DeenruvEntityEvent<
  TaxRate,
  TaxRateInputTypes
> {
  constructor(
    ctx: RequestContext,
    entity: TaxRate,
    type: "created" | "updated" | "deleted",
    input?: TaxRateInputTypes,
  ) {
    super(entity, type, ctx, input);
  }
}
