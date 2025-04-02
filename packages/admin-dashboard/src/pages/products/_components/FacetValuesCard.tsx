import { generateColorFromString } from '@/utils';
import { CardIcons, CustomCard, MultipleSelector, Option, apiClient } from '@deenruv/react-ui-devkit';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FacetValuesCardProps {
  onChange: (facetValuesIds: string[]) => void;
  facetValuesIds: string[] | undefined;
}

export const FacetValuesCard: React.FC<FacetValuesCardProps> = ({ facetValuesIds, onChange }) => {
  const { t } = useTranslation('products');
  const [allFacetsOptions, setAllFacetOptions] = useState<Option[]>([]);
  const [currentFacetsOptions, setCurrentFacetOptions] = useState<Option[]>([]);

  const fetchFacets = useCallback(async () => {
    const response = await apiClient('query')({
      facets: [{}, { items: { values: { id: true, name: true, facet: { name: true } } } }],
    });

    const values = response.facets.items.map((i) => i.values).flat();

    setAllFacetOptions(
      values.map((v) => ({
        value: v.id,
        label: `${v.facet.name.toUpperCase()} ${v.name}`,
        parent: v.facet.name,
        color: generateColorFromString(v.facet.name),
      })),
    );
  }, [setAllFacetOptions]);

  useEffect(() => {
    fetchFacets();
  }, [fetchFacets]);

  const getFacetValueLabel = useCallback(
    (facetValueId: string) => {
      const facetValue = allFacetsOptions.find((f) => f.value === facetValueId);
      return facetValue ? facetValue.label : facetValueId;
    },
    [allFacetsOptions],
  );

  useEffect(() => {
    const options = facetValuesIds?.map((f) => ({
      label: getFacetValueLabel(f),
      value: f,
    }));
    if (options) setCurrentFacetOptions(options);
  }, [facetValuesIds, allFacetsOptions]);

  return (
    <CustomCard title={t('facets')} color="indigo" icon={<CardIcons.tag />}>
      <MultipleSelector
        options={allFacetsOptions}
        value={currentFacetsOptions}
        placeholder={t('facetPlaceholder')}
        onChange={(options) => onChange(options.map((o) => o.value))}
        hideClearAllButton
      />
    </CustomCard>
  );
};
