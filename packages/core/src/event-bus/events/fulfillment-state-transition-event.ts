import { RequestContext } from '../../api/common/request-context';
import { Fulfillment } from '../../entity/fulfillment/fulfillment.entity';
import { FulfillmentState } from '../../service/helpers/fulfillment-state-machine/fulfillment-state';
import { DeenruvEvent } from '../deenruv-event';

/**
 * @description
 * This event is fired whenever an {@link Fulfillment} transitions from one {@link FulfillmentState} to another.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export class FulfillmentStateTransitionEvent extends DeenruvEvent {
    constructor(
        public fromState: FulfillmentState,
        public toState: FulfillmentState,
        public ctx: RequestContext,
        public fulfillment: Fulfillment,
    ) {
        super();
    }
}
