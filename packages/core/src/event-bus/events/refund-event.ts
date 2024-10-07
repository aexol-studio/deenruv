import { RequestContext } from '../../api/common/request-context';
import { Order, Refund } from '../../entity';
import { DeenruvEvent } from '../deenruv-event';

/**
 * @description
 * This event is fired whenever a {@link Refund} is created
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export class RefundEvent extends DeenruvEvent {
    constructor(
        public ctx: RequestContext,
        public order: Order,
        public refund: Refund,
        public type: 'created',
    ) {
        super();
    }
}
