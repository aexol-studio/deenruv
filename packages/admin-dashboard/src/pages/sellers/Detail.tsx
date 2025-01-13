import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Routes, Card, CardContent, CardHeader, CardTitle, Input, apiClient } from '@deenruv/react-ui-devkit';
import { toast } from 'sonner';
import { useGFFLP } from '@/lists/useGflp';
import { areObjectsEqual } from '@/utils/deepEqual';
import { cache } from '@/lists/cache';
import { PageHeader } from '@/pages/sellers/_components/PageHeader';
import { SellerListSelector, SellerListType } from '@/graphql/sellers';
import { Stack } from '@/components';
import { useRouteGuard } from '@/hooks/useRouteGuard';

export const SellersDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editMode = useMemo(() => !!id, [id]);
  const { resetCache } = cache('sellers');
  const { t } = useTranslation('sellers');
  const [loading, setLoading] = useState(id ? true : false);
  const [seller, setSeller] = useState<SellerListType>();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  useRouteGuard({ shouldBlock: !buttonDisabled });

  const fetchSeller = useCallback(async () => {
    if (id) {
      const response = await apiClient('query')({
        seller: [
          {
            id,
          },
          SellerListSelector,
        ],
      });
      setSeller(response.seller);
      setLoading(false);
    } else setLoading(false);
  }, [id]);

  useEffect(() => {
    setLoading(true);
    fetchSeller();
  }, [id, setLoading, fetchSeller]);

  const { state, setField } = useGFFLP('CreateSellerInput', 'name')({});

  useEffect(() => {
    if (!seller) return;
    setField('name', seller.name);
  }, [seller]);

  const createSeller = useCallback(() => {
    setButtonDisabled(true);
    apiClient('mutation')({
      createSeller: [
        {
          input: {
            name: state.name!.validatedValue!,
          },
        },
        {
          id: true,
        },
      ],
    })
      .then((resp) => {
        toast.message(t('toasts.sellerCreatedSuccess'));
        navigate(Routes.sellers.to(resp.createSeller.id));
      })
      .catch(() => toast.error(t('toasts.sellerCreatedError')));
  }, [state, t, navigate]);

  const updateSeller = useCallback(() => {
    apiClient('mutation')({
      updateSeller: [
        {
          input: {
            id: id!,
            name: state.name?.validatedValue,
          },
        },
        {
          id: true,
        },
      ],
    })
      .then(() => {
        toast.message(t('toasts.sellerUpdateSuccess'));
        fetchSeller();
        resetCache();
      })
      .catch(() => toast.error(t('toasts.sellerUpdateError')));
  }, [state, resetCache, fetchSeller, id, t]);

  useEffect(() => {
    const areEqual = areObjectsEqual(
      {
        name: state.name?.value,
      },
      {
        name: seller?.name,
      },
    );

    setButtonDisabled(areEqual);
  }, [state, seller, editMode]);

  return loading ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <div className="customSpinner" />
    </div>
  ) : !seller && editMode ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      {t('toasts.sellerLoadingError', { value: id })}
    </div>
  ) : (
    <main className="my-4 min-h-96">
      <div className="mx-auto flex  w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <PageHeader
          seller={seller}
          editMode={editMode}
          buttonDisabled={buttonDisabled}
          onCreate={createSeller}
          onEdit={updateSeller}
        />
        <Stack column className="gap-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row justify-between text-base">{t('details.basic.title')}</CardTitle>
              <CardContent className="flex flex-col gap-4 p-0 pt-4">
                <Stack column className="gap-3">
                  <Input
                    className="w-1/2"
                    label={t('details.basic.name')}
                    value={state.name?.value}
                    onChange={(e) => setField('name', e.target.value)}
                    required
                  />
                </Stack>
              </CardContent>
            </CardHeader>
          </Card>
        </Stack>
      </div>
    </main>
  );
};
