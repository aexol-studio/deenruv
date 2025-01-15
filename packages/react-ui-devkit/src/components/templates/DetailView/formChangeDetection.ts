import { EntityType } from "@/components/templates/DetailView/types";
import { GFFLPFormField } from "@/hooks";
import { deepSortArray } from "@/utils";

// Some fields between entity and form state differs and need to be normalized in order to compare
const normalizeEntityValues = (entityValues: EntityType) => {
    const normalizedEntityValues = { ...entityValues } as {
        assetIds?: string[];
        facetValueIds?: string[];
        [key: string]: any;
    };

    if ('assets' in normalizedEntityValues) {
        normalizedEntityValues.assetIds = normalizedEntityValues['assets']?.map((a: { id: string }) => a.id);
        delete normalizedEntityValues.assets;
    }

    if ('facetValues' in normalizedEntityValues) {
        normalizedEntityValues.facetValueIds = normalizedEntityValues['facetValues'].map(
            (v: { id: string }) => v.id,
        );
        delete normalizedEntityValues.facetValues;
    }

    if ('featuredAsset' in normalizedEntityValues) {
        normalizedEntityValues.featuredAssetId = normalizedEntityValues['featuredAsset']?.id;
        delete normalizedEntityValues.featuredAsset;
    }

    return normalizedEntityValues
}

export const checkUnsavedChanges = (
    formStateValues: Record<string, GFFLPFormField<any> | undefined>,
    entityValues: EntityType | null,
): boolean => {
    if (entityValues === null) {
        for (const key in formStateValues) {
            if (formStateValues[key]?.value !== null && formStateValues[key]?.value !== '') {
                return true;
            }
        }
        return false;
    }

    const normalizedEntityValues = normalizeEntityValues(entityValues);

    for (const key in formStateValues) {
        if (!(key in normalizedEntityValues)) {
            return true;
        }

        const formValue = formStateValues[key]?.value;
        const entityValue = normalizedEntityValues[key as keyof EntityType];

        if (Array.isArray(formValue) && Array.isArray(entityValue)) {
            const sortedFormValue = deepSortArray(formValue);
            const sortedEntityValue = deepSortArray(entityValue);

            if (sortedFormValue.length !== sortedEntityValue.length) {
                return true;
            }

            for (let i = 0; i < sortedFormValue.length; i++) {
                const sortedFormString = JSON.stringify(sortedFormValue[i]);
                const sortedEntityString = JSON.stringify(sortedEntityValue[i]);

                // Handle "args" and "arguments" difference
                if (sortedFormString.includes('"arguments"') && sortedEntityString.includes('"args"')) {
                    const normalizedFormString = sortedFormString.replace(/"args"/g, '"arguments"');
                    const normalizedEntityString = sortedEntityString.replace(/"args"/g, '"arguments"');

                    if (normalizedFormString === normalizedEntityString) {
                        continue;
                    }
                }

                if (sortedFormString !== sortedEntityString) {
                    return true;
                }
            }
        } else if (formValue !== entityValue) {
            return true;
        }
    }

    return false;
};