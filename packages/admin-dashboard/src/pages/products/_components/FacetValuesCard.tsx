import { useTranslation, CardIcons, CustomCard, FacetIdsSelector } from '@deenruv/react-ui-devkit';
import React from 'react';

interface FacetValuesCardProps {
  onChange: (facetValuesIds: string[]) => void;
  facetValuesIds: string[] | undefined;
}

export const FacetValuesCard: React.FC<FacetValuesCardProps> = ({ facetValuesIds, onChange }) => {
  const { t } = useTranslation('products');

  return (
    <CustomCard title={t('facets')} color="indigo" icon={<CardIcons.tag />}>
      <FacetIdsSelector fixedDropdown facetValuesIds={facetValuesIds} onChange={(options) => onChange(options)} />
    </CustomCard>
  );
};
