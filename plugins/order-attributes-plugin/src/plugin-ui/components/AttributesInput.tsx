import { useCustomFields } from '@deenruv/react-ui-devkit';
import React, { useMemo } from 'react';
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
    const { setValue, value, additionalData } = useCustomFields();
    const parsedValues = useMemo(() => {
        if (!value || value === '') return null;
        try {
            const parsed = JSON.parse(value);
            if (Object.keys(parsed).length === 0) return null;
            return parsed as Record<string, string>;
        } catch (e) {
            return null;
        }
    }, [value]);
    return (
        <div className="flex flex-col gap-4">
            <FacetValues value={value} setValue={setValue} additionalData={additionalData} />
            <div className="flex flex-col gap-2">
                {parsedValues ? (
                    Object.entries(parsedValues).map(([key, value]) => (
                        <div key={key} className="flex gap-2">
                            <span className="capitalize">{key}</span>
                            <span className="capitalize">{value}</span>
                        </div>
                    ))
                ) : (
                    <span>There are no attributes</span>
                )}
            </div>
        </div>
    );
};
