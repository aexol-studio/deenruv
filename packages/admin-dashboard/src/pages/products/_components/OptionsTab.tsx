import { OptionGroupSelector, OptionGroupType } from '@/graphql/products';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  useDetailView,
  apiClient,
  useSettings,
  EmptyState,
} from '@deenruv/react-ui-devkit';

import { toast } from 'sonner';
import { AddOptionGroupDialog } from '@/pages/products/_components/AddOptionGroupDialog';
import { OptionValueCard } from '@/pages/products/_components/OptionValueCard';
import { Stack } from '@/components';
import { OptionGroup } from '@/pages/products/_components/OptionGroup';

export const OptionsTab: React.FC = () => {
  const contentLng = useSettings((p) => p.translationsLanguage);
  const { id, getMarker } = useDetailView('products-detail-view', 'CreateProductInput');

  const { t } = useTranslation('products');
  const [optionGroups, setOptionGroups] = useState<OptionGroupType[]>();
  const [optionsUsedByVariants, setOptionsUsedByVariants] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchOptionGroups = useCallback(async () => {
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
      <Stack className="mb-4 w-fit">
        <AddOptionGroupDialog currentTranslationLng={contentLng} onSuccess={fetchOptionGroups} productId={id} />
      </Stack>
      {loading ? (
        <div className="flex min-h-[30vh] w-full items-center justify-center">
          <div className="customSpinner" />
        </div>
      ) : (
        <Stack className="w-full gap-3" column>
          {getMarker()}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex flex-row justify-between text-base">{t('optionGroups')}</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
          {optionGroups
            ?.sort((a, b) => a.id.localeCompare(b.id))
            ?.map((oG) => (
              <Stack column className="gap-2" key={oG.id}>
                <h4 className="ml-6 text-sm font-semibold text-gray-500">{`${t('group')}: ${oG.name}`}</h4>
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
              </Stack>
            ))}
        </Stack>
      )}
    </Stack>
  );
};
