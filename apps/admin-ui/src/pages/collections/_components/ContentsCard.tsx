import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Stack } from '@/components';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ContentsTable } from '@/pages/collections/_components/ContentsTable';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type collections from '../../../locales/en/collections.json';
import { ValueTypes } from '@/zeus';

interface ContentsCardProps {
  collectionId: string | undefined;
}

export const ContentsCard: React.FC<ContentsCardProps> = ({ collectionId }) => {
  const { t } = useTranslation('collections');
  const filterOptions = ['name', 'sku', 'id'];
  const [filter, setFilter] = useState<ValueTypes['ProductVariantFilterParameter']>({});
  const firstFilterKey = useMemo(() => Object.keys(filter ?? {})[0], [filter]);

  const handleFilterValue = (key: string) => {
    switch (key) {
      case 'name': {
        return (
          <Input
            key={key}
            placeholder={`${t('drawer.filter.name')}..`}
            onChange={(e) => setFilter({ [key]: e.target.value ? { contains: e.target.value } : {} })}
          />
        );
      }
      case 'sku': {
        return (
          <Input
            key={key}
            placeholder={`${t('drawer.filter.sku')}..`}
            onChange={(e) => setFilter({ [key]: e.target.value ? { contains: e.target.value } : {} })}
          />
        );
      }
      case 'id': {
        return (
          <Input
            key={key}
            placeholder={`${t('drawer.filter.id')}..`}
            onChange={(e) => setFilter({ [key]: e.target.value ? { eq: e.target.value } : {} })}
          />
        );
      }
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{t('details.contents.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack className="mb-4 gap-3">
          <Select
            value={firstFilterKey}
            onValueChange={(e) => {
              setFilter({ [e]: {} });
            }}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder={t('drawer.filter.title')} />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map((i) => (
                <SelectItem className="cursor-pointer" key={i} value={i}>
                  {t(`drawer.filter.labels.${i as keyof typeof collections.drawer.filter.labels}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filter && handleFilterValue(firstFilterKey)}
        </Stack>
        <ContentsTable collectionId={collectionId} filter={filter} />
      </CardContent>
    </Card>
  );
};
