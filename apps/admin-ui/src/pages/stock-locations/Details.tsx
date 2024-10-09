import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiCall } from '@/graphql/client';
import { Card, CardContent, CardHeader, CardTitle, Input, Label, Stack } from '@/components';
import { toast } from 'sonner';
import { useGFFLP } from '@/lists/useGflp';
import { areObjectsEqual } from '@/utils/deepEqual';
import { cache } from '@/lists/cache';
import { PageHeader } from '@/pages/stock-locations/_components/PageHeader';
import { Routes } from '@/utils';
import { StockLocationListSelector, StockLocationListType } from '@/graphql/stockLocations';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';

export const StockLocationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editMode = useMemo(() => !!id, [id]);
  const { resetCache } = cache('stockLocations');
  const { t } = useTranslation('stockLocations');
  const [loading, setLoading] = useState(id ? true : false);
  const [stockLocation, setStockLocation] = useState<StockLocationListType>();
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const fetchStockLocation = useCallback(async () => {
    if (id) {
      const response = await apiCall()('query')({
        stockLocation: [
          {
            id,
          },
          StockLocationListSelector,
        ],
      });
      setStockLocation(response.stockLocation);
      setLoading(false);
    } else setLoading(false);
  }, [id]);

  useEffect(() => {
    setLoading(true);
    fetchStockLocation();
  }, [id, setLoading, fetchStockLocation]);

  const { state, setField } = useGFFLP('CreateStockLocationInput', 'name', 'description')({});

  useEffect(() => {
    if (!stockLocation) return;
    setField('name', stockLocation.name);
    setField('description', stockLocation.description);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockLocation]);

  const createStockLocation = useCallback(() => {
    apiCall()('mutation')({
      createStockLocation: [
        {
          input: {
            name: state.name!.validatedValue!,
            description: state.description!.validatedValue!,
          },
        },
        {
          id: true,
        },
      ],
    })
      .then((resp) => {
        toast.message(t('toasts.stockLocationCreatedSuccess'));
        navigate(Routes.stockLocation.to(resp.createStockLocation.id));
      })
      .catch(() => toast.error(t('toasts.stockLocationCreatedError')));
  }, [state, t, navigate]);

  const updateStockLocation = useCallback(() => {
    apiCall()('mutation')({
      updateStockLocation: [
        {
          input: {
            id: id!,
            name: state.name?.validatedValue,
            description: state.description?.validatedValue,
          },
        },
        {
          id: true,
        },
      ],
    })
      .then(() => {
        toast.message(t('toasts.stockLocationUpdateSuccess'));
        fetchStockLocation();
        resetCache();
      })
      .catch(() => toast.error(t('toasts.stockLocationUpdateError')));
  }, [state, resetCache, fetchStockLocation, id, t]);

  useEffect(() => {
    const areEqual = areObjectsEqual(
      {
        name: state.name?.value,
        description: state.description?.value,
      },
      {
        name: stockLocation?.name,
        description: stockLocation?.description,
      },
    );

    editMode && setButtonDisabled(areEqual);
  }, [state, stockLocation, editMode]);

  return loading ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <div className="customSpinner" />
    </div>
  ) : !stockLocation && editMode ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      {t('toasts.stockLocationLoadingError', { value: id })}
    </div>
  ) : (
    <main className="min-h-96">
      <div className="mx-auto flex  w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <PageHeader
          stockLocation={stockLocation}
          editMode={editMode}
          buttonDisabled={buttonDisabled}
          onCreate={createStockLocation}
          onEdit={updateStockLocation}
        />
        <Stack column className="gap-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row justify-between text-base">{t('details.basic.title')}</CardTitle>
              <CardContent className="flex flex-col gap-4 p-0 pt-4">
                <Stack column className="gap-3">
                  <Input
                    label={t('details.basic.name')}
                    value={state.name?.value}
                    onChange={(e) => setField('name', e.target.value)}
                    required
                  />
                  <Stack column className="basis-full">
                    <Label className="mb-2">{t('details.basic.description')}</Label>
                    <RichTextEditor
                      content={state.description?.value}
                      onContentChanged={(e) => setField('description', e)}
                    />
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
