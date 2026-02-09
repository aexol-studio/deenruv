import {
  useDetailView,
  DetailViewMarker,
  useSettings,
  setInArrayBy,
  CF,
  EntityCustomFields,
  normalizeString,
} from '@deenruv/react-ui-devkit';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { BasicFieldsCard } from './BasicFieldsCard';
import { AssetsCard } from './AssetsCard';

export const PRODUCT_FORM_KEYS = [
  'CreateProductInput',
  'translations',
  'assetIds',
  'featuredAssetId',
  'facetValueIds',
  'enabled',
  'customFields',
] as const;

export const ProductDetailView = () => {
  const contentLng = useSettings((p) => p.translationsLanguage);
  const selectedChannel = useSettings((p) => p.selectedChannel);
  const { entity, id, form, loading, fetchEntity } = useDetailView('products-detail-view', ...PRODUCT_FORM_KEYS);
  const { base } = form;

  // --- Slug auto-generation ---
  // Track whether the user has manually edited the slug for the current language.
  // Using a ref avoids extra re-renders; keyed per-language so switching tabs resets.
  const slugManuallyEditedRef = useRef<Record<string, boolean>>({});

  // Reset manual-edit flag when switching to a language whose slug is still empty
  // (so auto-gen kicks in for new translations).
  useEffect(() => {
    if (!contentLng) return;
    const current = slugManuallyEditedRef.current[contentLng];
    if (current === undefined) {
      slugManuallyEditedRef.current[contentLng] = false;
    }
  }, [contentLng]);

  useEffect(() => {
    (async () => {
      const res = await fetchEntity();
      if (!res) return;
      base.setField('translations', res.translations);
      base.setField(
        'assetIds',
        res.assets.map((a) => a.id),
      );
      base.setField('featuredAssetId', res.featuredAsset?.id);
    })();
  }, [selectedChannel?.id, contentLng]);

  const translations = base.watch('translations') || [];
  const currentTranslationValue = useMemo(() => {
    return translations.find((v: any) => v.languageCode === contentLng);
  }, [translations, contentLng]);

  const setTranslationField = useCallback(
    (field: string, e: string) => {
      const updatedTranslation: Record<string, unknown> = {
        ...currentTranslationValue,
        [field]: e,
        languageCode: contentLng,
      };

      // Auto-generate slug when name changes
      if (field === 'name') {
        const isCreate = id === undefined;
        const existingSlug = currentTranslationValue?.slug;
        const slugWasManuallyEdited = slugManuallyEditedRef.current[contentLng ?? ''];

        // Auto-fill slug when:
        // 1. Create mode: always, unless user manually edited slug
        // 2. Edit mode: only if the existing slug is empty/missing
        if (!slugWasManuallyEdited && (isCreate || !existingSlug)) {
          updatedTranslation.slug = normalizeString(e, '-');
        }
      }

      base.setField(
        'translations',
        setInArrayBy(translations, (t: any) => t.languageCode === contentLng, updatedTranslation),
      );
    },
    [contentLng, translations, currentTranslationValue, id],
  );

  const handleSlugManualEdit = useCallback(() => {
    if (contentLng) {
      slugManuallyEditedRef.current[contentLng] = true;
    }
  }, [contentLng]);

  const handleAddAsset = useCallback(
    (newId: string | undefined | null) => {
      if (!newId) return;
      const currentIds = base.watch('assetIds') || [];
      base.setField('assetIds', [...currentIds, newId]);
    },
    [base, base.setField],
  );

  return (
    <div>
      <div className="flex w-full flex-col gap-4">
        <BasicFieldsCard
          currentTranslationValue={currentTranslationValue}
          onChange={setTranslationField}
          onSlugManualEdit={handleSlugManualEdit}
          errors={base.formState.errors?.translations?.message ? [base.formState.errors.translations.message as string] : undefined}
        />
        <DetailViewMarker position={'products-detail-view'} />
        <EntityCustomFields
          id={id}
          entityName="product"
          hideButton
          onChange={(customFields, translations) => {
            base.setField('customFields', customFields);
            if (translations) base.setField('translations', translations as any);
          }}
          initialValues={
            entity && 'customFields' in entity
              ? { customFields: entity.customFields as CF, translations: entity.translations as any }
              : { customFields: {} }
          }
        />
        <AssetsCard
          onAddAsset={handleAddAsset}
          featuredAssetId={base.watch('featuredAssetId')}
          assetsIds={base.watch('assetIds')}
          onFeaturedAssetChange={(id) => base.setField('featuredAssetId', id)}
          onAssetsChange={(ids) => base.setField('assetIds', ids)}
        />
      </div>
    </div>
  );
};
