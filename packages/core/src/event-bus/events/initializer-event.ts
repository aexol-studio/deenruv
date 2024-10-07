import { DeenruvEvent } from '../deenruv-event';

/**
 * @description
 * This event is fired when deenruv finished initializing its services inside the {@link InitializerService}
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.7.0
 */
export class InitializerEvent extends DeenruvEvent {
    constructor() {
        super();
    }
}
