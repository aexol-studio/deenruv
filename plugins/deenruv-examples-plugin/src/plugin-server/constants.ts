import { OrderLineEvent, OrderStateTransitionEvent, LoginEvent, LogoutEvent } from '@deenruv/core';

export const PLUGIN_INIT_OPTIONS = Symbol('ANALYTICS_PLUGIN_OPTIONS');
export const events = [OrderLineEvent, OrderStateTransitionEvent, LoginEvent, LogoutEvent];
