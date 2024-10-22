import React from 'react';
import { useCustomFields } from '@/custom_fields';
import { AssetsRelationInput } from './AssetsRelationInput';
import { ProductRelationInput } from './ProductRelationInput';
import { ProductVariantRelationInput } from './ProductVariantRelationInput';

export function DefaultRelationInput() {
    const { field } = useCustomFields();
    if (!field) return null;
    if ('entity' in field) {
        switch (field.entity) {
            case 'Asset':
                return <AssetsRelationInput />;
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
    return null;
}
