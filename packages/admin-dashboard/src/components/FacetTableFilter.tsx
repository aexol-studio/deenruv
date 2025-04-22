import { generateColorFromString } from '@/utils/generateColorFromString.js';

import { MultipleSelector, Option, apiClient, useTranslation } from '@deenruv/react-ui-devkit';
import React, { useCallback, useEffect, useState } from 'react';

interface FacetTableFilterProps {
  onChange: (facetValuesIds: string[]) => void;
  facetValuesIds: string[] | undefined;
}

export const FacetTableFilter: React.FC<FacetTableFilterProps> = ({ facetValuesIds, onChange }) => {
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
    <MultipleSelector
      options={allFacetsOptions}
      value={currentFacetsOptions}
      placeholder={t('facetPlaceholder')}
      onChange={(options) => onChange(options.map((o) => o.value))}
      hideClearAllButton
    />
  );
};
