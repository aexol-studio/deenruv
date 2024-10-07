import { RequestContext } from '../../api/common/request-context';
import { User } from '../../entity/user/user.entity';
import { DeenruvEvent } from '../deenruv-event';

/**
 * @description
 * This event is fired when a registered user requests to update the identifier (ie email address)
 * associated with the account.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export class IdentifierChangeRequestEvent extends DeenruvEvent {
    constructor(public ctx: RequestContext, public user: User) {
        super();
    }
}
