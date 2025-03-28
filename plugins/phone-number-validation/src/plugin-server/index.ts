import { PluginCommonModule, DeenruvPlugin } from '@deenruv/core';
import { PhoneNumberValidationOptions } from './types.js';
import { PHONE_NUMBER_VALIDATION_OPTIONS } from './symbol.js';
import { PhoneNumberValidationService } from './service.js';
import { APIExtension } from './extension.js';
import { ValidatePhoneNumberAPIResolver } from './api.js';
import { phoneNumberValidationProcess } from './phone-number-validation-process.js';

@DeenruvPlugin({
    compatibility: '^0.0.20',
    imports: [PluginCommonModule],
    shopApiExtensions: {
        schema: APIExtension,
        resolvers: [ValidatePhoneNumberAPIResolver],
    },
    providers: [
        {
          provide: PHONE_NUMBER_VALIDATION_OPTIONS,
          useFactory: () => PhoneNumberValidationPlugin.options,
        },
        PhoneNumberValidationService,
    ],
    configuration: config => {
        const options = PhoneNumberValidationPlugin.options;
        if (!options.disableTransitionValidation) {
            config.orderOptions.process.push(phoneNumberValidationProcess(options));
        }
        return config;
    },
})
export class PhoneNumberValidationPlugin {
    static options: PhoneNumberValidationOptions = {};
    static init(opts: PhoneNumberValidationOptions = {}) {
        this.options = opts;
        return this;
    }
}
