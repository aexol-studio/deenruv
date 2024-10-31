import React from 'react';
import { useCustomFields } from '@/custom_fields';
import { AssetRelationInput } from './AssetRelationInput';
import { ProductVariantRelationInput } from './ProductVariantRelationInput';
import { ProductRelationInput } from './ProductRelationInput';
import { ListRelationInput } from './ListRelationInput';

export function DefaultRelationInput() {
    const { field } = useCustomFields();
    if (!field || !('entity' in field)) return null;
    switch (field.entity) {
        case 'Asset': {
            if (field.list) return <ListRelationInput entityName="Asset" />;
            return <AssetRelationInput />;
        }
        case 'Product':
            if (field.list) return <ListRelationInput entityName="Product" />;
            return <ProductRelationInput />;
        case 'ProductVariant':
            if (field.list) return <ListRelationInput entityName="ProductVariant" />;

            return <ProductVariantRelationInput />;
        default:
            return (
                <p className="text-red-500 text-md font-bold">
                    Entity '{field.entity}' in list is not supported yet
                </p>
            );
    }
}
