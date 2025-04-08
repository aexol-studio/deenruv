import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  CF,
  EntityCustomFields,
  Input,
  Label,
  Switch,
  CustomCard,
  CardIcons,
  useDetailView,
  useSettings,
  RichTextEditor,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { FiltersCard } from '@/pages/collections/_components/FiltersCard';
import { ContentsCard } from '@/pages/collections/_components/ContentsCard';
import { AssetsCard } from '@/pages/products/_components/AssetsCard.js';

export const CollectionsDetailView = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('collections');
  const contentLng = useSettings((p) => p.translationsLanguage);
  const selectedChannel = useSettings((p) => p.selectedChannel);

  const { form, fetchEntity, entity, id } = useDetailView(
    'collections-detail-view',
    'CreateCollectionInput',
    'translations',
    'assetIds',
    'featuredAssetId',
    'isPrivate',
    'inheritFilters',
    'filters',
    'customFields',
  );

  const {
    base: { setField, state },
  } = form;

  useEffect(() => {
    (async () => {
      const resp = await fetchEntity();
      if (resp === undefined) {
        navigate(-1);
        return;
      }
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
  }, [contentLng, selectedChannel?.id]);

  const translations = state?.translations?.value || [];
  const currentTranslationValue = translations.find((v) => v.languageCode === contentLng);

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
          languageCode: contentLng,
        }),
      );
    },
    [contentLng, translations],
  );

  return (
    <main>
      <div className="flex flex-col gap-3">
        <CustomCard title={t('details.basic.title')} icon={<CardIcons.basic />} color="blue">
          <div className="flex flex-wrap items-start gap-4 p-0 pt-4">
            <div className="flex w-full flex-wrap items-start gap-4 p-0 pt-4 xl:flex-nowrap">
              <div className="flex basis-full md:basis-1/3">
                <Input
                  label={t('details.basic.name')}
                  value={currentTranslationValue?.name ?? undefined}
                  onChange={(e) => setTranslationField('name', e.target.value)}
                  errors={state.translations?.errors}
                  required
                />
              </div>
              <div className="flex basis-full md:basis-1/3">
                <Input
                  label={t('details.basic.slug')}
                  value={currentTranslationValue?.slug ?? undefined}
                  onChange={(e) => setTranslationField('slug', e.target.value)}
                  required
                />
              </div>
              <div className="mt-7 flex basis-full items-center gap-3 md:basis-1/3">
                <Switch
                  checked={state.isPrivate?.value ?? undefined}
                  onCheckedChange={(e) => setField('isPrivate', e)}
                />
                <Label>{t('details.basic.isPrivate')}</Label>
              </div>
            </div>
            <div className="flex basis-full flex-col">
              <Label className="mb-2">{t('details.basic.description')}</Label>
              <RichTextEditor
                content={currentTranslationValue?.description ?? undefined}
                onContentChanged={(e) => setTranslationField('description', e)}
              />
            </div>
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
        <EntityCustomFields
          entityName="collection"
          id={id}
          hideButton
          onChange={(customFields, translations) => {
            setField('customFields', customFields);
            if (translations) setField('translations', translations as any);
          }}
          initialValues={
            entity && 'customFields' in entity
              ? { customFields: entity.customFields as CF, translations: entity.translations as any }
              : { customFields: {} }
          }
        />
        {id && <ContentsCard collectionId={id} />}
      </div>
    </main>
  );
};
