import { Query, Resolver } from '@nestjs/graphql';
import { DeenruvPlugin } from '@deenruv/core';

/**
 * https://github.com/deenruv-ecommerce/deenruv/issues/2906
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
