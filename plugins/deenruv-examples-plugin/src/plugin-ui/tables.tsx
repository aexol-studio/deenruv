import { DeenruvUIPlugin } from '@deenruv/react-ui-devkit';
import React from 'react';
import { ScalarsType } from './graphql/client';
import { FromSelector, GraphQLTypes } from './zeus';

export type FromSelectorWithScalars<SELECTOR, NAME extends keyof GraphQLTypes> = FromSelector<
    SELECTOR,
    NAME,
    ScalarsType
>;

//TODO: Add your custom types so it will infer the types in the plugin
// declare module '@deenruv/react-ui-devkit' {
//     interface ExternalListLocationSelector {
//         'products-list-view': FromSelectorWithScalars<GraphQLTypes['Product'], 'Product'>;
//     }
// }

export const tables: DeenruvUIPlugin['tables'] = [
    {
        id: 'products-list-view',
        // externalSelector: {
        //     customFields: {
        //         boolTest: true,
        //     },
        // },
        rowActions: [
            {
                label: 'Some example action',
                onClick: ({ data }) => {
                    console.log('Row action clicked', data);
                    return Math.random() > 0.5
                        ? { error: 'That is error message' }
                        : { success: 'That is success message' };
                },
            },
        ],
        bulkActions: [
            {
                // label should be translated
                label: 'Some example bulk action',
                // icon: SomeIcon,
                onClick: ({ data }) => {
                    console.log('Bulk action clicked', data);
                    return Math.random() > 0.5
                        ? { error: 'That is error message' }
                        : { success: 'That is success message' };
                },
            },
        ],
        // we can override or add columns to the table
        columns: [
            {
                accessorKey: 'slug',
                cell: ({ row }) => <p>OVERRIDE SLUG {row.original.slug}</p>,
            },
            {
                accessorKey: 'new-column-slug',
                cell: ({ row }) => <p>NEW COLUMN WITH SLUG {row.original.slug}</p>,
            },
        ],
    },
];
