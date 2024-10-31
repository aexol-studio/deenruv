import React from 'react';
import { useCustomFields } from '@/custom_fields';
import { ListRelationInput } from './ListRelationInput';
import { RelationInput } from './RelationInput';

export function DefaultRelationInput() {
    const { field } = useCustomFields();
    if (!field || !('entity' in field)) return null;
    switch (field.entity) {
        case 'Asset':
        case 'Product':
        case 'ProductVariant': {
            if (field.list) return <ListRelationInput entityName={field.entity} />;
            return <RelationInput entityName={field.entity} />;
        }
        default:
            return (
                <p className="text-red-500 text-md font-bold">
                    Entity '{field.entity}' in list is not supported yet
                </p>
            );
    }
}
