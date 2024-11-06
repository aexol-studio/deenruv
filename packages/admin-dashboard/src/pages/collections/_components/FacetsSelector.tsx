import { Label, MultipleSelector, type Option } from '@deenruv/react-ui-devkit';
import { apiCall } from '@/graphql/client';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack } from '@/components';

interface FacetsSelectorProps {
  value: string[];
  onChange: (e: string[]) => void;
}

export const FacetsSelector: React.FC<FacetsSelectorProps> = ({ value, onChange }) => {
  const { t } = useTranslation('collections');
  const [facetsOptions, setFacetsOptions] = useState<Option[]>();

  const fetchFacets = useCallback(async () => {
    const response = await apiCall()('query')({
      facetValues: [
        {},
        {
          items: {
            name: true,
            id: true,
          },
        },
      ],
    });
    setFacetsOptions(response.facetValues.items.map((f) => ({ label: f.name, value: f.id })));
  }, []);

  useEffect(() => {
    fetchFacets();
  }, [fetchFacets]);

  return (
    <Stack column className="basis-full gap-3">
      <Label>{t('details.filters.addFacets')}</Label>
      <MultipleSelector
        options={facetsOptions}
        value={
          !value
            ? []
            : value.map((id) => ({
                label: facetsOptions?.find((o) => o.value === id)?.label || id,
                value: id,
              }))
        }
        placeholder={t('details.filters.addFacets')}
        onChange={(e) => onChange(e.map((e) => e.value))}
        hideClearAllButton
      />
    </Stack>
  );
};
