import { useCustomFields } from '@/custom_fields';
import { AssetsRelationInput } from './AssetsRelationInput';
import { ProductRelationInput } from './ProductRelationInput';
import { ProductVariantRelationInput } from './ProductVariantRelationInput';
import React from 'react';

export function DefaultRelationInput() {
    const { field } = useCustomFields();
    if (!field) {
        return <div>Could not find the field</div>;
    }
    if ('entity' in field) {
        switch (field.entity) {
            case 'Asset':
                return <AssetsRelationInput />;
            case 'Product':
                return <ProductRelationInput />;
            case 'ProductVariant':
                return <ProductVariantRelationInput />;
            default:
                console.log(`Entity ${field.entity} in list is not supported yet`);
                return 'Entity is not supported yet';
        }
    }
    return null;
}
