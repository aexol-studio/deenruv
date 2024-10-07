import { RequestContext } from '../../api/common/request-context';
import { Order, OrderLine } from '../../entity';
import { DeenruvEvent } from '../deenruv-event';

/**
 * @description
 * This event is fired whenever an {@link OrderLine} is added, updated
 * or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export class OrderLineEvent extends DeenruvEvent {
    constructor(
        public ctx: RequestContext,
        public order: Order,
        public orderLine: OrderLine,
        public type: 'created' | 'updated' | 'deleted' | 'cancelled',
    ) {
        super();
    }
}
