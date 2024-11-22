import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  MultipleSelector,
  Option,
  apiClient,
} from '@deenruv/react-ui-devkit';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FacetsCardProps {
  onChange: (facetsIds: string[]) => void;
  facetsIds: string[] | undefined;
}

export const FacetsCard: React.FC<FacetsCardProps> = ({ facetsIds, onChange }) => {
  const { t } = useTranslation('products');
  const [allFacetsOptions, setAllFacetOptions] = useState<Option[]>([]);
  const [currentFacetsOptions, setCurrentFacetOptions] = useState<Option[]>([]);

  const fetchFacets = useCallback(async () => {
    const response = await apiClient('query')({
      facets: [
        {},
        {
          items: {
            values: {
              id: true,
              name: true,
            },
          },
        },
      ],
    });

    const values = response.facets.items.map((i) => i.values).flat();

    setAllFacetOptions(
      values.map((v) => ({
        value: v.id,
        label: v.name,
      })),
    );
  }, [setAllFacetOptions]);

  useEffect(() => {
    fetchFacets();
  }, [fetchFacets]);

  useEffect(() => {
    const options = facetsIds?.map((f) => ({ label: f, value: f }));
    if (options) setCurrentFacetOptions(options);
  }, [facetsIds]);

  const onFacetsChange = useCallback((facetIds: string[]) => {
    onChange(facetIds);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{t('facets')}</CardTitle>
      </CardHeader>
      <CardContent>
        <MultipleSelector
          options={allFacetsOptions}
          value={currentFacetsOptions}
          placeholder={t('facetPlaceholder')}
          onChange={(options) => onFacetsChange(options.map((o) => o.value))}
          hideClearAllButton
        />
      </CardContent>
    </Card>
  );
};
