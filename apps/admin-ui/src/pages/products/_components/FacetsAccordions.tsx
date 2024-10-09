import { Stack } from '@/components';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FacetListOptionsType } from '@/graphql/facets';
import { CheckboxAccordion } from '@/pages/products/_components/CheckboxHarmonica';
import { useTranslation } from 'react-i18next';

interface FacetsAccordionsProps {
  facetsOptions: FacetListOptionsType['items'] | undefined;
  checkedFacetsIds: string[] | undefined;
  handleFacetCheckboxChange: (itemId: string, checked: boolean) => void;
}

export const FacetsAccordions: React.FC<FacetsAccordionsProps> = ({
  facetsOptions,
  checkedFacetsIds,
  handleFacetCheckboxChange,
}) => {
  const { t } = useTranslation('products');

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-row justify-between text-base">{t('colors')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Stack column>
            {facetsOptions
              ?.filter((f) => f.customFields?.usedForProductCreations)
              .map((f) => (
                <CheckboxAccordion
                  key={f.id}
                  title={f.name}
                  allFacets={f.values}
                  checkedFacetsIds={checkedFacetsIds}
                  onChange={handleFacetCheckboxChange}
                />
              ))}
          </Stack>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-row justify-between text-base">{t('colorPalettes')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Stack column>
            {facetsOptions
              ?.filter((f) => f.customFields?.colorsCollection)
              .map((f) => (
                <CheckboxAccordion
                  key={f.id}
                  title={f.name}
                  allFacets={f.values}
                  checkedFacetsIds={checkedFacetsIds}
                  onChange={handleFacetCheckboxChange}
                />
              ))}
          </Stack>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-row justify-between text-base">{t('otherOptions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Stack column>
            {facetsOptions
              ?.filter((f) => !f.customFields?.colorsCollection && !f.customFields?.usedForProductCreations)
              .map((f) => (
                <CheckboxAccordion
                  key={f.id}
                  title={f.name}
                  allFacets={f.values}
                  checkedFacetsIds={checkedFacetsIds}
                  onChange={handleFacetCheckboxChange}
                />
              ))}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};
