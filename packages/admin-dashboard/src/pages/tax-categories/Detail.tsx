import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiCall } from '@/graphql/client';
import { Card, CardContent, CardHeader, CardTitle, Input, Label, Stack, Switch } from '@/components';
import { toast } from 'sonner';
import { useGFFLP } from '@/lists/useGflp';
import { areObjectsEqual } from '@/utils/deepEqual';
import { cache } from '@/lists/cache';
import { PageHeader } from '@/pages/tax-categories/_components/PageHeader';
import { Routes } from '@/utils';
import { TaxCategoryListSelector, TaxCategoryListType } from '@/graphql/taxCategories';

export const TaxCategoriesDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editMode = useMemo(() => !!id, [id]);
  const { resetCache } = cache('taxCategories');
  const { t } = useTranslation('taxCategories');
  const [loading, setLoading] = useState(id ? true : false);
  const [taxCategory, setTaxCategory] = useState<TaxCategoryListType>();
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const fetchTaxCategory = useCallback(async () => {
    if (id) {
      const response = await apiCall()('query')({
        taxCategory: [
          {
            id,
          },
          TaxCategoryListSelector,
        ],
      });
      setTaxCategory(response.taxCategory);
      setLoading(false);
    } else setLoading(false);
  }, [id]);

  useEffect(() => {
    setLoading(true);
    fetchTaxCategory();
  }, [id, setLoading, fetchTaxCategory]);

  const { state, setField } = useGFFLP(
    'UpdateTaxCategoryInput',
    'name',
    'isDefault',
  )({
    isDefault: {
      initialValue: false,
    },
  });

  useEffect(() => {
    if (!taxCategory) return;
    setField('name', taxCategory.name);
    setField('isDefault', taxCategory.isDefault);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxCategory]);

  const createTaxCategory = useCallback(() => {
    apiCall()('mutation')({
      createTaxCategory: [
        {
          input: {
            name: state.name!.validatedValue!,
            isDefault: state.isDefault!.validatedValue!,
          },
        },
        {
          id: true,
        },
      ],
    })
      .then((resp) => {
        toast.message(t('toasts.taxCategoryCreatedSuccess'));
        navigate(Routes.taxCategories.to(resp.createTaxCategory.id));
      })
      .catch(() => toast.error(t('toasts.taxCategoryCreatedError')));
  }, [state, t, navigate]);

  const updateTaxCategory = useCallback(() => {
    apiCall()('mutation')({
      updateTaxCategory: [
        {
          input: {
            id: id!,
            name: state.name?.validatedValue,
            isDefault: state.isDefault?.validatedValue,
          },
        },
        {
          id: true,
        },
      ],
    })
      .then(() => {
        toast.message(t('toasts.taxCategoryUpdateSuccess'));
        fetchTaxCategory();
        resetCache();
      })
      .catch(() => toast.error(t('toasts.taxCategoryUpdateError')));
  }, [state, resetCache, fetchTaxCategory, id, t]);

  useEffect(() => {
    const areEqual = areObjectsEqual(
      {
        name: state.name?.value,
        isDefault: state.isDefault?.value,
      },
      {
        name: taxCategory?.name,
        isDefault: taxCategory?.isDefault,
      },
    );

    editMode && setButtonDisabled(areEqual);
  }, [state, taxCategory, editMode]);

  return loading ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <div className="customSpinner" />
    </div>
  ) : !taxCategory && editMode ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      {t('toasts.taxCategoryLoadingError', { value: id })}
    </div>
  ) : (
    <main className="min-h-96">
      <div className="mx-auto flex  w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <PageHeader
          taxCategory={taxCategory}
          editMode={editMode}
          buttonDisabled={buttonDisabled}
          onCreate={createTaxCategory}
          onEdit={updateTaxCategory}
        />
        <Stack column className="gap-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row justify-between text-base">{t('details.basic.title')}</CardTitle>
              <CardContent className="flex flex-col gap-4 p-0 pt-4">
                <Stack className="items-end gap-4">
                  <Stack className="basis-full md:basis-1/2">
                    <Input
                      label={t('details.basic.name')}
                      value={state.name?.value}
                      onChange={(e) => setField('name', e.target.value)}
                      required
                    />
                  </Stack>
                  <Stack className="mb-2 basis-full items-center gap-3 md:basis-1/2">
                    <Switch checked={state.isDefault?.value} onCheckedChange={(e) => setField('isDefault', e)} />
                    <Label>{t('details.basic.isDefault')}</Label>
                  </Stack>
                </Stack>
              </CardContent>
            </CardHeader>
          </Card>
        </Stack>
      </div>
    </main>
  );
};
