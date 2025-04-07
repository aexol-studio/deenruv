import { RequestContext } from "../../api/common/request-context";
import { User } from "../../entity/user/user.entity";
import { DeenruvEvent } from "../deenruv-event";

/**
 * @description
 * This event is fired when a user logs out via the shop or admin API `logout` mutation.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export class LogoutEvent extends DeenruvEvent {
  constructor(public ctx: RequestContext) {
    super();
  }
}
