import { PluginCommonModule, DeenruvPlugin, LanguageCode, Asset, PaymentMethod } from '@deenruv/core';
import { Przelewy24PluginConfiguration } from './types.js';
import { przelewy24PaymentMethodHandler } from './handlers/przelewy24.handler.js';
import { Przelewy24Controller } from './controllers/przelewy24.controller.js';
import { AdminAPIExtension } from './extensions/admin-api.extension.js';
import { Przelewy24ReminderResolver } from './api/reminder.resolver.js';
import { PLUGIN_INIT_OPTIONS } from './constants.js';
import { Przelewy24Service } from './services/przelewy24.service.js';
import { Przelewy24ReminderEvent } from './email-event.js';

@DeenruvPlugin({
    compatibility: '^0.0.20',
    imports: [PluginCommonModule],
    controllers: [Przelewy24Controller],
    providers: [
        Przelewy24Service,
        { provide: PLUGIN_INIT_OPTIONS, useFactory: () => Przelewy24Plugin.config },
    ],
    adminApiExtensions: {
        resolvers: [Przelewy24ReminderResolver],
        schema: AdminAPIExtension,
    },
    configuration: config => {
        config.paymentOptions.paymentMethodHandlers.push(przelewy24PaymentMethodHandler);
        config.customFields.Order.push({
            name: 'selectedPaymentMethod',
            type: 'relation',
            entity: PaymentMethod,
            ui: { component: 'payment-method-input' },
            label: [
                { languageCode: LanguageCode.en, value: 'Payment' },
                { languageCode: LanguageCode.pl, value: 'Płatność' },
            ],
        });
        return config;
    },
})
class Przelewy24Plugin {
    static config: Przelewy24PluginConfiguration;

    static init(config: Przelewy24PluginConfiguration) {
        this.config = config;
        return this;
    }
}
export { Przelewy24Plugin, Przelewy24ReminderEvent };
