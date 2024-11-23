import { OrderLineEvent, OrderStateTransitionEvent, LoginEvent, LogoutEvent } from '@deenruv/core';

export const PLUGIN_INIT_OPTIONS = Symbol('ANALYTICS_PLUGIN_OPTIONS');
export const DEFAULT_CACHE_TIME = 3600;
export const events = [OrderLineEvent, OrderStateTransitionEvent, LoginEvent, LogoutEvent];
