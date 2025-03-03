import { ID, RequestContext, DeenruvEvent } from '@deenruv/core';

export class Przelewy24ReminderEvent extends DeenruvEvent {
    constructor(
        public ctx: RequestContext,
        public data: { orderId: ID },
    ) {
        super();
    }
}
