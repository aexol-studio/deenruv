import { Query, Resolver } from '@nestjs/graphql';
import { VendurePlugin } from '@deenruv/core';

/**
 * https://github.com/vendure-ecommerce/vendure/issues/2906
 */
@DeenruvPlugin({
    configuration: config => {
        return {
            ...config,
            customFields: {
                ...config.customFields,
                Customer: [
                    {
                        name: 'testField',
                        type: 'string',
                    },
                ],
            },
        };
    },
})
export class WithNewConfigObjectReferencePlugin {}
