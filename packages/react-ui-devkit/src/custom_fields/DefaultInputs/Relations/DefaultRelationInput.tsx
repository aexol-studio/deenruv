import React from 'react';
import { useCustomFields } from '@/custom_fields';
import { AssetRelationInput } from './AssetRelationInput';
import { ProductRelationInput } from './ProductRelationInput';
import { ProductVariantRelationInput } from './ProductVariantRelationInput';
import { AssetListRelationInput } from './AssetListRelationInput';

export function DefaultRelationInput() {
    const { field } = useCustomFields();
    if (!field || !('entity' in field)) return null;
    switch (field.entity) {
        case 'Asset': {
            if (field.list) return <AssetListRelationInput />;
            return <AssetRelationInput />;
        }
        case 'Product':
            return <ProductRelationInput />;
        case 'ProductVariant':
            return <ProductVariantRelationInput />;
        default:
            return (
                <p className="text-red-500 text-md font-bold">
                    Entity '{field.entity}' in list is not supported yet
                </p>
            );
    }
}
