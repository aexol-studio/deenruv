import { OptionGroupSelector, OptionGroupType } from '@/graphql/products';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  useDetailView,
  apiClient,
  useSettings,
  EmptyState,
  CustomCard,
  CardIcons,
  Separator,
} from '@deenruv/react-ui-devkit';

import { toast } from 'sonner';
import { AddOptionGroupDialog } from '@/pages/products/_components/AddOptionGroupDialog';
import { OptionValueCard } from '@/pages/products/_components/OptionValueCard';
import { Stack } from '@/components';
import { OptionGroup } from '@/pages/products/_components/OptionGroup';
import { Info } from 'lucide-react';

export const OptionsTab: React.FC = () => {
  const contentLng = useSettings((p) => p.translationsLanguage);
  const { id, getMarker, setLoading } = useDetailView('products-detail-view', 'CreateProductInput');

  const { t } = useTranslation('products');
  const [optionGroups, setOptionGroups] = useState<OptionGroupType[]>();
  const [optionsUsedByVariants, setOptionsUsedByVariants] = useState<string[]>([]);

  const fetchOptionGroups = useCallback(async () => {
    setLoading(true);
    if (id) {
      const response = await apiClient('query')({
        product: [{ id }, { optionGroups: OptionGroupSelector, variants: { options: { id: true } } }],
      });

      setOptionGroups(response.product?.optionGroups);
      setOptionsUsedByVariants(response.product?.variants.flatMap((v) => v.options.map((o) => o.id)) || []);
      setLoading(false);

      if (!response.product) {
        toast.error(t('toasts.fetchProductErrorToast'));
      }
    }
  }, [id]);

  useEffect(() => {
    fetchOptionGroups();
  }, [fetchOptionGroups]);

  return (
    <Stack column className="items-end">
      <Stack className="w-full gap-3" column>
        {getMarker()}
        <CustomCard
          title={t('optionGroups')}
          color="purple"
          icon={<CardIcons.group />}
          upperRight={
            <AddOptionGroupDialog currentTranslationLng={contentLng} onSuccess={fetchOptionGroups} productId={id} />
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('optionsTab.groupName')}</TableHead>
                <TableHead>{t('optionsTab.values')}</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {id && optionGroups?.length ? (
                optionGroups
                  ?.sort((a, b) => a.id.localeCompare(b.id))
                  ?.map((group) => (
                    <OptionGroup
                      contentLanguage={contentLng}
                      group={group}
                      productId={id}
                      onActionCompleted={fetchOptionGroups}
                      optionsUsedByVariants={optionsUsedByVariants}
                    />
                  ))
              ) : (
                <EmptyState
                  columnsLength={2}
                  title={t('optionsTab.emptyState.title')}
                  description={t('optionsTab.emptyState.description')}
                />
              )}
            </TableBody>
          </Table>
        </CustomCard>
        <Separator />
        {optionGroups
          ?.sort((a, b) => a.id.localeCompare(b.id))
          ?.map((oG) => (
            <CustomCard
              key={oG.id}
              variant="group"
              title={`${t('group')}: ${oG.name}`}
              icon={<CardIcons.default />}
              collapsed
              notCollapsible={!oG.options.length}
              upperRight={
                !oG.options.length && (
                  <div className="flex items-center gap-2 text-sm">
                    <Info className="h-4 w-4" />
                    {t('optionsTab.noOptionValues')}
                  </div>
                )
              }
            >
              <div className="grid grid-cols-4 gap-3">
                {oG.options
                  ?.sort((a, b) => a.id.localeCompare(b.id))
                  .map((o) => (
                    <OptionValueCard
                      key={o.id}
                      currentTranslationLng={contentLng}
                      productOption={o}
                      optionGroupId={oG.id}
                      onEdited={fetchOptionGroups}
                    />
                  ))}
              </div>
            </CustomCard>
          ))}
      </Stack>
    </Stack>
  );
};
