import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@deenruv/react-ui-devkit';
import { translationNS } from '../translation-ns';
import { FacetListOptionsType } from '../graphql';
import { CheckboxAccordion } from './CheckboxAccordion';

interface FacetsAccordionsProps {
    facetsOptions: FacetListOptionsType['items'] | undefined;
    checkedFacetsIds: string[] | undefined;
    handleFacetCheckboxChange: (itemId: string, checked: boolean) => void;
}

export const FacetHarmonica: React.FC<FacetsAccordionsProps> = ({
    facetsOptions,
    checkedFacetsIds,
    handleFacetCheckboxChange,
}) => {
    const { t } = useTranslation(translationNS);

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex flex-row justify-between text-base">{t('colors')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col">
                        {facetsOptions
                            ?.filter(f => f.customFields?.usedForProductCreations)
                            .map(f => (
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
            <Card>
                <CardHeader>
                    <CardTitle className="flex flex-row justify-between text-base">
                        {t('colorPalettes')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col">
                        {facetsOptions
                            ?.filter(f => f.customFields?.colorsCollection)
                            .map(f => (
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
            <Card>
                <CardHeader>
                    <CardTitle className="flex flex-row justify-between text-base">
                        {t('otherOptions')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col">
                        {facetsOptions
                            ?.filter(
                                f =>
                                    !f.customFields?.colorsCollection &&
                                    !f.customFields?.usedForProductCreations,
                            )
                            .map(f => (
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
        </>
    );
};
