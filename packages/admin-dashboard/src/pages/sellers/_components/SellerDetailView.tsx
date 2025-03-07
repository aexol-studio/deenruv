import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DetailViewMarker,
  Input,
  useDetailView,
} from '@deenruv/react-ui-devkit';
import { EntityCustomFields, Stack } from '@/components';

export const SellerDetailView = () => {
  const { form, loading, fetchEntity, entity } = useDetailView('sellers-detail-view', 'CreateSellerInput', 'name');

  const {
    base: { setField, state },
  } = form;

  const { id } = useParams();
  const editMode = useMemo(() => !!id, [id]);
  const { t } = useTranslation('sellers');

  useEffect(() => {
    (async () => {
      const res = await fetchEntity();

      if (!res) return;

      setField('name', res.name);
    })();
  }, []);

  return loading ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <div className="customSpinner" />
    </div>
  ) : !entity && editMode ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      {t('toasts.sellerLoadingError', { value: id })}
    </div>
  ) : (
    <main className="my-4 min-h-96">
      <div className="mx-auto flex  w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
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
                    errors={state.name?.errors}
                    required
                  />
                </Stack>
              </CardContent>
            </CardHeader>
          </Card>
          <DetailViewMarker position={'sellers-detail-view'} />
          {id && <EntityCustomFields entityName="seller" id={id} />}
        </Stack>
      </div>
    </main>
  );
};
