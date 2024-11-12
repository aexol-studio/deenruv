import { DeenruvUIPlugin } from '@deenruv/react-ui-devkit';
import React from 'react';

export const tables: DeenruvUIPlugin['tables'] = [
    {
        id: 'products-list-view',
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
