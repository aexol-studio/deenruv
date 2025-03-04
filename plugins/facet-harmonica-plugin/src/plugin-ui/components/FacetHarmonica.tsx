import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, useDetailView, useQuery } from '@deenruv/react-ui-devkit';
import { translationNS } from '../translation-ns';
import { CheckboxAccordion } from './CheckboxAccordion';
import { FACETS_QUERY } from '../graphql/queries.js';
import { SortOrder } from '@deenruv/admin-types';

export const FacetHarmonica = () => {
    const { t } = useTranslation(translationNS, {
        i18n: window.__DEENRUV_SETTINGS__.i18n,
    });
    const { entity, setEntity } = useDetailView('products-detail-view', 'UpdateProductInput');
    const { data } = useQuery(FACETS_QUERY, {
        initialVariables: {
            facetOptions: {
                sort: {
                    createdAt: SortOrder.ASC,
                    usedForProductCreations: SortOrder.ASC,
                },
            },
        },
    });

    const handleFacetCheckboxChange = (facetValueId: string, checked: boolean) => {
        const facetValue = data?.facets?.items
            ?.map(f => f.values)
            .flat()
            .find(f => f.id === facetValueId);
        if (!facetValue) return;
        const newFacetValues = checked
            ? [...(entity?.facetValues || []), facetValue]
            : entity?.facetValues?.filter(f => f.id !== facetValueId);
        const facetValues = newFacetValues?.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
        if (!newFacetValues) return;
        setEntity({ ...entity, facetValues } as any);
    };

    const checkedFacetsIds = useMemo(() => entity?.facetValues.map(f => f.id), [entity?.facetValues]);
    const { mainFacets, colorFacets, otherFacets } = useMemo(() => {
        const mainFacets = data?.facets?.items?.filter(f => f.customFields?.usedForProductCreations);
        const colorFacets = data?.facets?.items?.filter(f => f.customFields?.colorsCollection);
        const otherFacets = data?.facets?.items?.filter(
            f => !f.customFields?.colorsCollection && !f.customFields?.usedForProductCreations,
        );
        return { mainFacets, colorFacets, otherFacets };
    }, [data?.facets?.items]);

    return (
        <>
            {mainFacets?.length ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex flex-row justify-between text-base">
                            {t('colors')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col">
                            {mainFacets?.map(f => (
                                <CheckboxAccordion
                                    key={f.id}
                                    title={f.name}
                                    allFacets={f.values}
                                    checkedFacetsIds={checkedFacetsIds}
                                    onChange={handleFacetCheckboxChange}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ) : null}
            {colorFacets?.length ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex flex-row justify-between text-base">
                            {t('colorPalettes')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col">
                            {colorFacets?.map(f => (
                                <CheckboxAccordion
                                    key={f.id}
                                    title={f.name}
                                    allFacets={f.values}
                                    checkedFacetsIds={checkedFacetsIds}
                                    onChange={handleFacetCheckboxChange}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ) : null}
            {otherFacets?.length ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex flex-row justify-between text-base">
                            {t('otherOptions')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col">
                            {otherFacets?.map(f => (
                                <CheckboxAccordion
                                    key={f.id}
                                    title={f.name}
                                    allFacets={f.values}
                                    checkedFacetsIds={checkedFacetsIds}
                                    onChange={handleFacetCheckboxChange}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ) : null}
            {/* <Card>
                <CardHeader>
                    <CardTitle className="flex flex-row justify-between text-base">
                        {t('sortOptions')}
                    </CardTitle>
                </CardHeader>
                <CardContent></CardContent>
            </Card> */}
        </>
    );
};
