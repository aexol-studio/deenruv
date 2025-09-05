import { HistoryEntryType } from "@deenruv/common/src/generated-types";
import type { ID } from "@deenruv/common/src/shared-types";

import { RequestContext } from "../../api/common/request-context";
import { HistoryEntry } from "../../entity/history-entry/history-entry.entity";
import { DeenruvEntityEvent } from "../deenruv-entity-event";

type HistoryInput =
  | {
      type: HistoryEntryType;
      data?: any;
    }
  | ID;

/**
 * @description
 * This event is fired whenever one {@link HistoryEntry} is added, updated or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
export class HistoryEntryEvent extends DeenruvEntityEvent<
  HistoryEntry,
  HistoryInput
> {
  public readonly historyType: "order" | "customer" | string;

  constructor(
    ctx: RequestContext,
    entity: HistoryEntry,
    type: "created" | "updated" | "deleted",
    historyType: "order" | "customer" | string,
    input?: HistoryInput,
  ) {
    super(entity, type, ctx, input);
    this.historyType = historyType;
  }
}
