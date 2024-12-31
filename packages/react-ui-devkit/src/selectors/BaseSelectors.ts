import { CustomFieldConfigSelector, FromSelectorWithScalars, Selector } from '@deenruv/admin-types';

export const activeAdministratorSelector = Selector('Administrator')({
    id: true,
    emailAddress: true,
    firstName: true,
    lastName: true,
    user: {
        roles: {
            channels: {
                id: true,
                code: true,
                token: true,
                currencyCode: true,
                defaultLanguageCode: true,
                availableLanguageCodes: true,
            },
        },
    },
});

export type ActiveAdministratorType = FromSelectorWithScalars<
    typeof activeAdministratorSelector,
    'Administrator'
>;

export const paymentMethodsSelector = Selector('PaymentMethod')({
    id: true,
    name: true,
    description: true,
    enabled: true,
    code: true,
});

export type PaymentMethodsType = FromSelectorWithScalars<typeof paymentMethodsSelector, 'PaymentMethod'>;

export const serverConfigSelector = Selector('ServerConfig')({
    entityCustomFields: { customFields: CustomFieldConfigSelector, entityName: true },
    orderProcess: { name: true, to: true },
    permissions: { assignable: true, description: true, name: true },
    permittedAssetTypes: true,
});

export type ServerConfigType = FromSelectorWithScalars<typeof serverConfigSelector, 'ServerConfig'>;

export const channelSelector = Selector('Channel')({
    id: true,
    code: true,
    token: true,
    currencyCode: true,
    defaultLanguageCode: true,
    availableLanguageCodes: true,
});

export type ChannelType = FromSelectorWithScalars<typeof channelSelector, 'Channel'>;

export const countrySelector = Selector('Country')({
    code: true,
    name: true,
    id: true,
});

export type CountryType = FromSelectorWithScalars<typeof countrySelector, 'Country'>;

export const configurableOperationDefinitionSelector = Selector('ConfigurableOperationDefinition')({
    args: {
        __typename: true,
        defaultValue: true,
        description: true,
        label: true,
        list: true,
        name: true,
        required: true,
        type: true,
        ui: true,
    },
    code: true,
    description: true,
});

export type ConfigurableOperationDefinitionType = FromSelectorWithScalars<
    typeof configurableOperationDefinitionSelector,
    'ConfigurableOperationDefinition'
>;
