import { RequestContext } from "../../api/common/request-context";
import { User } from "../../entity/user/user.entity";
import { DeenruvEvent } from "../deenruv-event";

/**
 * @description
 * This event is fired when a user successfully logs in via the shop or admin API `login` mutation.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export class LoginEvent extends DeenruvEvent {
  constructor(
    public ctx: RequestContext,
    public user: User,
  ) {
    super();
  }
}
