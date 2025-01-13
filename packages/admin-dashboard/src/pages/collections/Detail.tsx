import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  Routes,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Switch,
  apiClient,
} from '@deenruv/react-ui-devkit';
import { toast } from 'sonner';
import { setInArrayBy, useGFFLP } from '@/lists/useGflp';
import { areObjectsEqual } from '@/utils/deepEqual';
import { cache } from '@/lists/cache';
import { PageHeader } from '@/pages/collections/_components/PageHeader';
import { CollectionDetailsSelector, CollectionDetailsType } from '@/graphql/collections';
import { LanguageCode } from '@deenruv/admin-types';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';
import { AssetsCard } from '@/pages/collections/_components/AssetsCard';
import { FiltersCard } from '@/pages/collections/_components/FiltersCard';
import { ContentsCard } from '@/pages/collections/_components/ContentsCard';
import { EntityCustomFields, Stack } from '@/components';
import { useRouteGuard } from '@/hooks/useRouteGuard';

export const CollectionsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editMode = useMemo(() => !!id, [id]);
  const { resetCache } = cache('collections');
  const { t } = useTranslation('collections');
  const [loading, setLoading] = useState(id ? true : false);
  const [collection, setCollection] = useState<CollectionDetailsType>();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [currentTranslationLng, setCurrentTranslationLng] = useState(LanguageCode.en);
  useRouteGuard({ shouldBlock: !buttonDisabled });

  const fetchCollection = useCallback(async () => {
    if (id) {
      const response = await apiClient('query')({
        collection: [
          {
            id,
          },
          CollectionDetailsSelector,
        ],
      });
      setCollection(response.collection);
      setLoading(false);
    } else setLoading(false);
  }, [id]);

  useEffect(() => {
    setLoading(true);
    fetchCollection();
  }, [id, setLoading, fetchCollection]);

  const { state, setField } = useGFFLP(
    'UpdateCollectionInput',
    'translations',
    'assetIds',
    'customFields',
    'featuredAssetId',
    'isPrivate',
    'inheritFilters',
    'filters',
  )({
    isPrivate: {
      initialValue: true,
    },
    inheritFilters: {
      initialValue: true,
    },
  });

  const translations = state?.translations?.value || [];
  const currentTranslationValue = translations.find((v) => v.languageCode === currentTranslationLng);

  useEffect(() => {
    if (!collection) return;

    setField('translations', collection.translations);
    setField('featuredAssetId', collection.featuredAsset?.id);
    setField('inheritFilters', collection.inheritFilters);
    setField('isPrivate', collection.isPrivate);
    // setField('customFields', {
    //   facebookImageId: collection.customFields?.facebookImage?.id,
    //   twitterImageId: collection.customFields?.twitterImage?.id,
    // });
    setField(
      'assetIds',
      collection.assets.map((a) => a.id),
    );
    setField(
      'filters',
      collection.filters.map((f) => ({ code: f.code, arguments: f.args })),
    );
  }, [collection]);

  const createCollection = useCallback(() => {
    setButtonDisabled(true);
    apiClient('mutation')({
      createCollection: [
        {
          input: {
            assetIds: state.assetIds?.validatedValue,
            featuredAssetId: state.featuredAssetId?.validatedValue,
            isPrivate: state.isPrivate?.validatedValue,
            inheritFilters: state.inheritFilters?.validatedValue,
            customFields: state.customFields?.validatedValue,
            filters: state.filters!.validatedValue!,
            translations: state.translations!.validatedValue!.map((t) => ({
              description: t.description || '',
              name: t.name || '',
              languageCode: t.languageCode,
              slug: t.slug || '',
              // customFields: {
              //   seoDescription: t.customFields?.seoDescription || '',
              //   seoTitle: t.customFields?.seoTitle || '',
              // },
            })),
          },
        },
        {
          id: true,
        },
      ],
    })
      .then((resp) => {
        if (resp.createCollection) {
          toast.message(t('toasts.collectionCreatedSuccess'));
          navigate(Routes.collections.to(resp.createCollection.id));
        }
      })
      .catch(() => toast.error(t('toasts.collectionCreatedError')));
  }, [state, t, navigate]);

  const updateCollection = useCallback(() => {
    apiClient('mutation')({
      updateCollection: [
        {
          input: {
            id: id!,
            assetIds: state.assetIds?.validatedValue,
            featuredAssetId: state.featuredAssetId?.validatedValue,
            isPrivate: state.isPrivate?.validatedValue,
            inheritFilters: state.inheritFilters?.validatedValue,
            customFields: state.customFields?.validatedValue,
            filters: state.filters?.validatedValue,
            translations: state.translations?.validatedValue,
          },
        },
        {
          id: true,
        },
      ],
    })
      .then(() => {
        toast.message(t('toasts.collectionUpdateSuccess'));
        fetchCollection();
        resetCache();
      })
      .catch(() => toast.error(t('toasts.collectionUpdateError')));
  }, [state, resetCache, fetchCollection, id, t]);

  useEffect(() => {
    const areEqual = areObjectsEqual(
      {
        assetIds: state.assetIds?.value,
        featuredAssetId: state.featuredAssetId?.value,
        isPrivate: state.isPrivate?.validatedValue,
        inheritFilters: state.inheritFilters?.value,
        // customFields: state.customFields?.value,
        filters: state.filters?.value,
        translations: state.translations?.value,
      },
      {
        assetIds: collection?.assets.map((a) => a.id),
        featuredAssetId: collection?.featuredAsset?.id,
        isPrivate: collection?.isPrivate,
        inheritFilters: editMode ? collection?.isPrivate : true,
        // customFields: collection?.customFields,
        filters: collection?.filters,
        translations: collection?.translations,
      },
    );

    setButtonDisabled(areEqual);
  }, [state, collection, editMode]);

  const setTranslationField = useCallback(
    (field: string, e: string) => {
      setField(
        'translations',
        setInArrayBy(translations, (t) => t.languageCode !== currentTranslationLng, {
          [field]: e,
          languageCode: currentTranslationLng,
        }),
      );
    },

    [currentTranslationLng, translations],
  );

  return loading ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <div className="customSpinner" />
    </div>
  ) : !collection && editMode ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      {t('toasts.collectionLoadingError', { value: id })}
    </div>
  ) : (
    <main className="my-4">
      <div className="mx-auto flex  w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <PageHeader
          currentTranslationLng={currentTranslationLng}
          onCurrentLanguageChange={(e) => {
            setCurrentTranslationLng(e as LanguageCode);
          }}
          collection={collection}
          editMode={editMode}
          buttonDisabled={buttonDisabled}
          onCreate={createCollection}
          onEdit={updateCollection}
        />
        <Stack column className="gap-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row justify-between text-base">{t('details.basic.title')}</CardTitle>
              <CardContent className="flex flex-wrap items-start gap-4 p-0 pt-4">
                <Stack className="flex w-full flex-wrap items-end gap-4 p-0 pt-4 xl:flex-nowrap">
                  <Stack className="basis-full md:basis-1/3">
                    <Input
                      label={t('details.basic.name')}
                      value={currentTranslationValue?.name ?? undefined}
                      onChange={(e) => setTranslationField('name', e.target.value)}
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
                  <Stack className="mb-2 basis-full items-center gap-3 md:basis-1/3">
                    <Switch checked={state.isPrivate?.value ?? undefined} onCheckedChange={(e) => setField('isPrivate', e)} />
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
              </CardContent>
            </CardHeader>
          </Card>
          <AssetsCard
            onAddAsset={(id) => setField('assetIds', [...(state.assetIds?.value || []), id])}
            featuredAssetId={state.featuredAssetId?.value ?? undefined}
            assetsIds={state.assetIds?.value ?? undefined}
            onFeaturedAssetChange={(id) => setField('featuredAssetId', id)}
            onAssetsChange={(ids) => setField('assetIds', ids)}
          />
          <FiltersCard
            currentFiltersValue={state.filters?.value ?? undefined}
            onFiltersValueChange={(filters) => setField('filters', filters)}
            inheritValue={state.inheritFilters?.value ?? undefined}
            onInheritChange={(e) => setField('inheritFilters', e)}
          />
          {id && <EntityCustomFields entityName="collection" id={id} />}
          <ContentsCard collectionId={id} />
        </Stack>
      </div>
    </main>
  );
};
