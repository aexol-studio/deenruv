import { OptionGroupSelector, OptionGroupType } from '@/graphql/products';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  MultipleSelector,
  type Option,
  useDetailView,
  apiClient,
} from '@deenruv/react-ui-devkit';
import { Trash } from 'lucide-react';

import { toast } from 'sonner';
import { AddOptionGroupDialog } from '@/pages/products/_components/AddOptionGroupDialog';
import { OptionValueCard } from '@/pages/products/_components/OptionValueCard';
import { Stack } from '@/components';

export const OptionsTab: React.FC = () => {
  const { id, contentLanguage, setContentLanguage, getMarker } = useDetailView(
    'products-detail-view',
    ({ id, contentLanguage, setContentLanguage, getMarker }) => ({
      id,
      contentLanguage,
      setContentLanguage,
      getMarker,
    }),
    'CreateProductInput',
  );
  const { t } = useTranslation('products');
  const [optionGroups, setOptionGroups] = useState<OptionGroupType[]>();
  const [loading, setLoading] = useState<boolean>(true);

  const fetchOptionGroups = useCallback(async () => {
    if (id) {
      const response = await apiClient('query')({
        product: [{ id }, { optionGroups: OptionGroupSelector }],
      });

      setOptionGroups(response.product?.optionGroups);
      setLoading(false);

      if (!response.product) {
        toast.error(t('toasts.fetchProductErrorToast'));
      }
    }
  }, [id]);

  useEffect(() => {
    fetchOptionGroups();
  }, [fetchOptionGroups]);

  const removeGroup = useCallback(
    (optionGroupId: string) => {
      if (!id) return;
      apiClient('mutation')({
        removeOptionGroupFromProduct: [
          { optionGroupId, productId: id },
          { '...on Product': { id: true }, '...on ProductOptionInUseError': { message: true } },
        ],
      })
        .then(() => {
          toast(t('toasts.deletionOptionSuccessToast'));
          fetchOptionGroups();
        })
        .catch(() => {
          toast.error(t('toasts.deletionOptionErrorToast'));
        });
    },
    [id, fetchOptionGroups, t],
  );

  const addOption = useCallback(
    (option: Option, optionGroupId: string) => {
      if (!id) return;
      apiClient('mutation')({
        createProductOption: [
          {
            input: {
              code: option.label.replace(/\s/g, ''),
              productOptionGroupId: optionGroupId,
              translations: [{ languageCode: contentLanguage, name: option.label }],
            },
          },
          { id: true },
        ],
      })
        .then(() => {
          toast(t('toasts.createOptionSuccessToast'));
        })
        .catch(() => {
          toast(t('toasts.createOptionErrorToast'));
        });
    },
    [id, contentLanguage, t],
  );

  const handleChange = useCallback(
    (currentOptions: Option[], optionGroupId: string) => {
      const correspondingGroup = optionGroups?.find((g) => g.id === optionGroupId);

      if (correspondingGroup && correspondingGroup?.options.length < currentOptions.length) {
        const newOption = currentOptions[currentOptions.length - 1];
        addOption(newOption, optionGroupId);
      }
    },
    [optionGroups, addOption],
  );

  return (
    <Stack column className="items-end">
      <Stack className="mb-4 w-fit">
        <AddOptionGroupDialog currentTranslationLng={contentLanguage} onSuccess={fetchOptionGroups} productId={id} />
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
                  {optionGroups
                    ?.sort((a, b) => a.id.localeCompare(b.id))
                    ?.map((group) => (
                      <TableRow key={group.id}>
                        <TableCell className="font-medium">{group.name}</TableCell>
                        <TableCell>
                          <MultipleSelector
                            className="h-20"
                            value={group.options
                              ?.sort((a, b) => a.id.localeCompare(b.id))
                              .map((o) => ({ label: o.name, value: o.id, fixed: true }))}
                            placeholder={t('optionsTab.placeholder')}
                            onChange={(e) => handleChange(e, group.id)}
                            hideClearAllButton
                            creatable
                          />
                        </TableCell>
                        <TableCell className="w-12">
                          <Button
                            size={'icon'}
                            variant={'outline'}
                            className="h-8 w-8"
                            onClick={() => removeGroup(group.id)}
                          >
                            <Trash size={20} className="text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          {optionGroups
            ?.sort((a, b) => a.id.localeCompare(b.id))
            ?.map((oG) => (
              <Stack column className="gap-2" key={oG.id}>
                <h4 className="ml-6 text-sm font-semibold text-gray-500">{`${t('group')}: ${oG.name}`}</h4>
                <div className="flex flex-col gap-3">
                  {oG.options
                    ?.sort((a, b) => a.id.localeCompare(b.id))
                    .map((o) => (
                      <OptionValueCard
                        key={o.id}
                        currentTranslationLng={contentLanguage}
                        productOption={o}
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
