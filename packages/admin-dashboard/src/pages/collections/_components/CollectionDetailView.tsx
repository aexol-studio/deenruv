import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Input, Label, Switch, CustomCard, CardIcons, useDetailView, useSettings } from '@deenruv/react-ui-devkit';
import { setInArrayBy } from '@/lists/useGflp';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';
import { FiltersCard } from '@/pages/collections/_components/FiltersCard';
import { ContentsCard } from '@/pages/collections/_components/ContentsCard';
import { EntityCustomFields, Stack } from '@/components';
import { AssetsCard } from '@/pages/products/_components/AssetsCard.js';

export const CollectionsDetailView = () => {
  const { id } = useParams();
  const { t } = useTranslation('collections');
  const { translationsLanguage: currentTranslationLng } = useSettings();

  const { form, fetchEntity } = useDetailView(
    'collections-detail-view',
    'CreateCollectionInput',
    'translations',
    'assetIds',
    'featuredAssetId',
    'isPrivate',
    'inheritFilters',
    'filters',
  );

  const {
    base: { setField, state },
  } = form;

  useEffect(() => {
    (async () => {
      const resp = await fetchEntity();
      if (!resp) return;

      setField('translations', resp.translations);
      setField(
        'assetIds',
        resp.assets.map((a) => a.id),
      );
      setField('featuredAssetId', resp.featuredAsset?.id);
      setField('isPrivate', resp.isPrivate);
      setField('inheritFilters', resp.inheritFilters);
      setField(
        'filters',
        resp.filters.map((f) => ({ code: f.code, arguments: f.args })),
      );
    })();
  }, []);

  const translations = state?.translations?.value || [];
  const currentTranslationValue = translations.find((v) => v.languageCode === currentTranslationLng);

  const handleAddAsset = useCallback(
    (newId: string | undefined | null) => {
      if (!newId) return;
      const currentIds = state.assetIds?.value || [];
      setField('assetIds', [...currentIds, newId]);
    },
    [state.assetIds?.value, setField],
  );

  const setTranslationField = useCallback(
    (field: string, e: string) => {
      setField(
        'translations',
        // @ts-ignore
        setInArrayBy(translations, (t) => t.languageCode !== currentTranslationLng, {
          ...currentTranslationValue,
          [field]: e,
          languageCode: currentTranslationLng,
        }),
      );
    },
    [currentTranslationLng, translations],
  );

  return (
    <main>
      <div className="mx-auto flex  w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <Stack column className="gap-3">
          <CustomCard title={t('details.basic.title')} icon={<CardIcons.basic />} color="blue">
            <div className="flex flex-wrap items-start gap-4 p-0 pt-4">
              <Stack className="flex w-full flex-wrap items-start gap-4 p-0 pt-4 xl:flex-nowrap">
                <Stack className="basis-full md:basis-1/3">
                  <Input
                    label={t('details.basic.name')}
                    value={currentTranslationValue?.name ?? undefined}
                    onChange={(e) => setTranslationField('name', e.target.value)}
                    errors={state.translations?.errors}
                    required
                  />
                </Stack>
                <Stack className="basis-full md:basis-1/3">
                  <Input
                    label={t('details.basic.slug')}
                    value={currentTranslationValue?.slug ?? undefined}
                    onChange={(e) => setTranslationField('slug', e.target.value)}
                    required
                  />
                </Stack>
                <Stack className="mt-7 basis-full items-center gap-3 md:basis-1/3">
                  <Switch
                    checked={state.isPrivate?.value ?? undefined}
                    onCheckedChange={(e) => setField('isPrivate', e)}
                  />
                  <Label>{t('details.basic.isPrivate')}</Label>
                </Stack>
              </Stack>
              <Stack column className="basis-full">
                <Label className="mb-2">{t('details.basic.description')}</Label>
                <RichTextEditor
                  content={currentTranslationValue?.description ?? undefined}
                  onContentChanged={(e) => setTranslationField('description', e)}
                />
              </Stack>
            </div>
          </CustomCard>
          <AssetsCard
            onAddAsset={handleAddAsset}
            featuredAssetId={state.featuredAssetId?.value ?? undefined}
            assetsIds={state.assetIds?.value ?? undefined}
            onFeaturedAssetChange={(id) => setField('featuredAssetId', id)}
            onAssetsChange={(ids) => setField('assetIds', ids)}
          />
          <FiltersCard
            currentFiltersValue={state.filters?.value ?? undefined}
            onFiltersValueChange={(filters) => setField('filters', filters ?? [])}
            inheritValue={state.inheritFilters?.value ?? undefined}
            onInheritChange={(e) => setField('inheritFilters', e)}
            errors={state.filters?.errors}
          />
          {id && <EntityCustomFields entityName="collection" id={id} />}
          <ContentsCard collectionId={id} />
        </Stack>
      </div>
    </main>
  );
};
