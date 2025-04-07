import { SearchInput } from "@deenruv/common/lib/generated-types";

import { RequestContext } from "../../api/common/request-context";
import { DeenruvEvent } from "../deenruv-event";

type ExtendedSearchInput = SearchInput & {
  [extendedInputField: string]: any;
};

/**
 * @description
 * This event is fired whenever a search query is executed.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.6.0
 */
export class SearchEvent extends DeenruvEvent {
  constructor(
    public ctx: RequestContext,
    public input: ExtendedSearchInput,
  ) {
    super();
  }
}
