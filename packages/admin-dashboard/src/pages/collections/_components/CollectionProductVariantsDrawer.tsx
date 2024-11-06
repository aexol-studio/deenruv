import {
  Button,
  Input,
  SelectContent,
  SelectTrigger,
  SelectValue,
  Select,
  SelectItem,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@deenruv/react-ui-devkit';
import { ValueTypes } from '@deenruv/admin-types';

import type collections from '../../../locales/en/collections.json';
import React, { PropsWithChildren, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContentsTable } from '@/pages/collections/_components/ContentsTable';

interface CollectionProductVariantsDrawerProps extends PropsWithChildren {
  collectionId?: string;
  collectionName?: string;
  count?: number;
}

const filterOptions = ['name', 'sku', 'id'];

export const CollectionProductVariantsDrawer: React.FC<CollectionProductVariantsDrawerProps> = ({
  collectionId,
  collectionName,
  children,
  count,
}) => {
  const [filter, setFilter] = useState<ValueTypes['ProductVariantFilterParameter']>({});
  const { t } = useTranslation(['collections', 'common']);

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
    <div>
      <Drawer direction="right">
        {children}
        <DrawerContent className="left-auto right-0  top-0 mt-0 w-[85vw]">
          <DrawerHeader className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="shrink-0">
                <DrawerTitle>{t('drawer.title', { collectionName })}</DrawerTitle>
                <DrawerDescription>{t('drawer.count', { count })}</DrawerDescription>{' '}
              </div>
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
            </div>

            <DrawerClose>
              <Button>{t('drawer.close')}</Button>
            </DrawerClose>
          </DrawerHeader>
          <ContentsTable collectionId={collectionId} filter={filter} />
        </DrawerContent>
      </Drawer>
    </div>
  );
};
