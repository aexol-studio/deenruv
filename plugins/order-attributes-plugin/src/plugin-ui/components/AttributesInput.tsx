import { useCustomFields } from '@deenruv/react-ui-devkit';
import React from 'react';
import { FacetValues } from './FacetValues';

export type FacetValueData = {
    id: string;
    code: string;
    name: string;
    hexColor?: string;
    imagePreview?: string;
};
export type Data = {
    id: string;
    code: string;
    name: string;
    usedForProductCreations: boolean;
    facetValues: FacetValueData[];
};

export const AttributesInput: React.FC = () => {
    const { setValue, value } = useCustomFields();

    return <FacetValues value={value} setValue={setValue} />;
};
