import { RequestContext } from '../../api/common/request-context';
import { User } from '../../entity/user/user.entity';
import { DeenruvEvent } from '../deenruv-event';

/**
 * @description
 * This event is fired when a Customer requests a password reset email.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export class PasswordResetEvent extends DeenruvEvent {
    constructor(public ctx: RequestContext, public user: User) {
        super();
    }
}
