import { EntityType } from '@/components/templates/DetailView/types';
import { GFFLPFormField } from '@/hooks';
import { deepSortArray } from '@/utils';

// Some fields between entity and form state differs and need to be normalized in order to compare
const normalizeEntityValues = (entityValues: EntityType) => {
    const normalizedEntityValues = { ...entityValues } as {
        assetIds?: string[];
        facetValueIds?: string[];
        memberIds?: string[];
        channelIds?: string[];
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

    if ('members' in normalizedEntityValues) {
        normalizedEntityValues.memberIds = normalizedEntityValues['members'].map((m: { id: string }) => m.id);
        delete normalizedEntityValues.members;
    }

    if ('category' in normalizedEntityValues) {
        normalizedEntityValues.categoryId = normalizedEntityValues['category']?.id;
        delete normalizedEntityValues.category;
    }

    if ('customerGroup' in normalizedEntityValues) {
        normalizedEntityValues.customerGroupId = normalizedEntityValues['customerGroup']?.id;
        delete normalizedEntityValues.customerGroup;
    }

    if ('zone' in normalizedEntityValues) {
        normalizedEntityValues.zoneId = normalizedEntityValues['zone']?.id;
        delete normalizedEntityValues.zone;
    }

    if ('defaultShippingZone' in normalizedEntityValues) {
        normalizedEntityValues.defaultShippingZoneId = normalizedEntityValues['defaultShippingZone']?.id;
        delete normalizedEntityValues.defaultShippingZone;
    }

    if ('defaultTaxZone' in normalizedEntityValues) {
        normalizedEntityValues.defaultTaxZoneId = normalizedEntityValues['defaultTaxZone']?.id;
        delete normalizedEntityValues.defaultTaxZone;
    }

    if ('seller' in normalizedEntityValues) {
        normalizedEntityValues.sellerId = normalizedEntityValues['seller']?.id;
        delete normalizedEntityValues.seller;
    }

    if ('channels' in normalizedEntityValues) {
        normalizedEntityValues.channelIds = normalizedEntityValues['channels']?.map(
            (ch: { id: string }) => ch.id,
        );
        delete normalizedEntityValues.channels;
    }

    if (
        'user' in normalizedEntityValues &&
        'emailAddress' in normalizedEntityValues &&
        'firstName' in normalizedEntityValues &&
        'lastName' in normalizedEntityValues &&
        'roles' in normalizedEntityValues['user'] &&
        Array.isArray(normalizedEntityValues['user']?.roles)
    ) {
        normalizedEntityValues.roleIds = normalizedEntityValues['user']?.roles.map(
            (r: { id: string }) => r.id,
        );
        delete normalizedEntityValues.user;
        normalizedEntityValues.password = '';
    }

    if ('fulfillmentHandler' in normalizedEntityValues) {
        normalizedEntityValues.fulfillmentHandlerCode = normalizedEntityValues['fulfillmentHandler'].code;
        delete normalizedEntityValues.fulfillmentHandler;
    }

    return normalizedEntityValues;
};

export const checkUnsavedChanges = (
    formStateValues: Record<string, GFFLPFormField<any> | undefined>,
    entityValues: EntityType | null,
): boolean => {
    console.log(formStateValues, entityValues);

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
